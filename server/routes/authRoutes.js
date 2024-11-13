import express from 'express';
import AuthValidator from '../validations/authValidation.js';
import AuthController from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes that handles
 *                Registration Process, Login Process, and
 *                Access and Refresh Tokens Generation Process
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "john_doe@123"
 *     responses:
 *       '201':
 *         description: User registered successfully
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
 *                   example: "User was registered successfully."
 *       '400':
 *         description: One of the registration fields is missing or
 *                      user does not exist, resulting in a bad request
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
 *                   example: "Registration failed."
 *                 error:
 *                   type: string
 *                   example: "User already exists."
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
router.post('/register',
  AuthValidator.registerRequest,
  AuthValidator.validateRegisterRequest,
  AuthValidator.validateRegisterSchema,
  AuthController.registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "john_doe@123"
 *     responses:
 *       '200':
 *         description: User authenticated successfully
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
 *                   example: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzA0NzBhYWY5ODMzNDNhZDc5ZmY2NWMiLCJjb21wYW55Um9sZXMiOltdLCJpYXQiOjE3MjgzNDQyMzcsImV4cCI6MTcyODM0NzgzN30.xYeyfe-JdcsNZqzct1SyJbhXomnL2ffjoIAgnBe0oU4" }
 *                 message:
 *                   type: string
 *                   example: "User has logged in successfully."
 *       '400':
 *         description: Credentials given for the login are invalid
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
 *                   example: "Login failed. Check your credentials again."
 *                 error:
 *                   type: string
 *                   example: "Error message"
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
router.post('/login',
  AuthValidator.loginRequest,
  AuthValidator.validateLoginRequest,
  AuthValidator.validateLoginSchema,
  AuthController.loginUser
);

/**
 * @swagger
 * /api/auth/refreshtokens:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - currentRefreshToken
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "60d9c6f5b5eefe7ef5b5f57c"
 *               currentRefreshToken:
 *                 type: string
 *                 description: The current refresh token
 *                 example: "someRefreshToken"
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: |
 *               HTTP cookie containing the refreshed token.
 *               - HttpOnly: true
 *               - Secure: true (only transmitted over HTTPS in production environment)
 *               - SameSite: Strict
 *               - Max-Age: 604800000 (7 days)
 *             schema:
 *               type: string
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
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "newAccessToken"
 *                 message:
 *                   type: string
 *                   example: "Access token refreshed successfully."
 *       '403':
 *         description:
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
 *                   example: "Forbidden access."
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired refresh token."
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
router.post('/refreshtokens',
  AuthController.refreshToken
);

export default router;
