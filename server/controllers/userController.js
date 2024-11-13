import User from '../models/Users.js';
import {
  returnUser,
  hashPassword,
  checkUserExists
} from '../utils/userHelper.js';
import s3 from '../config/aws.js';
import AWSHelper from '../utils/awsHelper.js';

/**
 * Class representing user controllers.
 * @class
 */
class UserController {
  /**
   * Retrieve user's data for the authenticated user from the database.
   * This is an asynchronous method.
   * @async
   * @method getUser
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.user - The user object of the request.
   * @param {string} req.user._id - The ID of the user.
   * @param {Object[]} req.user.companyRoles - The company roles of the user.
   * @param {string} req.user.webAppRole - The web app role of the user.
   * @param {Object} res - The response object sent by the server-side.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g.,
   * 'error', 'success').
   * @returns {Object} [return.data] - The data to be returned in the response.
   * @returns {string} [return.data._id] - The user ID.
   * @returns {string} [return.data.firstName] - The user's first name.
   * @returns {string} [return.data.lastName] - The user's last name.
   * @returns {string} [return.data.email] - The user's email.
   * @returns {string} [return.data.password] - The user's password.
   * @returns {Object} [return.data.companyRoles] - The user's company roles.
   * @returns {string} [return.data.companyRoles._id] - The company role's ID.
   * @returns {string} [return.data.companyRoles.companyId] - The company's ID
   *of the user's company role.
   * @returns {string} [return.data.companyRoles.departmentId] - The
   * department's ID of the user's company role.
   * @returns {string} [return.data.companyRoles.roleLevel] - The level of the
   * user's obtained role in the company.
   * @returns {string} [return.data.image] - The path of the image.
   * @returns {Date} [return.data.createdAt] - The creation date of the user.
   * @returns {Date} [return.data.updatedAt] - The latest update date of the
   * user.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   */
  static async getUser (req, res) {
    try {
      // Retrieving the user according to the access token data.
      const user = await User.findById(req.user._id)

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
          error: 'User ID is not valid.'
        });
      }

      const { _id, firstName, lastName,
              email, password, companyRoles,
              image, createdAt, updatedAt } = user;

      // Returning the user data with restructured companyRoles.
      return res.status(200).json({
        status: 'success',
        data: { _id, firstName, lastName,
                email, password, companyRoles,
                image, createdAt, updatedAt },
        message: 'User data is retrieved successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async searchUserByEmail (req, res) {
    const { email } = req.query;
    console.log(email);
    try {
      // Retrieving the user according to the access token data.
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
          error: 'User ID is not valid.'
        });
      }

      const { _id, firstName, lastName,
              image } = user;

      // Returning the user data with restructured companyRoles.
      return res.status(200).json({
        status: 'success',
        data: { _id, firstName, lastName,
                email, image },
        message: 'User was found successfully.'
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
   * Updates the user's data according to the given request.
   * This is an asynchronous method.
   * @async
   * @method updateUser
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.user - The user object of the request.
   * @param {string} req.user._id - The ID of the user.
   * @param {Object[]} req.user.companyRoles - The company roles of the user.
   * @param {string} req.user.webAppRole - The web app role of the user.
   * @param {Object} req.body - The body of the request.
   * @param {string} [req.body.firstName] - The first name of the user.
   * @param {string} [req.body.lastName] - The last name of the user.
   * @param {string} [req.body.email] - The email of the user.
   * @param {string} [req.body.password] - The password of the user.
   * @param {string} [req.body.image] - The image's path of the user.
   * @param {Object} res - The response object sent by the server-side.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g.,
   * 'error', 'success').
   * @returns {Object} [return.data] - The data is an empty object.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   */
  static async updateUser (req, res) {
    const { firstName, lastName, email, image } = req.body;
    let password = req.body.password;
    try {
      if (password) {
        // Hashing the password to update.
        password = await hashPassword(password);
      }
      if (email) {
        // Checks if a previous user still uses the same email.
        const result = await checkUserExists(email);
        if (result.isSaved) {
          return res.status(400).json({
            status: 'error',
            message: 'You can not use this email.',
            error: 'This email is used for another user.'
          });
        }
      }

      // Preparing the update payload.
      const update = {
        firstName, lastName, email, password, image
      };
      const userId = req.user._id;

      // Updating the user with the given payload.
      const updatedUser = await User.findByIdAndUpdate(
        userId, update, { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found.',
          error: 'User was not found and hence cannot update.'
        });
      }

      // Returning a response that the update was successful.
      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'User is updated successfully.'
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
   * Deletes the user from the web app.
   * This is an asynchronous method.
   * @async
   * @method deleteUser
   * @param {Object} req - The request object sent by the user (client-side).
   * @param {Object} req.user - The user object of the request.
   * @param {string} req.user._id - The ID of the user.
   * @param {Object[]} req.user.companyRoles - The company roles of the user.
   * @param {string} req.user.webAppRole - The web app role of the user.
   * @param {Object} res - The response object sent by the server-side.
   * @returns {Object} A response object with status, data (status is success),
   * message, error (status is error).
   * @returns {string} return.status - The status of the response (e.g.,
   * 'error', 'success').
   * @returns {Object} [return.data] - The data is an empty object.
   * @returns {string} return.message - The message describing the response.
   * @returns {string} [return.error] - The message describing the error.
   */
  static async deleteUser (req, res) {
    const userId = req.user._id;
    try {
      // Deleting the user.
      const result = await User.deleteOne({ _id: userId });
      if (!result.deletedCount) {
        throw new Error('Not able to delete the user.');
      }

      // Returning a response that the delete successful.
      return res.status(200).json({
        status: 'success',
        data: {},
        message: 'The user was deleted successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async updateProfileImage (req, res) {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a file.',
        error: 'Nothing was uploaded.'
      });
    }

    const allowedMimeTypes = [ 'image/jpeg', 'image/png' ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid file type. Please upload an image file.',
        error: 'Unsupported file type.'
      });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found.',
          error: 'Invalid user ID.'
        });
      }

      // Key of the existing image (to be deleted)
      const oldImageKey = user.image;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private'
      };
      const data = await s3.upload(params).promise();
      user.image = params.Key; // Saving the image key in the user profile

      // Deleting the old image of the user on cloud
      if (oldImageKey) {
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldImageKey
        }).promise();
      }

      await user.save();

      const key = user.image;
      const url = AWSHelper.generatePresignedUrl(
        process.env.AWS_BUCKET_NAME,
        key
      );
      return res.status(200).json({
        status: 'success',
        data: { image: url },
        message: 'Image uploaded successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async deleteProfileImage (req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found.',
          error: 'Invalid user ID.'
        });
      }

      // Key of the existing image (to be deleted)
      const oldImageKey = user.image;

      user.image = undefined; // Saving default image key in the user profile

      // Deleting the old image of the user on cloud
      if (!oldImageKey || oldImageKey === 'default_user_image.png') {
        return res.status(404).json({
          status: 'error',
          message: 'Image not found.',
          error: 'Invalid user image to delete.'
        });
      }

      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: oldImageKey
      }).promise();

      await user.save();
      return res.status(200).json({
        status: 'success',
        data: { image: user.image },
        message: 'Image deleted and reverted to default successfully.',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
  }

  static async getProfileImage (req, res) {
    const user = req.user;
    try {
      const user = await User.findById(req.user._id);
      const key = user.image;
      const url = AWSHelper.generatePresignedUrl(
        process.env.AWS_BUCKET_NAME,
        key
      );

      return res.status(200).json({
        status: 'success',
        data: { image: url },
        message: 'Image is retrieved successfully.'
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

export default UserController;
