import Company from '../models/Companies.js';
import Department from '../models/Departments.js';
import User from '../models/Users.js';
import Role from '../models/Roles.js';
import Task from '../models/Tasks.js';
import Objective from '../models/Objectives.js';
import { generateAccessToken } from '../utils/jwtHelper.js';

class CompanyController {
  static async createCompany (req, res) {
    const { name, subscriptionPlan, companyDepartments } = req.body;
    const { _id: userId, companyRoles } = req.user;

    const company = new Company({
      name, subscriptionPlan, companyDepartments
    });

    try {
      // Saving the new company
      const savedCompany = await company.save();

      // Creating a new department called 'Cascade' for new companies
      const department = new Department({
        name: 'Cascade',
        companyId: savedCompany._id,
        roles: []
      });

      const savedDepartment = await department.save();

      // Adding the new department to the company's departments array
      savedCompany.companyDepartments.push({
        departmentId: savedDepartment._id,
        departmentName: savedDepartment.name
      });
      // Saving the updated company with the new department
      await savedCompany.save();

      // Creating a new role for the company admin within the 'Cascade' department
      const adminRole = new Role({
        departmentId: savedDepartment._id,
        userId,
        hierarchyLevel: 'COMPANY_ADMIN',
        jobTitle: 'Company Admin',
        jobDescription: 'Responsible for managing the company in Cascade.',
        supervisedBy: [],
        supervises: [],
        permissions: []
      });
      const savedAdminRole = await adminRole.save();

      // Adding the new role to t he department's roles array
      savedDepartment.roles.push(savedAdminRole._id);
      await savedDepartment.save();

      // Updating the user's companyRoles with the new role
      companyRoles.push({
        companyId: savedCompany._id,
        departmentId: savedDepartment._id,
        roleId: savedAdminRole._id
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId, { companyRoles }, { new: true }
      );

      // Generate a new access token with updated roles
      const payload = {
        _id: updatedUser._id,
        webAppRole: updatedUser.webAppRole,
        companyRoles: updatedUser.companyRoles
      };
      const newAccessToken = generateAccessToken(payload);

      return res.status(201).json({
        status: 'success',
        data: { savedCompany, accessToken: newAccessToken },
        message: 'Company & admin role created successfully, and user updated.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getCompany (req, res) {
    // GET the company by its ID.
    const { companyId } = req.params;
    try {
      const company = await Company.findById(companyId);
      return res.status(200).json({
        status: 'success',
        data: { company },
        message: 'Company data retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getCompanies (req, res) {
    // GET the companies related to the user's companyRoles.
    const { companyRoles } = req.user;
    try {
      // ruling out any null values, where companies may not be found.
      const companyDataPromises = companyRoles.filter(company => company)
        .map(role => {
          return Company.findById(role.companyId);
        });
      const companies = await Promise.all(companyDataPromises);

      const companiesDetails = companies.map(company => {
        return {
          _id: company._id,
          name: company.name,
          companyDepartments: company.companyDepartments
        }
      });

      return res.status(200).json({
        status: 'success',
        data: { companies: companiesDetails },
        message: 'Related companies data are retrieved.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateCompany (req, res) {
    // Update the company by its ID.
    const { companyId } = req.params;
    const { name, subscriptionPlan } = req.body;
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { name, subscriptionPlan },
        { new: true }
      );

      if (!updatedCompany) {
        return res.status(404).json({
          status: 'error',
          message: 'Company not found.',
          error: 'Invalid company ID.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { updatedCompany},
        message: 'Company has been updated successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteCompany (req, res) {
    // Delete the company by its ID.
    const { companyId } = req.params;
    const { _id: userId, companyRoles } = req.user;
    try {
      // Check if the company exists
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({
          status: 'error',
          message: 'Company not found.',
          error: 'Invalid company ID.'
        });
      }

      // Find all departments associatied with the company
      const departments = await Department.find({ companyId });
      // Collect all department IDs
      const departmentIds = departments.map(department => department._id);

      // Find all roles associated with these departments
      const roles = await Role.find({ departmentId: { $in: departmentIds } });
      // Collect all role IDs
      const roleIds = roles.map(role => role._id);

      // Delete all tasks associated with these roles
      await Task.deleteMany({
        $or: [{ ownerRoleId: { $in: roleIds } },
              { assignedRoleIds: { $in: roleIds } }]
      });

      // Delete all objectives associated with these roles
      await Objective.deleteMany({
        $or: [{ ownerRoleId: { $in: roleIds } },
              { assignedRoleIds: { $in: roleIds } }]
      });

      // Delete all roles associated with the company
      await Role.deleteMany({ _id: { $in: roleIds } });

      // Deletes all departments associated with the company
      await Department.deleteMany({ companyId });

      // Update users to remove company-related roles
      const updatedRoles = companyRoles.filter(companyRole => {
         return (companyRole.companyId.toString() !== companyId);
      });
      const updatedUser = await User.findByIdAndUpdate(
        userId, { companyRoles: updatedRoles }, { new: true }
      );

      // Generate a new access token with updated roles
      const payload = {
        _id: updatedUser._id,
        webAppRole: updatedUser.webAppRole,
        companyRoles: updatedRoles
      };
      const newAccessToken = generateAccessToken(payload);

      // Deleting the company using the already found document
      await Company.findByIdAndDelete({_id: companyId });

      return res.status(200).json({
        status: 'success',
        data: { accessToken: newAccessToken },
        message: 'The company was deleted successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }
}

export default CompanyController;
