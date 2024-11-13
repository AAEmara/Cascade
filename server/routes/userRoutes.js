import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import UserController from '../controllers/userController.js';
import UserValidator from '../validations/userValidations.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User routes that handles some operations related to the
 *                user resources
 */

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Retrieve data for a specific user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: email
 *         in: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The email address of the user to search for
 *     responses:
 *       '200':
 *         description: The data of the specified user is returned successfully
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
 *                   $ref: '#/components/schemas/User'
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
 *                             Please try again later"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/users/search',
  AuthMiddleware.verifyAccessToken,
  UserController.searchUserByEmail
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve data for a specific user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The data of the specified user is returned successfully
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
 *                   $ref: '#/components/schemas/User'
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
 *                             Please try again later"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/users/me',
  AuthMiddleware.verifyAccessToken,
  UserValidator.getUserRequest,
  UserValidator.validateGetUserRequest,
  UserController.getUser
);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Updates user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user to update
 *                 example: "Mohamed"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user to update
 *                 example: "Mostafa"
 *               email:
 *                 type: string
 *                 description: Email of the user to update
 *                 example: "mohamed.mostafa@example.com"
 *               password:
 *                 type: string
 *                 description: Password of the user to update
 *                 example: "mohamed_mostafa@123456"
 *               image:
 *                 type: string
 *                 description: Image of the user to update
 *     responses:
 *       '200':
 *         description: The data of the specified user is updated successfully
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
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: 'The resource is updated successfully.'
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
 *                             Please try again later"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.put('/users/me',
  AuthMiddleware.verifyAccessToken,
  UserController.updateUser
);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete a specific user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user is deleted successfully
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
 *                   $ref: '#/components/schemas/User'
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
router.delete('/users/me',
  AuthMiddleware.verifyAccessToken,
  UserController.deleteUser
);

/**
 * @swagger
 * /api/users/me/image:
 *   get:
 *     summary: Get the url of the profile image
 *     description: Upload user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.get('/users/me/image',
  AuthMiddleware.verifyAccessToken,
  UserController.getProfileImage
);

/**
 * @swagger
 * /api/users/me/image:
 *   put:
 *     summary: Upload profile image
 *     description: Upload user profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.put('/users/me/image',
  AuthMiddleware.verifyAccessToken,
  upload.single('image'),
  UserController.updateProfileImage
);

/**
 * @swagger
 * /api/users/me/image:
 *   delete:
 *     summary: Delete profile image
 *     description: Delete user profile image and revert to the default image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Image deleted and reverted to default successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.delete('/users/me/image',
  AuthMiddleware.verifyAccessToken,
  UserController.deleteProfileImage
);

export default router;
