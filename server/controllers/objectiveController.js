import Objective from '../models/Objectives.js';

class ObjectiveController {
  static async getRoleObjectives (req, res) {
    // Retrieves all objectives for a certain role
    const { roleId } = req.params;
    try {
      // Retrieve objectives where the role is the owner
      const ownedObjectives = await Objective.find({ ownerRoleId: roleId })
        .exec();
      // Retrieve objectives where the role is assigned
      const assignedObjectives = await Objective
        .find({ assignedRolesIds: roleId }).exec();

      return res.status(200).json({
        status: 'success',
        data: { ownedObjectives, assignedObjectives },
        message: 'Objectives retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async createRoleObjective (req, res) {
    // Create an objective for a specific role/s.
    const { roleId } = req.params;
    const objectiveData = { ...req.body, ownerRoleId: roleId };

    try {
      const newObjective = new Objective(objectiveData);
      const savedObjective = await newObjective.save();

      return res.status(201).json({
        status: 'success',
        data: { objective: savedObjective },
        message: 'Objective created successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getRoleObjective (req, res) {
    // Retrieves an objective for a certain role
    const { roleId, objectiveId } = req.params;

    try {
      const objective = await Objective.findById(objectiveId);
      if (!objective) {
        return res.status(404).json({
          status: 'error',
          message: 'Objective not found.',
          error: 'Invalid Objective ID.'
        });
      }

      // Ensure the objective is either owned or assigned to the role
      if (!objective.ownerRoleId.equals(roleId) &&
          !objective.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Objective not accessible by the specified role.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { objective },
        message: 'Objective retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateRoleObjective (req, res) {
    // Updates an objective by a certain role
    const { roleId, objectiveId } = req.params;
    const updatedData = req.body;

    try {
      // Checking that the objective is retrieved and owned by the role.
      const objective = await Objective.findOne({
        _id: objectiveId, ownerRoleId: roleId
      }).exec();
      if (!objective) {
        return res.status(404).json({
          status: 'error',
          message: 'Objective not found.',
          error: 'Invalid ID for objective or role.'
        });
      }

      // Allow updating main objective details
      objective.set(updatedData);
      const updatedObjective = await objective.save();

      return res.status(200).json({
        status: 'success',
        data: { updatedObjective },
        message: 'Task updated successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }
  static async deleteRoleObjective (req, res) {
    // Delete an objective for a specific role/s.
    const { roleId, objectiveId } = req.params;
    try {
      const result = await Objective.deleteOne({
        _id: objectiveId, ownerRoleId: roleId
      });

      if (!result.deletedCount) {
        return res.status(404).json({
          status: 'error',
          message: 'Objective not found, hence could not be deleted.',
          error: 'Invalid ID for objective or role.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'The objective was deleted successfully.'
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

export default ObjectiveController;
