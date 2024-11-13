import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import TaskController from '../controllers/taskController.js';
import ObjectiveController from '../controllers/objectiveController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   - name: Role
 *     description: Handles RBAC operations for tasks, objective resources,
 *                  and their documents too
 */

/**
 * @swagger
 * /api/roles/{roleId}/tasks:
 *   post:
 *     summary: Create a task for a specific role
 *     description: Creates a task owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectiveId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               taskRubric:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assignedRolesIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task was created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/roles/:roleId/tasks',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  TaskController.createRoleTask
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks:
 *   get:
 *     summary: Get all tasks for a specific role
 *     description: Retrieves all tasks owned by or assigned to a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     ownedTasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     assignedTasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Tasks retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/roles/:roleId/tasks',
  AuthMiddleware.verifyAccessToken,
  TaskController.getRoleTasks
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}:
 *   get:
 *     summary: Get a specific task for a role
 *     description: Retrieves a task for a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task retrieved successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 *       403:
 *         description: Access denied
 */
router.get('/roles/:roleId/tasks/:taskId',
  AuthMiddleware.verifyAccessToken,
  TaskController.getRoleTask
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}:
 *   put:
 *     summary: Update a task for a specific role
 *     description: Updates a task owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedTask:
 *                       $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/roles/:roleId/tasks/:taskId',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  TaskController.updateRoleTask
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task for a specific role
 *     description: Deletes a task owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties: {}
 *                 message:
 *                   type: string
 *                   example: The task was deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/roles/:roleId/tasks/:taskId',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  TaskController.deleteRoleTask
);

// Creates a new Objective associated with a Role
/**
 * @swagger
 * /api/roles/{roleId}/objectives:
 *   post:
 *     summary: Create an objective for a specific role
 *     description: Creates an objective owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               objectiveKPIs:
 *                 type: array
 *               goalProgress:
 *                 type: array
 *               taskRubric:
 *                 type: string
 *               objectiveStartDate:
 *                 type: string
 *                 format: date-time
 *               objectiveDueDate:
 *                 type: string
 *                 format: date-time
 *               ownerRoleId:
 *                 type: string
 *               assignedRoleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               accountableDepartments:
 *                 type: array
 *               priority:
 *                 type: string
 *               objectiveResources:
 *                 type: array
 *                 items:
 *                   type: string
 *               objectiveDocuments:
 *                 type: array
 *                 items:
 *                   type: string
 *               recentComments:
 *                 type: array
 *                 items:
 *                   type: string
 *               feedbacks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Objective created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Objective'
 *                 message:
 *                   type: string
 *                   example: Objective was created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/roles/:roleId/objectives',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyObjectiveManagementAccess, // Assuming similar access control as tasks
  ObjectiveController.createRoleObjective
);

// Retrieves all Role's Objectives
/**
 * @swagger
 * /api/roles/{roleId}/objectives:
 *   get:
 *     summary: Get all objectives for a specific role
 *     description: Retrieves all objectives owned by or assigned to a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *     responses:
 *       200:
 *         description: Objectives retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     ownedObjectives:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Objective'
 *                     assignedObjectives:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Objective'
 *                 message:
 *                   type: string
 *                   example: Objectives retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/roles/:roleId/objectives',
  AuthMiddleware.verifyAccessToken,
  ObjectiveController.getRoleObjectives
);

// Retrieves a specific Objective for a Role
/**
 * @swagger
 * /api/roles/{roleId}/objectives/{objectiveId}:
 *   get:
 *     summary: Get a specific objective for a role
 *     description: Retrieves an objective for a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the objective
 *     responses:
 *       200:
 *         description: Objective retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Objective'
 *                 message:
 *                   type: string
 *                   example: Objective retrieved successfully
 *       404:
 *         description: Objective not found
 *       500:
 *         description: Internal server error
 *       403:
 *         description: Access denied
 */router.get('/roles/:roleId/objectives/:objectiveId',
  AuthMiddleware.verifyAccessToken,
  ObjectiveController.getRoleObjective
);

// Updates a specific Objective for a Role
/**
 * @swagger
 * /api/roles/{roleId}/objectives/{objectiveId}:
 *   put:
 *     summary: Update an objective for a specific role
 *     description: Updates an objective owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the objective
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objective updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedTask:
 *                       $ref: '#/components/schemas/Objective'
 *                 message:
 *                   type: string
 *                   example: Objective updated successfully
 *       404:
 *         description: Objective not found
 *       500:
 *         description: Internal server error
 */
router.put('/roles/:roleId/objectives/:objectiveId',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyObjectiveManagementAccess, // Assuming similar access control as tasks
  ObjectiveController.updateRoleObjective
);

// Deletes a specific Objective for a Role
/**
 * @swagger
 * /api/roles/{roleId}/objectives/{objectiveId}:
 *   delete:
 *     summary: Delete an objective for a specific role
 *     description: Deletes an objective owned by a specific role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the objective
 *     responses:
 *       200:
 *         description: Objective deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties: {}
 *                 message:
 *                   type: string
 *                   example: The objective was deleted successfully
 *       404:
 *         description: Objective not found
 *       500:
 *         description: Internal server error
 */
router.delete('/roles/:roleId/objectives/:objectiveId',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyObjectiveManagementAccess, // Assuming similar access control as tasks
  ObjectiveController.deleteRoleObjective
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}/resources:
 *   post:
 *     summary: Upload resources for a task
 *     description: Upload multiple resources for a specific task. Only task owners or assignees can upload resources.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - https://your-bucket.s3.amazonaws.com/taskId/filename1
 *                     - https://your-bucket.s3.amazonaws.com/taskId/filename2
 *                 message:
 *                   type: string
 *                   example: Files uploaded successfully.
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Access denied.
 *                 error:
 *                   type: string
 *                   example: Task Resources not accessible by the specified role.
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Task not found.
 *                 error:
 *                   type: string
 *                   example: Invalid Task ID.
 *       500:
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 *                 error:
 *                   type: string
 */
router.post('/roles/:roleId/tasks/:taskId/resources',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  upload.array('files'),
  TaskController.uploadTaskResources
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}/resources/{fileName}:
 *   get:
 *     summary: Download a resource for a task
 *     description: Generate a pre-signed URL to download a specific resource for a task. Only task owners or assignees can download resources.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *       - in: path
 *         name: fileName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the file to download
 *     responses:
 *       302:
 *         description: Redirect to the pre-signed URL
 *         headers:
 *           Location:
 *             description: URL to the resource
 *             schema:
 *               type: string
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Access denied.
 *                 error:
 *                   type: string
 *                   example: Task Resources not accessible by the specified role.
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Task not found.
 *                 error:
 *                   type: string
 *                   example: Invalid Task ID.
 *       500:
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 *                 error:
 *                   type: string
 */
router.get('/roles/:roleId/tasks/:taskId/resources/:fileName',
  AuthMiddleware.verifyAccessToken,
  TaskController.downloadTaskResource
);

/**
 * @swagger
 * /api/roles/{roleId}/tasks/{taskId}/resources/{fileName}:
 *   delete:
 *     summary: Delete a resource for a task
 *     description: Delete a specific resource for a task. Only task owners or assignees can delete resources.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *       - in: path
 *         name: fileName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: File deleted successfully.
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Access denied.
 *                 error:
 *                   type: string
 *                   example: Task Resources not accessible by the specified role.
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Task not found.
 *                 error:
 *                   type: string
 *                   example: Invalid Task ID.
 *       500:
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 *                 error:
 *                   type: string
 */
router.delete('/roles/:roleId/tasks/:taskId/resources/:fileName',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  TaskController.deleteTaskResource
);

/**
 * @swagger
 * /roles/{roleId}/tasks/{taskId}/outputs:
 *   post:
 *     summary: Upload task outputs
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: string
 *           format: binary
 *         required: true
 *         description: Files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: An unexpected error occurred.
 */
router.post('/roles/:roleId/tasks/:taskId/outputs',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  upload.array('files'),
  TaskController.uploadTaskOutputs
);

/**
 * @swagger
 * /roles/{roleId}/tasks/{taskId}/outputs/{fileName}:
 *   get:
 *     summary: Download a task output
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *       - in: path
 *         name: fileName
 *         schema:
 *           type: string
 *         required: true
 *         description: File name of the task output
 *     responses:
 *       200:
 *         description: Document is downloaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found or Task Resource not found.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: An unexpected error occurred.
 */
router.get('/roles/:roleId/tasks/:taskId/outputs/:fileName',
  AuthMiddleware.verifyAccessToken,
  TaskController.downloadTaskOutput
);

/**
 * @swagger
 * /roles/{roleId}/tasks/{taskId}/outputs/{fileName}:
 *   delete:
 *     summary: Delete a task output
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Role ID
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *       - in: path
 *         name: fileName
 *         schema:
 *           type: string
 *         required: true
 *         description: File name of the task output to delete
 *     responses:
 *       200:
 *         description: File deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found or Task Resource not found.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: An unexpected error occurred.
 */
router.delete('/roles/:roleId/tasks/:taskId/outputs/:fileName',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.verifyTaskManagementAccess,
  TaskController.deleteTaskOutput
);

export default router;
