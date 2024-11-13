import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import CompanyController from '../controllers/companyController.js';
import DepartmentController from '../controllers/departmentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company routes that handles CRUD operations for a Company
 *                resource
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new user
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the company
 *                 example: "Digital Technologies"
 *               subscriptionPlan:
 *                 type: string
 *                 description: The subscription plan of the company 
 *                 default: "FREE"
 *                 example: "MONTHLY"
 *               companyDepartments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   $ref: '#/components/schemas/relatedDepartment'
 *                 description: Array of departments associated with the
 *                              company
 *                 default: []
 *     responses:
 *       '201':
 *         description: Company created successfully
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
 *                   example: "updated user and created company objects"
 *                 message:
 *                   type: string
 *                   example: "Company was created successfully."
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
router.post('/companies',
  AuthMiddleware.verifyAccessToken,
  CompanyController.createCompany
);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve all companies related to the user
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Company data related to the user is retrieved
 *                      successfully
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
 *                   example: "updated user and created company objects"
 *                 message:
 *                   type: string
 *                   example: "Related companies data are retrieved."
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
router.get('/companies',
  AuthMiddleware.verifyAccessToken,
  CompanyController.getCompanies
);


/**
 * @swagger
 * /api/companies/{companyId}:
 *   get:
 *     summary: Retrieve data of a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         description: ID of the company to be retrieved.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: The company is data retrieved successfully
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
 *                   $ref: '#/components/schemas/Company'
 *                 message:
 *                   type: string
 *                   example: "Company data retrieved successfully."
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
router.get('/companies/:companyId',
  AuthMiddleware.verifyAccessToken,
  CompanyController.getCompany
);

/**
 * @swagger
 * /api/companies/{companyId}:
 *   put:
 *     summary: Update a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         description: ID of the company to updated.
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: "#/components/schemas/Company" 
 *     responses:
 *       '200':
 *         description: The company is deleted successfully
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
 *                   $ref: '#/components/schemas/Company'
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
router.put('/companies/:companyId',
  AuthMiddleware.verifyAccessToken,
  CompanyController.updateCompany
);

/**
 * @swagger
 * /api/companies/{companyId}:
 *   delete:
 *     summary: Delete a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         description: ID of the company to be deleted.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: The company is deleted successfully
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
 *                   $ref: '#/components/schemas/Company'
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
router.delete('/companies/:companyId',
  AuthMiddleware.verifyAccessToken,
  CompanyController.deleteCompany
);

/**
 * @swagger
 * /api/companies/{companyId}/departments:
 *   post:
 *     summary: Create a new department in the company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         description: ID of the company to create its departments.
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the department
 *                 example: "Human Resources"
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   $ref: '#/components/schemas/relatedDepartment'
 *                 description: Array of departments associated with the
 *                              company
 *                 default: []
 *     responses:
 *       '201':
 *         description: Department created successfully
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
 *                   example: "Department created successfully."
 *                 message:
 *                   type: string
 *                   example: "Department was created successfully."
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
router.post('/companies/:companyId/departments',
  AuthMiddleware.verifyAccessToken,
  DepartmentController.createCompanyDepartment
);

/**
 * @swagger
 * /api/companies/{companyId}/departments:
 *   get:
 *     summary: Retrieve departments of a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         description: ID of the company to have its departments retrieved.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: The company departments data are retrieved successfully
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
 *                   $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                   example: "Company departments returned successfully."
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
router.get('/companies/:companyId/departments',
  AuthMiddleware.verifyAccessToken,
  DepartmentController.getCompanyDepartments
);

/**
 * @swagger
 * /api/companies/{companyId}/departments/{departmentId}:
 *   get:
 *     summary: Retrieve data of a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to have its department retrieved.
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to be retrieved.
 *     responses:
 *       '200':
 *         description: The department data is retrieved successfully
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
 *                   $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                   example: "Department data retrieved successfully."
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
router.get('/companies/:companyId/departments/:departmentId',
  AuthMiddleware.verifyAccessToken,
  DepartmentController.getCompanyDepartment
);

/**
 * @swagger
 * /api/companies/{companyId}/departments/{departmentId}:
 *   put:
 *     summary: Update the data of a specific department in a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to have its department retrieved.
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to be retrieved.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: name of the company to be updated
 *                 example: "DigiTech Co."
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID of the role inside the department
 *                   example: "dsl12z1aewvje104soe94qqwe"
 *                 description: Array of role IDs
 *                 example: ["dsl12z1aewvje104soe94qqwe",
 *                           "dslz2z1aew2je102soe98qqwe"]
 *     responses:
 *       '200':
 *         description: The department data is retrieved successfully
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
 *                   $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                   example: "Department data retrieved successfully."
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
router.put('/companies/:companyId/departments/:departmentId',
  AuthMiddleware.verifyAccessToken,
  DepartmentController.updateCompanyDepartment
);

/**
 * @swagger
 * /api/companies/{companyId}/departments/{departmentId}:
 *   delete:
 *     summary: Delete a specific department for a specific company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to have its departments deleted.
 *       - name: departmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department to be deleted.
 *     responses:
 *       '200':
 *         description: The company's department was deleted successfully
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
 *                   example: "Company departments returned successfully."
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
router.delete('/companies/:companyId/departments/:departmentId',
  AuthMiddleware.verifyAccessToken,
  DepartmentController.deleteCompanyDepartment
);

export default router;
