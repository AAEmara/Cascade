import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/Users.js';

/**
 * Generates access token using JWT.
 * @param {Object} payload - The payload for JWT.
 * @param {string} payload._id - The ID of the user (ObjectId as a string).
 * @param {string} payload.webAppRole - The user's role in the web app.
 * @param {Array} payload.companyRoles - The sub-document that contains
 * different company roles per user.
 * @param {string} payload.companyRoles._id - The ID of the sub-document
 * (ObjectId as a string).
 * @param {string} payload.companyRoles.companyId - The ID of the company
 * (ObjectId as a string).
 * @param {string} payload.companyRoles.departmentId - The ID of the
 * company's department (ObjectId as a string).
 * @param {string} payload.companyRoles.role - The user's role in the company.
 * @returns {string} The JWT access token.
 */
function generateAccessToken (payload) {
  if (!payload) {
    throw new Error('One of the arguments is missing.');
  }
  const accessExpiryPeriodMs = process.env.REFRESH_TOKEN_EXP_MS;
  if (!accessExpiryPeriodMs) {
    throw new Error('Expiration period of the access token is missing.');
  }

  try {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP_MS) }
    );

    return (accessToken);
  } catch (error) {
    throw new Error(`Access token generation failed: ${error.message}.`);
  }
}

/**
 * Generates refresh token along with its expiry date.
 * @returns {Object} Refresh token and its expiry date.
 * @returns {string} return.accessToken - The JWT access token.
 * @returns {string} return.refreshToken - The refresh token.
 */
function generateRefreshToken () {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshExpiryPeriodMs = process.env.REFRESH_TOKEN_EXP_MS;
  if (!refreshExpiryPeriodMs) {
    throw new Error('Expiration period of the refresh token is missing.');
  }
  const refreshTokenExpiresAt = new Date(
    Date.now() + parseInt(refreshExpiryPeriodMs));

  return { refreshToken, refreshTokenExpiresAt };
}

/**
 * Generates access token, and refresh token along with the expiry date of
 * the refresh token.
 * @param {Object} payload - The payload for JWT.
 * @param {string} payload._id - The ID of the user (ObjectId as a string).
 * @param {string} payload.webAppRole - The user's role in the web app.
 * @param {Array} payload.companyRoles - The sub-document that contains
 * different company roles per user.
 * @param {string} payload.companyRoles._id - The ID of the sub-document
 * (ObjectId as a string).
 * @param {string} payload.companyRoles.companyId - The ID of the company
 * (ObjectId as a string).
 * @param {string} payload.companyRoles.departmentId - The ID of the
 * company's department (ObjectId as a string).
 * @param {string} payload.companyRoles.role - The user's role in the company.
 * @returns {Object} Tokens and refresh token expiry date.
 * @returns {string} return.accessToken - The JWT access token.
 * @returns {string} return.refreshToken - The refresh token.
 * @returns {Date} return.refreshTokenExpiresAt - The expiry date of the
 * refresh token.
 * @throws {Error} If the payload is not provided.
 */
function generateTokens (payload) {
  if (!payload) {
    console.log('generateTokens: Missing payload');
    throw new Error('One of the arguments is missing.');
  }

  const accessToken = generateAccessToken(payload); 
  const { refreshToken, refreshTokenExpiresAt } = generateRefreshToken();
  return { accessToken, refreshToken, refreshTokenExpiresAt };
}

/**
 * Saves the refresh token and its expiry date in the database.
 * @param {string} userId - The ID of the user (ObjectId as a string).
 * @param {string} refreshToken - The refresh token.
 * @param {Date} refreshTokenExpiresAt - The refresh token expiry date.
 * @throws {Error} If one of the parameters is not provided.
 * @throws {Error} If the function failed to save the refreshToken and 
 * refreshTokenExpiresAt in the database.
 */
async function saveRefreshToken (userId, refreshToken, refreshTokenExpiresAt) {
  if (!userId || !refreshToken || !refreshTokenExpiresAt) {
    throw new Error('One of the arguments is missing.');
  }
  const result = await User.updateOne(
    { _id: userId },
    { refreshToken, refreshTokenExpiresAt }
  );

  if (result.nModified === 0) {
    throw new Error('Saving refresh token has failed.');
  }
}

/**
 * Checks if the refresh token is valid or not.
 * @param {string} userId - The ID of the user (ObjectId as a string).
 * @param {string} refreshToken - The refresh token.
 * @returns {boolean} Returns true if valid and false otherwise.
 * @throws {Error} If one of the parameters is not provided.
 */
async function isValidRefreshToken (userId, refreshToken) {
  if (!userId || !refreshToken) {
    throw new Error('One of the arguments is missing.');
  }

  const user = await User.findById(userId);
  if (!user || refreshToken !== user.refreshToken) {
    return (false);
  }

  if (new Date() > new Date(user.refreshTokenExpiresAt)) {
    return (false);
  }

  return (true);
}

/**
 * Invalidates an old refresh token.
 * @param {string} userId - The ID of the user (ObjectId as a string).
 * @throws {Error} If the userId is not provided.
 */
async function invalidateOldRefreshToken (userId) {
  if (!userId) {
    throw new Error('One of the arguments is missing.');
  }

  const result = await User.updateOne({ _id: userId },
                                      { refreshToken: null,
                                        refreshTokenExpiresAt: null });

  if (result.nModified === 0) {
    throw new Error('Invalidating the old refresh token has failed.');
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  saveRefreshToken,
  isValidRefreshToken,
  invalidateOldRefreshToken };
