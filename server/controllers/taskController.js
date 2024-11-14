import Task from '../models/Tasks.js';
import AWSHelper from '../utils/awsHelper.js';

class TaskController {
  static async getRoleTasks (req, res) {
    // Retrieves all tasks for a certain role
    const { roleId } = req.params;
    try {
      // Retrieve tasks where the role is the owner
      const ownedTasks = await Task.find({ ownerRoleId: roleId }).exec();
      // Retrieve tasks where the role is assigned
      const assignedTasks = await Task.find({ assignedRolesIds: roleId })
        .exec();

      return res.status(200).json({
        status: 'success',
        data: { ownedTasks, assignedTasks },
        message: 'Tasks retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateRoleTask (req, res) {
    // Updates a task owned by a certain role
    const { roleId, taskId } = req.params;
    const updatedData = req.body;

    try {
      // Checking that the task is retrieved and owned by the role.
      const task = await Task.findOne({ _id: taskId, ownerRoleId: roleId })
        .exec();
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid ID for task or role.'
        });
      }

      // Allow updating main task details
      task.set(updatedData);
      const updatedTask = await task.save();

      return res.status(200).json({
        status: 'success',
        data: { updatedTask },
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

  static async getRoleTask (req, res) {
    // Retrieves a task for a certain role
    const { roleId, taskId } = req.params;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task not accessible by the specified role.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: { task },
        message: 'Task retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async createRoleTask (req, res) {
    // Creates a task for specific role/s.
    // TODO: commentsCount was removed from the req.body since it's going
    // to be modified as each comment is added or deleted.
    const { roleId } = req.params;
    const {
      objectiveId, title, description,
      taskRubric, startDate, dueDate,
      ownerRoleId, assignedRolesIds, priority,
      recentComments, feedbacks,
      status } = { ...req.body, ownerRoleId: roleId };

    try {
      const task = new Task({
        objectiveId, title, description,
        taskRubric, startDate, dueDate,
        ownerRoleId, assignedRolesIds, priority,
        recentComments, feedbacks, status });
      const savedTask = await task.save();

      return res.status(201).json({
        status: 'success',
        data: { task },
        message: 'Task was created successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteRoleTask (req, res) {
    const { roleId, taskId } = req.params;
    try {
      const result = await Task.deleteOne({
        _id: taskId, ownerRoleId: roleId
      });
      if (!result.deletedCount) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found, hence could not be deleted.',
          error: 'Invalid ID for task or role.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'The task was deleted successfully.' 
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async uploadTaskResources (req, res) {
    const { roleId, taskId } = req.params;
    const files = req.files;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      const uploadPromises = files.map(file => {
        const fileName = `${taskId}/${file.originalname}`;
        return AWSHelper.uploadFileToS3(file.buffer, fileName)
          .then(() => file.originalname);
      });

      const fileNames = await Promise.all(uploadPromises);

      task.taskResources.push(...fileNames);
      await task.save();

      return res.status(200).json({
        status: 'success',
        data: fileNames,
        message: 'Files uploaded successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async downloadTaskResource (req, res) {
    const { roleId, taskId, fileName } = req.params;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      // Decode the file name
      const decodedFileName = decodeURIComponent(fileName);
      if (!task.taskResources.includes(decodedFileName)) {
        return res.status(404).json({
          status: 'error',
          message: 'Task Resource not found.',
          error: 'Invalid Task Resource Name.'
        });

      }
      const fileKey = `${taskId}/${decodedFileName}`;
      const preSignedUrl = AWSHelper
        .generatePresignedUrl(process.env.AWS_BUCKET_NAME, fileKey);

      return res.status(200).json({
        status: 'success',
        data: preSignedUrl,
        message: 'Document is downloaded successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteTaskResource (req, res) {
    const { roleId, taskId, fileName } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      // Decode the file name
      const decodedFileName = decodeURIComponent(fileName);
      const fileKey = `${taskId}/${decodedFileName}`;

      await AWSHelper.deleteFileFromS3(fileKey);

      task.taskResources = task.taskResources.filter(resource => {
        return (resource !== decodedFileName)
      });
      await task.save();

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'File deleted successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async uploadTaskOutputs (req, res) {
    const { roleId, taskId } = req.params;
    const files = req.files;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      const uploadPromises = files.map(file => {
        const fileName = `${taskId}/${file.originalname}`;
        return AWSHelper.uploadFileToS3(file.buffer, fileName)
          .then(() => file.originalname);
      });

      const fileNames = await Promise.all(uploadPromises);

      task.taskOutputs.push(...fileNames);
      await task.save();

      return res.status(200).json({
        status: 'success',
        data: fileNames,
        message: 'Files uploaded successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async downloadTaskOutput (req, res) {
    const { roleId, taskId, fileName } = req.params;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      // Decode the file name
      const decodedFileName = decodeURIComponent(fileName);
      if (!task.taskOutputs.includes(decodedFileName)) {
        return res.status(404).json({
          status: 'error',
          message: 'Task Resource not found.',
          error: 'Invalid Task Resource Name.'
        });

      }
      const fileKey = `${taskId}/${decodedFileName}`;
      const preSignedUrl = AWSHelper
        .generatePresignedUrl(process.env.AWS_BUCKET_NAME, fileKey);

      return res.status(200).json({
        status: 'success',
        data: preSignedUrl,
        message: 'Document is downloaded successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }
  static async deleteTaskOutput (req, res) {
    const { roleId, taskId, fileName } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found.',
          error: 'Invalid Task ID.'
        });
      }

      // Ensure the task is either owned or assigned to the role
      if (!task.ownerRoleId.equals(roleId) &&
          !task.assignedRolesIds.includes(roleId)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Task Resources not accessible by the specified role.'
        });
      }

      // Decode the file name
      const decodedFileName = decodeURIComponent(fileName);
      const fileKey = `${taskId}/${decodedFileName}`;

      await AWSHelper.deleteFileFromS3(fileKey);

      task.taskOutputs = task.taskOutputs.filter(resource => {
        return (resource !== decodedFileName)
      });
      await task.save();

      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'File deleted successfully.'
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

export default TaskController;
