import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
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
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *   responses:
 *     201:
 *       description: User registered sucessfully
 *     400:
 *       description: Bad request
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
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
 *               password:
 *                 type: string
 *   responses:
 *     200:
 *       description: User authenticated sucessfully
 *     400:
 *       description: Invalid credentials
 */
router.post('/login', loginUser);

export default router;
