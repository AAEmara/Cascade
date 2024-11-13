
/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       User:
 *         type: object
 *         required:
 *            - firstName
 *            - lastName
 *            - email
 *            - password
 *         properties:
 *           _id:
 *             type: string
 *             description: The Auto-generated ID of the user
 *           firstName:
 *             type: string
 *             description: The first name of the user
 *             example: "Mohammed"
 *           lastName:
 *             type: string
 *             description: The last name of the user
 *             example: "Mostafa"
 *           email:
 *             type: string
 *             description: The email of the user
 *             example: "mohammed.mostafa@example.com"
 *           password:
 *             type: string
 *             description: The hashed password of the user
 *             example: "$2a$10$ZtaboAWUSRWaaOpBU4wIB.rKlwRgCUpa0ghBy/NEhzAk/V.IV2zFS"
 *           webAppRole:
 *             type: string
 *             description: The role of the user in the web application
 *             enum: ["WEB_APP_ADMIN", "CUSTOMER_SUPPORT", "USER"]
 *             default: "USER"
 *             example: "USER"
 *           companyRoles:
 *             type: array
 *             items:
 *               type: object
 *               $ref: '#/components/schemas/companyRole'
 *             description: Array of company roles associated with the user
 *             default: []
 *           image:
 *             type: string
 *             description: The URL path to the image
 *           refreshToken:
 *             type: string
 *             description: The long lived token that generates the access
 *                          tokens for the user
 *             example: "0c3bd0d9b17e059721e61a9e801de4377f70ff3c7a3c9f3be1063d3071a3ccee3b3bec33d8e57841c3ed381224ceb9efe7a39065e6998c2df07e1fc26bd37154"
 *           refreshTokenExpiresAt:
 *             type: Date
 *             description: The expiry date of the long lived token
 *             example: 2024-11-06T03:21:36.046Z
 *           createdAt:
 *             type: Date
 *             description: The creation date of the user
 *             example: 2024-11-01T00:00:00Z
 *           updatedAt:
 *             type: Date
 *             description: The upate date of the user information
 *             example: 2024-11-06T03:21:36.046Z
 */

/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Company:
 *         type: object
 *         required:
 *            - name
 *            - subscriptionPlan
 *         properties:
 *           _id:
 *             type: string
 *             description: The Auto-generated ID of the company
 *           name:
 *             type: string
 *             description: The name of the company
 *             example: "Digital Technologies"
 *           subscriptionPlan:
 *             type: string
 *             description: The subscription plan of the company 
 *             default: "FREE"
 *             example: "MONTHLY"
 *           companyDepartments:
 *             type: array
 *             items:
 *               type: object
 *               $ref: '#/components/schemas/relatedDepartment'
 *             description: Array of departments associated with the company
 *             default: []
 *           createdAt:
 *             type: Date
 *             description: The creation date of the company
 *             example: 2024-11-01T00:00:00Z
 *           updatedAt:
 *             type: Date
 *             description: The update date of the company information
 *             example: 2024-11-06T03:21:36.046Z
 */


/**
 * @swagger
 *   components:
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     schemas:
 *       Department:
 *         type: object
 *         required:
 *            - name
 *            - companyId
 *         properties:
 *           _id:
 *             type: string
 *             description: The Auto-generated ID of the department
 *           name:
 *             type: string
 *             description: The name of the department
 *             example: "Human Resources"
 *           users:
 *             type: array
 *             items:
 *               type: string
 *               descripiton: The ID of the users associated with the
 *                            department
 *               example: "60d21b4667d0d8992e610c87"
 *             description: Array of user IDs associated with the department
 *             default: []
 *             example: ["60d21b4667d0d8992e610c87",
 *                       "60d21b4667d0d8992e610c88"]
 *           createdAt:
 *             type: Date
 *             description: The creation date of the department
 *             example: 2024-11-01T00:00:00Z
 *           updatedAt:
 *             type: Date
 *             description: The update date of the department's information
 *             example: 2024-11-06T03:21:36.046Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         departmentId:
 *           type: string
 *           format: ObjectId
 *           description: ID of the department
 *           example: 507f1f77bcf86cd799439011
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: ID of the user
 *           example: 507f1f77bcf86cd799439012
 *         hierarchyLevel:
 *           type: string
 *           enum:
 *             - COMPANY_ADMIN
 *             - TOP_LEVEL_MANAGER
 *             - MANAGER
 *             - EMPLOYEE
 *           description: Hierarchy level of the role
 *           example: MANAGER
 *         jobTitle:
 *           type: string
 *           description: Job title of the role
 *           example: Software Engineer
 *         jobDescription:
 *           type: string
 *           description: Job description of the role
 *           example: Responsible for developing and maintaining software applications
 *         supervisedBy:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of roles supervising this role
 *           default: []
 *         supervises:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of roles supervised by this role
 *           default: []
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of permissions assigned to this role
 *           default: []
 *       required:
 *         - departmentId
 *         - hierarchyLevel
 *         - jobTitle
 *         - jobDescription
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         objectiveId:
 *           type: string
 *           format: ObjectId
 *           description: ID of the objective
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           description: Title of the task
 *           example: Create project plan
 *         description:
 *           type: string
 *           description: Description of the task
 *           example: Detailed project plan including milestones and deliverables
 *         taskRubric:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               requirementTitle:
 *                 type: string
 *                 description: Title of the requirement
 *                 example: Scope definition
 *               requirementDescription:
 *                 type: string
 *                 description: Description of the requirement
 *                 example: Define the project scope and boundaries
 *               requirementWeight:
 *                 type: number
 *                 format: decimal
 *                 description: Weight of the requirement
 *                 example: 1.5
 *           default: []
 *         status:
 *           type: string
 *           enum:
 *             - TO_DO
 *             - IN_PROGRESS
 *             - DONE
 *             - CANCELED
 *             - DRAFTED
 *             - ON_HOLD
 *           description: Status of the task
 *           example: TO_DO
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the task
 *           example: 2024-11-13T19:25:00Z
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date of the task
 *           example: 2024-12-13T19:25:00Z
 *         ownerRoleId:
 *           type: string
 *           format: ObjectId
 *           description: ID of the role owning the task
 *           example: 507f1f77bcf86cd799439012
 *         assignedRolesIds:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of roles assigned to the task
 *           default: []
 *         priority:
 *           type: string
 *           enum:
 *             - VERY_HIGH
 *             - HIGH
 *             - MEDIUM
 *             - LOW
 *             - VERY_LOW
 *           description: Priority of the task
 *           example: MEDIUM
 *         recentComments:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of recent comments on the task
 *           default: []
 *         commentsCount:
 *           type: number
 *           description: Number of comments on the task
 *           example: 3
 *         feedbacks:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: IDs of feedbacks for the task
 *           default: []
 *         taskResources:
 *           type: array
 *           items:
 *             type: string
 *             description: Resources related to the task
 *           default: []
 *         taskOutputs:
 *           type: array
 *           items:
 *             type: string
 *             description: Outputs of the task
 *           default: []
 *       required:
 *         - title
 *         - status
 *         - ownerRoleId
 *         - assignedRolesIds
 *         - commentsCount
 *         - feedbacks
 */

