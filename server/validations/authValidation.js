import { body, validationResult } from 'express-validator';
import Joi from 'joi';

class AuthValidator {
  static registerRequest = [
    body('firstName').isString().isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters long.'),
    body('lastName').isString().isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters long.'),
    body('email').isEmail()
      .withMessage('Email must be valid.'),
    body('password').isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.'),
  ];

  static registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });

  static loginRequest = [
    body('email').isEmail()
      .withMessage('Email must be valid.'),
    body('password').isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
  ];

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });

  static validateRegisterRequest (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error occurred. Please check your request.',
        error: result.array()
      });
    }
    next();
  }

  static validateRegisterSchema (req, res, next) {
    const { error } = AuthValidator.registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error occured. Registration failed.',
        error: error.details[0].message
      });
    }
    next();
  }

  static validateLoginRequest (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error occurred. Please check your request.',
        error: result.array()
      });
    }
    next();
  }

  static validateLoginSchema (req, res, next) {
    const { error } = AuthValidator.loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error occured. Login failed.',
        error: error.details[0].message
      });
    }
    next();
  }

}

export default AuthValidator;
