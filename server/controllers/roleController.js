import Role from '../models/Roles.js';
import User from '../models/Users.js';
import Department from '../models/Departments.js';

/**
 *
 * @class
 */
class RoleController {
  static async getDepartmentRoles (req, res) {
    // Retrieve all roles for a certain department.
    const { departmentId } = req.params;
    try {
      const roles = await Role.find({ departmentId }).exec();
      if (!roles) {
        return res.status(404).json({
          status: 'error',
          message: 'Could not find any roles for the department.',
          error: 'Department ID is not valid or no available roles.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: roles,
        message: 'Department roles returned successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async createDepartmentRole (req, res) {
    // Creates a role inside a specific department.
    // TODO: Update the User data (companyRoles) with the new role.
    const { departmentId } = req.params;
    const roleData = req.body;
    try {
      // Create Role inside the department
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found.',
          error: 'Invalid department ID.'
        });
      }
      const companyId = department.companyId;
      const role = new Role(roleData);
      const savedRole = await role.save();

      // If the userId is present, find the user and update his companyRoles
      if (savedRole.userId) {
        const user = await User.findById(savedRole.userId);
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User not found.',
            error: 'Invalid user ID.'
          });
        }
        // Add the role to the user's companyRoles array
        user.companyRoles.push({
          companyId, departmentId, roleId: savedRole._id
        });
        await user.save();
      }

      // Add the role 
      return res.status(201).json({
        status: 'success',
        data: { savedRole },
        message: 'Role was created successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateDepartmentRole (req, res) {
    // Updates role information in a specific department
    // TODO: Check if any of the data in the Resourcs Related Data needs to
    // be updated based on the current update.
    // (Users, Departments, other Roles)
    const { departmentId, roleId } = req.params;
    const roleUpdateData = req.body;
    try {
      const currentRole = await Role.findOne({ departmentId, _id: roleId });

      if (!currentRole) {
        return res.status(404).json({
          status: 'error',
          message: 'Role not found.',
          error: 'Invalid Department or Role ID.'
        });
      }

      // Updating the Supervisor roles that he supervises
      if (roleUpdateData.supervises) {
        const supervisesToAdd = roleUpdateData.supervises.filter(id => {
          return (!currentRole.supervises.includes(id));
        });
        const supervisesToRemove = currentRole.supervises.filter(id => {
          return (!roleUpdateData.supervises.includes(id));
        });

        // Adding new supervised roles to supervisor
        for (let supervisedRoleId of supervisesToAdd) {
          await Role.updateOne(
            { _id: supervisedRoleId },
            { $addToSet: { supervisedBy: roleId } }
          );
        }
        // Removing new supervised roles from supervisor
        for (let supervisedRoleId of supervisesToRemove) {
          await Role.updateOne(
            { _id: supervisedRoleId },
            { $pull: { supervisedBy: roleId } }
          );
        }
      }

      // Updating Supervised role by the supervisor
      if (roleUpdateData.supervisedBy) {
        const supervisedByToAdd = roleUpdateData.supervisedBy.filter(id => {
          return (!currentRole.supervisedBy.includes(id));
        });
        const supervisedByToRemove = currentRole.supervisedBy.filter(id => {
          return (!roleUpdateData.supervisedBy.includes(id));
        });

        // Adding new Supervisor/s to the Supervised role
        for (let supervisorRoleId of supervisedByToAdd) {
          await Role.updateOne(
            { _id: supervisedRoleId },
            { $addToSet: { supervisedBy: roleId } }
          );
        }
        // Removing old Supervisor/s from the Supervised role
        for (let supervisorRoleId of supervisedByToRemove) {
          await Role.updateOne(
            { _id: supervisedRoleId },
            { $pull: { supervisedBy: roleId } }
          );
        }
      }

      // Handling companyRoles for added/removed users
      if (roleUpdateData.users) {
        const usersToAdd = roleUpdateData.users.filter(id => {
          return (!currentRole.users.includes(id));
        });
        const usersToRemove = currentRole.users.filter(id => {
          return (!roleUpdateData.users.includes(id));
        });

        for (let userId of usersToAdd) {
          await User.updateOne(
            { _id: userId, 'companyRoles.roleId': { $ne: roleId } },
            { $addToSet: {
                companyRoles: {
                  companyId: currentRole.companyId,
                  departmentId,
                  roleId
                }
              }
            }
          );
        }

        for (let userId of usersToRemove) {
          await User.updateOne(
            { _id: userId },
            { $pull: { companyRoles: { roleId } } }
          );
        }
      }

      const updatedRole = await Role.findOneAndUpdate(
        { departmentId, _id: roleId },
        roleUpdateData,
        { new: true }
      );

      if (!updatedRole) {
        return res.status(404).json({
          status: 'error',
          message: 'Updating the Role data has failed.',
          error: 'Invalid ID for Department or Role.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { updatedRole },
        message: 'Role is updated successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getDepartmentRole (req, res) {
    // Retrieves a certain role inside a specific department.
    const { departmentId, roleId } = req.params;
    try {
      const role = await Role.findOne({ _id: roleId, departmentId });
      if (!role) {
        return res.status(404).json({
          status: 'error',
          message: 'Department or Role IDs were not found.',
          error: 'Invalid Department or Role ID.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { role },
        message: 'Role is retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteDepartmentRole (req, res) {
    // Deletes a role inside a specific department.
    // TODO: Update the User data (companyRoles) by removing the old role.
    const { departmentId, roleId } = req.params;
    try {
      const result = await Role.deleteOne({ _id: roleId, departmentId });
      if (!result.deletedCount) {
        return res.status(404).json({
          status: 'error',
          message: 'Department or Role were not found.',
          error: 'Invalid Department or Role ID.'
        });
      }

      const userUpdateResult = await User.updateOne(
       { 'companyRoles.roleId': roleId },
       { $pull: { companyRoles: { roleId: roleId } } }
      );
      if (!userUpdateResult.matchedCount) {
        return res.status(404).json({
          status: 'error',
          message: 'Role deleted, but user was not found.',
          error: 'Invalid Role ID in user data.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'The role was deleted successfully.'
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

export default RoleController;
