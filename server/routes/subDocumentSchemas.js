/**
 * @swagger
 *   components:
 *     schemas:
 *       companyRole:
 *         type: object
 *         required:
 *           - companyId
 *           - departmentId
 *           - role
 *         properties:
 *           _id:
 *             type: string
 *             description: The Auto-generated ID of the companyRole
 *                          sub-document
 *           companyId:
 *             type: string
 *             description: The ID of the company document
 *           departmentId:
 *             type: string
 *             description: The ID of the department document
 *           role:
 *             type: string
 *             description: The role of the user inside the company
 *             enum: ["COMPANY_ADMIN", "TOP_LEVEL_MANAGER",
 *                    "MANAGER", "EMPLOYEE"]
 *             example: "EMPLOYEE"
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *       relatedDepartment:
 *         type: object
 *         required:
 *           - departmentId
 *           - departmentName
 *         properties:
 *           _id:
 *             type: string
 *             description: The Auto-generated ID of the relatedDepartment
 *                          sub-document
 *           departmentId:
 *             type: string
 *             description: The ID of the department document
 *           departmentName:
 *             type: string
 *             description: The name of the related department
 *             example: "Digital Technologies"
 */

