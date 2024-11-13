import { validationResult, body } from 'express-validator';
import Joi from 'joi';

/**
 * Class representing the user validations.
 * @class
 */
class UserValidator {
  static getUserRequest = [
    // Custom validation for req.user
    body().custom((_, { req }) => {
      if (!req.user || typeof req.user._id !== 'string' || req.user._id.trim() === '') {
        throw new Error('User ID is required and should be a string.');
      }
      if (!Array.isArray(req.user.companyRoles)) {
        throw new Error('Company roles should be an array.');
      }
      if (typeof req.user.webAppRole !== 'string' || req.user.webAppRole.trim() === '') {
        throw new Error('Web app role is required and should be a string.');
      }
      return true;
    })
  ];

  static validateGetUserRequest (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user data',
        error: result.array()
      });
    }
    next();
  }
}

export default UserValidator;
