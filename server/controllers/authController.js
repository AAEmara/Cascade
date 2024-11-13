import {
  checkUserExists,
  hashPassword,
  checkHashedPassword,
  returnUser
} from '../utils/userHelper.js';
import {
  generateTokens,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  isValidRefreshToken,
  invalidateOldRefreshToken
} from '../utils/jwtHelper.js';
import User from '../models/Users.js'

/**
 * Class representing authentication and authorization controllers.
 * @class
 */
class AuthController {
  /**
   * Registers a user from the web application to the database.
   * This is an asynchronous method.
   * @async
   * @method registerUser
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.firstName - The first name of the user.
   * @param {string} req.body.lastName - The last name of the user.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Object} res - The response object sent by the server-side.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g., 
   * 'error', 'success').
   * @returns {Object} [return.data] - The data to be returned in the response.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   */
  static async registerUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const checkResult = await checkUserExists(email);

      if (checkResult.isSaved) {
        return res.status(400).json({
          status: 'error',
          message: 'Registration failed.',
          error: 'User already exists.'
        });
      }

      const hashedPassword = await hashPassword(password);
      const user = new User(
        { firstName, lastName, email, password: hashedPassword }
      );

      await user.save();

      return res.status(201).json({
        status: 'success',
        data: {},
        message: 'User was registered successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  /**
   * Authenticates a user and allows the user to login.
   * This is an asynchronous method.
   * @async
   * @method loginUser
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Object} res - The response object sent by the server-side.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g., 
   * 'error', 'success').
   * @returns {Object} [return.data] - The data to be returned in the response.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   * @returns {string} return.cookies.refreshToken - HTTP-only cookie with the
   * new refresh token.
   */
  static async loginUser (req, res) {
    try {
      // Retrieving the data from the request body.
      const { email, password } = req.body;

      // Step 1: Checking if the user exists in the database by email.
      const checkResult = await checkUserExists(email);
      if (!checkResult.isSaved) {
        return res.status(400).json({
          status: 'error',
          message: 'Login failed. Check your credentials again.',
          error: 'User does not exist.'
        });
      }

      // Step 2: Checking if the password matches what is inside the database.
      const hashedPassword = checkResult.user.password;
      const isAuthenticated = await checkHashedPassword(password,
        hashedPassword);

      if (!isAuthenticated) {
        return res.status(400).json({
          status: 'error',
          message: 'Login failed. Check your credentials again.',
          error: 'Password is wrong.'
        });
      }

      // Step 3: Preparing the JWT payload.
      const userId = checkResult.user._id;
      const webAppRole = checkResult.user.webAppRole;
      const companyRoles = checkResult.user.companyRoles;

      const payload = { _id: userId, webAppRole, companyRoles };

      if (!payload) {
        throw new Error('Missing Payload');
      }
      const { accessToken,
              refreshToken,
              refreshTokenExpiresAt } = generateTokens(payload);

      await saveRefreshToken(userId, refreshToken, refreshTokenExpiresAt);

      // Step 4: Sending an http-only cookie with expiration date.
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXP_MS)
      })

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken
        },
        message: 'User has logged in successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  /**
   * Refreshes the access token using a refresh token.
   * This is an asynchronous method.
   * @async
   * @method refreshToken
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.user - The user object of the request.
   * @param {string} req.user._id - The ID of the user.
   * @param {Object[]} req.user.companyRoles - The old company roles of
   * the user.
   * @param {string} req.user.webAppRole - The old web app role of the user.
   * @param {Object} req.cookies - The cookies sent by the client.
   * @param {string} req.cookies.refreshToken - The current refresh token.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g., 
   * 'error', 'success').
   * @returns {Object} [return.data] - The data to be returned in the response.
   * @returns {string} [return.data.accessToken] - The access token in data.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   */
  static async refreshToken (req, res) {
    try {
      // Retrieving the data from the request body and cookie.
      const userId = req.user._id;
      const { refreshToken: currentRefreshToken } = req.cookies;

      // Step 1: Checking if the refresh token is valid.
      const isValid = await isValidRefreshToken(userId, currentRefreshToken);
      if (!isValid) {
        // If the refresh token is invalid or expired, log the user out.
        res.clearCookie('refreshToken');
        return res.status(403).json({
          status: 'error',
          message: 'Forbidden access. Please log in again.',
          error: 'Invalid or expired refresh token.'
        });
      }

      // Step 2: Preparing the JWT payload.
      const user = await returnUser(userId);
      const { companyRoles, webAppRole } = user;
      const payload = { _id: userId, companyRoles, webAppRole };
      const accessToken = generateAccessToken(payload);

      // Step 3: checking and potentially extending the refresh token.
      const expiryBuffer = parseInt(process.env.REFRESH_TOKEN_BUFFER_EXP_MS);
      const refreshTokenExpiresAt = user.refreshTokenExpiresAt;
      const expiryPeriod = new Date(refreshTokenExpiresAt) - new Date();

      if (expiryPeriod < expiryBuffer) {
        const {
          refreshToken: newRefreshToken,
          refreshTokenExpiresAt: newRefreshTokenExpiresAt
        } = generateRefreshToken(payload);
        // Step 4: Saving the refresh token and its expiry date for the user.
        await saveRefreshToken(
          userId,
          newRefreshToken,
          newRefreshTokenExpiresAt
        );
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: parseInt(process.env.REFRESH_TOKEN_EXP_MS)
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken
        },
        message: 'Access token refreshed successfully.'
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

export default AuthController;
