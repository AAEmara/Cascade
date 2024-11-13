import User from '../models/Users.js';
import bcrypt from 'bcryptjs';

/**
 * Checks if the user exist according to the given email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} Result indicating if the user exists and the user data.
 * @throws {Error} If the email is not provided.
 */
async function checkUserExists(email) {
  if (!email) {
    throw new Error('One of the arguments is missing.');
  }
  const user = await User.findOne({ email }).exec();
  if (user) {
    return ({ isSaved: true, user });
  }
  return ({ isSaved: false, user: null });
}

/**
 * Returns the user according to the given user's id.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The user data.
 * @throws {Error} If the userId is not provided or the user is not found.
 */
async function returnUser(userId) {
  if (!userId) {
    throw new Error('One of the arguments is missing.');
  }
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
}

/**
 * Hashes the given password.
 * @param {string} password - The password that needs to be hashed.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} If the password is not provided.
 */
async function hashPassword(password) {
  if (!password) {
    throw new Error('One of the arguments is missing.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return (hashedPassword);
}

/**
 * Checks the given password matches the given hashed password.
 * @param {string} password - The plain password to check.
 * @param {string} hashedPassword - The hashed password (the truth).
 * @returns {Promise<boolean>} Indicates if the password is authenticated.
 * @throws {Error} If any of the parameters is not provided.
 */
async function checkHashedPassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    throw new Error('One of the arguments is missing.');
  }
  const isAuthenticated = await bcrypt.compare(password, hashedPassword);
  return (isAuthenticated);
}

/**
 * Checks if the user is requesting his own data or not.
 * @param {string} routedUserId - The userId in the route parameter.
 * @param {string} tokenUserId - The userID in the access token.
 * @returns {boolean} True if matches, False if it does not.
 * @throws {Error} If any of the arguments is not provided.
 */
function checkSameUser(routedUserId, tokenUserId) {
  if (!routedUserId || !tokenUserId) {
    throw new Error('One of the arguments is missing.');
  }

  if (routedUserId !== tokenUserId) {
    return (false);
  }

  return (true);
}

export { checkUserExists, hashPassword, checkHashedPassword, returnUser,
         checkSameUser };
