import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import DepartmentController from '../controllers/departmentController.js';
import RoleController from '../controllers/roleController.js';


/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department routes tha handles CRUD operations for a
 *                Department resource
 */
const router = express.Router();

/**
 * @swagger
 * /api/departments/{departmentId}/roles:
 *   post:
 *     summary: Create a new role inside a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to create a role inside it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentId
 *               - userId
 *               - jobTitle
 *               - jobDescription
 *               - hierarchyLevel
 *             properties:
 *               departmentId:
 *                 type: string
 *                 description: The ID of the department
 *                 example: "60d21b4667d0d8992e610c87"
 *               hierarchyLevel:
 *                 type: string
 *                 description: The hierarchy of the role
 *                 example: "MANAGER"
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "3adf42ac0qp2df949caqe"
 *               jobTitle:
 *                 type: string
 *                 description: A title of the job that the role holds
 *                 example: "Human Resources Specialist"
 *               jobDescription:
 *                 type: string
 *                 description: A description to what is expected and required
 *                              from this role
 *                 example: "This is a Human Resources Specialist"
 *               supervisedBy:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The ID of the role supervising the current
 *                                role and assigning tasks or objectives to it
 *                   example: "60d21b4667d0d8992e610c87" 
 *                 description: Array of role IDs that supervises this role
 *                 default: []
 *                 example: ["60d21b4667d0d8992e610c87"]
 *               supervises:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The ID of the role supervised by the current
 *                                role and assigned tasks or objectives by it
 *                   example: "60d21b4667d0d8992e610c87" 
 *                 description: Array of role IDs that are supervised by this
 *                              role
 *                 default: []
 *                 example: ["60d21b4667d0d8992e610c87"]
 *     responses:
 *       '201':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   example: "role object"
 *                 message:
 *                   type: string
 *                   example: "Role was created successfully."
 *       '500':
 *         description: Server error occurred due to an unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. 
 *                             Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.post('/departments/:departmentId/roles',
  AuthMiddleware.verifyAccessToken,
  AuthMiddleware.checkCompanyAdmin,
  RoleController.createDepartmentRole
);

/**
 * @swagger
 * /api/departments/{departmentId}/roles:
 *   get:
 *     summary: Retrieve roles data of a specific department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         description: ID of the department to have its roles retrie
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: The department's roles data were retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Role'
 *                 message:
 *                   type: string
 *                   example: "Department roles returned successfully."
 *       '500':
 *         description: Server error occurred due to an unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. 
 *                             Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/departments/:departmentId/roles',
  AuthMiddleware.verifyAccessToken,
  RoleController.getDepartmentRoles
);

/**
 * @swagger
 * /api/departments/{departmentId}/roles/{roleId}:
 *   get:
 *     summary: Retrieve data of a specefic role in a specific department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         description: ID of the department to be retrieve its role
 *         schema:
 *           type: string
 *         required: true
 *       - name: roleId
 *         in: path
 *         description: ID of the role to be retrieved
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: The role data was retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Role'
 *                 message:
 *                   type: string
 *                   example: "Role is retrieved successfully."
 *       '500':
 *         description: Server error occurred due to an unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. 
 *                             Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/departments/:departmentId/roles/:roleId',
  AuthMiddleware.verifyAccessToken,
  RoleController.getDepartmentRole
);

/**
 * @swagger
 * /api/departments/{departmentId}/roles/{roleId}:
 *   put:
 *     summary: Update the data of a specific role in a specific department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to have its role updated
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentId:
 *                 type: string
 *                 description: ID of the department that includes the role
 *                 example: "dsl12z1aewvje104soe94qqwe"
 *               userId:
 *                 type: string
 *                 description: ID of the user that works in this role
 *                 example: "672c82f753c3471d9666f322"
 *               jobTitle:
 *                 type: string
 *                 description: Name of the job title.
 *                 example: "Human Resources Specialist"
 *               jobDescription:
 *                 type: string
 *                 description: Description of what this job does
 *                 example: "This is a Human Resources Specialist
 *                           job description"
 *               supervisedBy:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID of role that supervises this role
 *                   example: "dsl12z1aewvje104soe94qqwe"
 *                 description: Array of role supervisors' ID 
 *                 example: ["dsl12z1aewvje104soe94qqwe",
 *                           "dslz2z1aew2je102soe98qqwe"]
 *               supervises:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID of role that is supervised by this role
 *                   example: "dsl12z1aewvje104soe94qqwe"
 *                 description: Array of IDs for the supervised roles 
 *                 example: ["dsl12z1aewvje104soe94qqwe",
 *                           "dslz2z1aew2je102soe98qqwe"]
 *     responses:
 *       '200':
 *         description: The role is updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Role'
 *                 message:
 *                   type: string
 *                   example: "Role is updated successfully."
 *       '500':
 *         description: Server error occurred due to an unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. 
 *                             Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.put('/departments/:departmentId/roles/:roleId',
  AuthMiddleware.verifyAccessToken,
  RoleController.updateDepartmentRole
);

/**
 * @swagger
 * /api/departments/{departmentId}/roles/{roleId}:
 *   delete:
 *     summary: Delete an existing role inside a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to have its role deleted
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role to be deleted
 *     responses:
 *       '200':
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "Role was deleted successfully."
 *       '500':
 *         description: Server error occurred due to an unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. 
 *                             Please try again later."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.delete('/departments/:departmentId/roles/:roleId',
  AuthMiddleware.verifyAccessToken,
  RoleController.deleteDepartmentRole
);

export default router;
