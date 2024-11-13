import Department from '../models/Departments.js';
import Company from '../models/Companies.js';
import Role from '../models/Roles.js';

class DepartmentController {
  static async createCompanyDepartment (req, res) {
    // Creates a department.
    const { companyId } = req.params;
    const { name, roles } = req.body;
    try {
      // Checking if company exists
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({
          status: 'error',
          message: 'Company not found.',
          error: 'Company ID is not valid.'
        });
      }

      // Check if roles exist
      const existingRoles = await Role.find({ _id: {$in: roles } });
      if (existingRoles.length !== roles.length) {
        return res.status(404).json({
          status: 'error',
          message: 'One or more roles not found.',
          error: 'Invalid role ID was detected.'
        });
      }

      // Creating the department
      const department = new Department({ name, companyId, roles });
      const savedDepartment = await department.save();

      // Update company document
      await Company.findByIdAndUpdate(
        companyId,
        { $push: { companyDepartments: {
          departmentId: savedDepartment._id,
          departmentName: savedDepartment.name } }
        },
        { new: true }
      );

      // Updating role documents to reflect their new departments.
      await Role.updateMany(
        { _id: { $in: roles } },
        { $set: { departmentId: savedDepartment._id } }
      );

      return res.status(201).json({
        status: 'success',
        data: { department },
        message: 'Department was created successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getCompanyDepartments (req, res) {
    // Get departments related to a company
    const { companyId } = req.params;
    try {
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({
          status: 'error',
          message: 'Company not found.',
          error: 'Company ID is not valid.'
        });
      }

      const departments = await Department.find({ companyId }).exec();
      if (!departments.length) {
        return res.status(400).json({
          status: 'error',
          message: 'Could not find any departments for this company.',
          error: 'Company ID is not valid or no available departments.'
        });
      }
      return res.status(200).json({
        status: 'success',
        data: departments,
        message: 'Company departments returned successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getCompanyDepartment (req, res) {
    // Get a specific department related to a company
    const { companyId, departmentId } = req.params;
    try {
      const department = await Department.findOne({
        _id: departmentId, companyId
     });
      if (!department) {
        return res.status(404).json({
        status: 'error',
        message: 'Company or Department are not found.',
        error: 'Invalid Company or Department ID.'
        });
      }
      return res.status(200).json({
        status: 'success',
        data: { department },
        message: 'Department is retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateCompanyDepartment (req, res) {
    // Update a specific department with its ID for a specific Company
    const { companyId, departmentId } = req.params;
    const { name, roles } = req.body;
    try {
      const updatedDepartment = await Department.findOneAndUpdate(
        { _id: departmentId, companyId },
        { name, roles },
        { new: true }
      );

      if (!updatedDepartment) {
        return res.status(404).json({
          status: 'error',
          message: 'Updating the Department data has failed.',
          error: 'Invalid ID for Department or Company.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { updatedDepartment },
        message: 'Department is updated successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteCompanyDepartment (req, res) {
    // Delete a specific department with its ID for a specific Company
    const { companyId, departmentId } = req.params;
    try {
      const department = await Department.findById(departmentId);
      if (!department) {
        throw new Error('Department not found.');
      }

      const result = await Department.deleteOne({ _id: departmentId });
      if (!result.deletedCount) {
        throw new Error('Not able to delete the department.');
      }

      const userUpdatePromises = department.roles.map(async (userId) => {
        return User.updateOne(
          { _id: userId, 'companyRoles.departmentId': departmentId },
          { $unset: { 'companyRoles.$.departmentId': "" } }
        );
      });
      await Promise.all(userUpdatePromises);

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { $pull: { companyDepartments: { departmentId } } },
        { new: true }
      );

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'The department was deleted successfully.',
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

export default DepartmentController;
