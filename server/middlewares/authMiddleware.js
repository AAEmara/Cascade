import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import Department from '../models/Departments.js';

class AuthMiddleware {
  static async verifyAccessToken (req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad request. Please check your request again.',
        error: 'The authorization header is missing.'
      });
    }

    const [ tokenHeader, accessToken ] = authHeader.split(' ');

    if (tokenHeader !== 'Bearer' || !accessToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad request. Please check your request again.',
        error: 'The authorization is not a Bearer type or token is missing.'
      });
    }

    try {
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
      if (!payload || !payload._id ||
          !payload.webAppRole || !payload.companyRoles) {
        return res.status(403).json({
          status: 'error',
          message: 'Forbidden access. Authorization failed.',
          error: 'Invalid token. Missing values from the token payload.'
        });
      }

      req.user = payload;
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }

  }

  static async checkCompanyAdmin (req, res, next) {
    const { departmentId } = req.params;
    
    try {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found',
          error: 'Department ID is not valid'
        });
      }
      const companyId = department.companyId;
      const user = await User.findById(req.user._id).populate('companyRoles.roleId');
      const isAdmin = user.companyRoles.some(role => {
        return (role.companyId.equals(companyId) &&
        role.roleId.hierarchyLevel === 'COMPANY_ADMIN');
      });

      if (!isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Not a company admin or in the same company.'
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async verifyTaskManagementAccess (req, res, next) {
    const userId = req.user._id;
    const { roleId } = req.params;

    try {
      // Retrieve the user's roles
      const user = await User.findById(userId).populate('companyRoles.roleId')
        .exec();

      // Find the role in the user's companyRoles
      const role = user.companyRoles.find(role => {
        return (role.roleId._id.equals(roleId));
      });
      if (!role) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Role not found for the user.'
        });
      }

      // Checking if the role's hierarchyLevel is allowed
      const allowedLevels = ['MANAGER', 'TOP_LEVEL_MANAGER', 'COMPANY_ADMIN'];
      if (!allowedLevels.includes(role.roleId.hierarchyLevel)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Insufficient permissions.'
        });
      }

      // Proceed to the next middleware/endpoint
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async verifyObjectiveManagementAccess (req, res, next) {
    const userId = req.user._id;
    const { roleId } = req.params;

    try {
      // Retrieve the user's roles
      const user = await User.findById(userId).populate('companyRoles.roleId')
        .exec();

      // Find the role in the user's companyRoles
      const role = user.companyRoles.find(role => {
        return (role.roleId._id.equals(roleId));
      });
      if (!role) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Role not found for the user.'
        });
      }

      // Checking if the role's hierarchyLevel is allowed
      const allowedLevels = ['TOP_LEVEL_MANAGER', 'COMPANY_ADMIN'];
      if (!allowedLevels.includes(role.roleId.hierarchyLevel)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
          error: 'Insufficient permissions.'
        });
      }

      // Proceed to the next middleware/endpoint
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }}

export default AuthMiddleware;
