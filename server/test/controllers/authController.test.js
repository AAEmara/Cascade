import { expect } from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';
import mongoose from 'mongoose'
import User from '../../models/Users.js';

describe('AuthController Class Methods', () => {
  describe('registerUser', () => {
    let req;
    let res;
    let checkUserExistsStub;
    let hashPasswordStub;
    let saveStub;
    let AuthController;

    beforeEach(async () => {
      // Create stubs
      checkUserExistsStub = sinon.stub();
      hashPasswordStub = sinon.stub();
      saveStub = sinon.stub(User.prototype, 'save');

      // Use esmock to mock dependencies
      AuthController = await esmock('../../controllers/authController.js', {
        '../../utils/userHelper.js': {
          checkUserExists: checkUserExistsStub,
          hashPassword: hashPasswordStub
        }
      });

      req = {
        body: {
          firstName: 'Mohammed',
          lastName: 'Mostafa',
          email: 'mohammed.mostafa@example.com',
          password: 'mohamed_mostafa@123'
        }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
    });

    afterEach(() => {
      sinon.restore();
      esmock.purge();
    });

    it('should return status 500 if email is not provided', async () => {
      req = {
        body: {
          lastName: 'Mostafa',
          email: 'mohammed.mostafa@example.com',
          password: 'mohamed_mostafa@123'
        }
      };
      const checkUserError = new Error('One of the arguments is missing.');
      checkUserExistsStub.rejects(checkUserError);

      await AuthController.registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

    it('should return status 400 if user already exists', async () => {
      const userData = {
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        password: '123eedcsadf1245dsa213',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      checkUserExistsStub.resolves({ isSaved: true, user: userData });

      await AuthController.registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'Registration failed.',
        error: 'User already exists.'
      })).to.be.true;
    });

    it('should return status 500 if hashPassword throws an error',
    async () => {
      const hashPasswordError = new Error('One of the arguments is missing.');
      checkUserExistsStub.resolves({ isSaved: false, user: null });
      hashPasswordStub.rejects(hashPasswordError);

      await AuthController.registerUser(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

    it('should return status 500 if save fails', async () => {
      const saveError = new Error('Save failed');
      checkUserExistsStub.resolves({ isSaved: false, user: null });
      hashPasswordStub.resolves('hashedPassword');
      saveStub.rejects(saveError);

      await AuthController.registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'Save failed'
      })).to.be.true;
    });

    it('should return status 201 if the user was registered', async () => {
      const user = {
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        password: '123eedcsadf1245dsa213',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      checkUserExistsStub.resolves({ isSaved: false, user: null });
      hashPasswordStub.resolves('hashedPassword');
      saveStub.resolves(user)

      await AuthController.registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        data: {},
        message: 'User was registered successfully.'
      })).to.be.true;
    });
  });

  describe('loginUser', () => {
    let req;
    let res
    let checkUserExistsStub;
    let checkHashedPasswordStub;
    let generateTokensStub;
    let AuthController;

    beforeEach(async () => {
      // Create stubs
      checkUserExistsStub = sinon.stub();
      checkHashedPasswordStub = sinon.stub();
      generateTokensStub = sinon.stub();

      // Use esmock to mock dependencies
      AuthController = await esmock('../../controllers/authController.js', {
        '../../utils/userHelper.js': {
          checkUserExists: checkUserExistsStub,
          checkHashedPassword: checkHashedPasswordStub
        },
        '../../utils/jwtHelper.js': {
          generateTokens: generateTokensStub,
        }
      });
      req = {
        body: {
          email: 'mohammed.mostafa@example.com',
          password: 'mohammed_mostafa@123'
        }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub()  // Ensure cookie method is stubbed
      };
    });

    afterEach(() => {
      sinon.restore();
      esmock.purge();
    });

    it('should return status 500 if email is not provided', async () => {
      req = {
        body: {
          password: 'mohammed_mostafa@123'
        }
      };
      const checkUserError = new Error('One of the arguments is missing.');
      checkUserExistsStub.rejects(checkUserError);

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

    it('should return status 400 if user does not exist', async () => {
      checkUserExistsStub.resolves({ isSaved: false, user: null });

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'Login failed. Check your credentials again.',
        error: 'User does not exist.'
      })).to.be.true;
    });

    it('should return status 500 if password is not provided', async () => {
      req = {
        body: {
          email: 'mohammed.mostafa@example.com',
        }
      };
      const userData = {
        _id: 'userId',
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        password: '123eedcsadf1245dsa213',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      checkUserExistsStub.resolves({ isSaved: true, user: userData });
      const checkUserError = new Error('One of the arguments is missing.');
      checkHashedPasswordStub.rejects(checkUserError);

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

    it('should return status 500 if hashedPassword is not provided',
    async () => {
      req = {
        body: {
          email: 'mohammed.mostafa@example.com',
        }
      };
      const userData = {
        _id: 'userId',
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      checkUserExistsStub.resolves({ isSaved: true, user: userData });
      const checkUserError = new Error('One of the arguments is missing.');
      checkHashedPasswordStub.rejects(checkUserError);

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

    it('should return status 400 if password does not match', async () => {
      const userData = {
        _id: 'userId',
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        password: '123eedcsadf1245dsa213',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      checkUserExistsStub.resolves({ isSaved: true, user: userData });
      checkHashedPasswordStub.resolves(false);

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'Login failed. Check your credentials again.',
        error: 'Password is wrong.'
      })).to.be.true;
    });

    it('should return status 500 if payload was not provided', async () => {
      const userData = {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Mohammed',
        lastName: 'Mostafa',
        email: 'mohammed.mostafa@example.com',
        password: '123eedcsadf1245dsa213',
        webAppRole: 'USER',
        companyRoles: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };
      const generateError = new Error('One of the arguments is missing.');

      checkUserExistsStub.resolves({ isSaved: true, user: userData });
      checkHashedPasswordStub.resolves(true);
      generateTokensStub.rejects(generateError);

      await AuthController.loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.',
        error: 'One of the arguments is missing.'
      })).to.be.true;
    });

  });

});
