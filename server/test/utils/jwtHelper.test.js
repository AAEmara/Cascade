import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/Users.js';
import * as jwtHelper from '../../utils/jwtHelper.js';

describe('JWT Helper Functions', () => {
  describe('generateAccessToken', () => {
    let jwtSignStub;
    let originalAccessExpEnv;

    beforeEach(() => {
      jwtSignStub = sinon.stub(jwt, 'sign');
      originalAccessExpEnv = process.env.ACCESS_TOKEN_EXP_MS;
    });

    afterEach(() => {
      sinon.restore();
      process.env.ACCESS_TOKEN_EXP_MS = originalAccessExpEnv;
    });

    it('should throw an error if payload is not provided', () => {
      try {
        jwtHelper.generateAccessToken(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should throw an error if process.env.ACCESS_TOKEN_EXP_MS is missing',
    () => {
      try {
        const payload = {
          _id: 'testUserId',
          webAppRole: 'USER',
          companyRoles: []
        };

        delete process.env.ACCESS_TOKEN_EXP_MS;

        jwtHelper.generateAccessToken(payload);
      } catch (error) {
        expect(error.message)
          .to.equal('Expiration period of the access token is missing.');
      }
    });

    it('should throw an error if JWT sign fails', () => {
      const payload = {
        _id: 'testUserId',
        webAppRole: 'USER',
        companyRoles: []
      };

      jwtSignStub.throws(new Error('invalid signature'));

      try {
        jwtHelper.generateAccessToken(payload);
      } catch (error) {
        expect(error.message)
          .to.equal('Access token generation failed: invalid signature.');
      }
    });

    it('should return an access token', () => {
      const payload = {
        _id: 'testUserId',
        webAppRole: 'USER',
        companyRoles: []
      };
      const accessToken = 'testAccessToken';

      jwtSignStub.returns(accessToken);
      const result = jwtHelper.generateAccessToken(payload);

      expect(result).to.be.a('string');
      expect(result).to.equal(accessToken);
    });
  });
  
  describe('generateRefreshToken', () => {
    let cryptoStub;
    let toStringStub;
    let originalAccessExpEnv;

    beforeEach(() => {
      toStringStub = sinon.stub();
      cryptoStub = sinon.stub(crypto, 'randomBytes')
        .returns({ toString: toStringStub });
      originalAccessExpEnv = process.env.REFRESH_TOKEN_EXP_MS;
    });

    afterEach(() => {
      sinon.restore();
      process.env.REFRESH_TOKEN_EXP_MS = originalAccessExpEnv;
    });

    it('should throw an error if process.env.REFRESH_TOKEN_EXP_MS is missing',
    () => {
      try {
        delete process.env.REFRESH_TOKEN_EXP_MS;
        jwtHelper.generateRefreshToken();
      } catch (error) {
        expect(error.message)
          .to.equal('Expiration period of the refresh token is missing.');
      }
    });

    it('should return refreshToken, and refreshTokenExpiresAt', () => {
      const refreshToken = 'testRefreshToken';
      toStringStub.returns(refreshToken);

      const result = jwtHelper.generateRefreshToken();
      expect(result.refreshToken).to.be.a('string');
      expect(result.refreshToken).to.equal('testRefreshToken');
      expect(result.refreshTokenExpiresAt).to.be.a('date');
    });
  });

  describe('generateTokens', () => {
    let jwtSignStub;
    let cryptoStub;
    let toStringStub;

    beforeEach(() => {
      toStringStub = sinon.stub();
      jwtSignStub = sinon.stub(jwt, 'sign');
      cryptoStub = sinon.stub(crypto, 'randomBytes')
        .returns({ toString: toStringStub });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should throw an error if payload is not provided', () => {
      try {
        jwtHelper.generateTokens(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return accessToken, refreshToken, and refreshTokenExpiresAt',
    () => {
      const payload = {
        _id: 'testUserId',
        webAppRole: 'USER',
        companyRoles: []
      };

      const accessToken = 'testAccessToken';
      const refreshToken = 'testRefreshToken';
      jwtSignStub.returns(accessToken);
      toStringStub.returns(refreshToken);
      const result = jwtHelper.generateTokens(payload);

      expect(result.accessToken).to.be.a('string');
      expect(result.accessToken).to.equal(accessToken);
      expect(result.refreshToken).to.be.a('string');
      expect(result.refreshToken).to.equal(refreshToken);
      expect(result.refreshTokenExpiresAt).to.be.a('date');
    });
  });

  describe('saveRefreshToken', () => {
    let updateOneStub;

    beforeEach(() => {
      updateOneStub = sinon.stub(User, 'updateOne');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should throw an error if userId is not provided', async () => {
      try {
        const refreshToken = 'testRefreshToken';
        const refreshTokenExpiresAt = new Date('2024-11-06T03:21:36.046Z');
        await jwtHelper.saveRefreshToken(
          null, refreshToken, refreshTokenExpiresAt
        );
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should throw an error if refreshToken is not provided', async () => {
      try {
        const userId = 'testUserId';
        const refreshTokenExpiresAt = new Date('2024-11-06T03:21:36.046Z');
        await jwtHelper.saveRefreshToken(userId, null, refreshTokenExpiresAt);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should throw an error if refreshTokenExpiresAt is not provided',
    async () => {
      try {
        const userId = 'testUserId';
        const refreshToken = 'testRefreshToken';
        await jwtHelper.saveRefreshToken(userId, refreshToken, null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should call User.updateOne with the correct arguments', async () => {
      const userId = 'testUserId';
      const refreshToken = 'testRefreshToken';
      const refreshTokenExpiresAt = new Date('2024-11-06T03:21:36.046Z');

      updateOneStub.resolves({ nModified: 1 });

      await jwtHelper.saveRefreshToken(
        userId, refreshToken, refreshTokenExpiresAt
      );

      expect(updateOneStub.calledOnce).to.be.true;
      expect(updateOneStub.calledWith(
        { _id: userId },
        { refreshToken, refreshTokenExpiresAt }
      )).to.be.true;
    });

    it('should throw an error if no documents were updated', async () => {
      try {
        const userId = 'testUserId';
        const refreshToken = 'testRefreshToken';
        const refreshTokenExpiresAt = new Date('2024-11-06T03:21:36.046Z');

        updateOneStub.resolves({ nModified: 0 });

      } catch (error) {
        expect(error.message).to.equal('Saving refresh token has failed.');
      }
    });
  });

  describe('isValidRefreshToken', () => {
    let findByIdStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(User, 'findById');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should throw an error if userId is not provided', async () => {
      try {
        const refreshToken = 'testRefreshToken';
        await jwtHelper.isValidRefreshToken(null, refreshToken);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should throw an error if refreshToken is not provided', async () => {
      try {
        const userId = 'testUserId';
        await jwtHelper.isValidRefreshToken(userId, null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return false if user is not found', async () => {
      const userId = 'testUserId';
      const refreshToken = 'testRefreshToken';
      const userData = { _id: '7eda120dfwqqjrf12llfi3',
                         firstName: 'John',
                         lastName: 'Doe',
                         email: 'john.doe@example.com',
                         password: '123eedcsadf1245dsa213',
                         webAppRole: 'USER',
                         companyRoles: [],
                         refreshToken: 'testRefreshToken',
                         refreshTokenExpiresAt: '1900-11-06T03:21:36.046Z',
                         createdAt: new Date('2024-01-01T00:00:00Z'),
                         updatedAt: new Date('2024-01-01T00:00:00Z')};

      findByIdStub.resolves(null)

      const result = await jwtHelper.isValidRefreshToken(userId, refreshToken);
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('should return false if user is not found', async () => {
      const userId = 'testUserId';
      const refreshToken = 'testRefreshToken';
      const userData = { _id: '7eda120dfwqqjrf12llfi3',
                         firstName: 'John',
                         lastName: 'Doe',
                         email: 'john.doe@example.com',
                         password: '123eedcsadf1245dsa213',
                         webAppRole: 'USER',
                         companyRoles: [],
                         refreshToken: 'invalidRefreshToken',
                         refreshTokenExpiresAt: '1900-11-06T03:21:36.046Z',
                         createdAt: new Date('2024-01-01T00:00:00Z'),
                         updatedAt: new Date('2024-01-01T00:00:00Z')};

      findByIdStub.resolves(userData)

      const result = await jwtHelper.isValidRefreshToken(userId, refreshToken);
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('should return true if refresh token is valid', async () => {
      const userId = '7eda120dfwqqjrf12llfi3';
      const refreshToken = 'testRefreshToken';
      const userData = { _id: '7eda120dfwqqjrf12llfi3',
                         firstName: 'John',
                         lastName: 'Doe',
                         email: 'john.doe@example.com',
                         password: '123eedcsadf1245dsa213',
                         webAppRole: 'USER',
                         companyRoles: [],
                         refreshToken: 'testRefreshToken',
                         refreshTokenExpiresAt: '2100-11-06T03:21:36.046Z',
                         createdAt: new Date('2024-01-01T00:00:00Z'),
                         updatedAt: new Date('2024-01-01T00:00:00Z')};
      findByIdStub.resolves(userData)

      const result = await jwtHelper.isValidRefreshToken(userId, refreshToken);
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });
  });

  describe('invalidateOldRefreshToken', () => {
    let updateOneStub;

    beforeEach(() => {
      updateOneStub = sinon.stub(User, 'updateOne');
    });

    afterEach(() => {
      sinon.restore();
    });
    it('should throw an error if userId is not provided', async () => {
      try {
        await jwtHelper.invalidateOldRefreshToken(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should call User.updateOne with the correct arguments', async () => {
      const userId = 'testUserId';

      updateOneStub.resolves({ nModified: 1 });

      await jwtHelper.invalidateOldRefreshToken(userId);

      expect(updateOneStub.calledOnce).to.be.true;
      expect(updateOneStub.calledWith(
        { _id: userId },
        { refreshToken: null,
          refreshTokenExpiresAt: null }
      )).to.be.true;
    });

    it('should throw an error if no documents were updated', async () => {
      try {
        const userId = 'testUserId';

        updateOneStub.resolves({ nModified: 0 });

        await jwtHelper.invalidateOldRefreshToken(userId);

        expect(updateOneStub.calledOnce).to.be.true;
        expect(updateOneStub.calledWith(
          { _id: userId },
          { refreshToken: null,
            refreshTokenExpiresAt: null }
        )).to.be.true;
      } catch (error) {
        const message = 'Invalidating the old refresh token has failed.';
        expect(error.message).to.equal(message);
      }
    });
  });
});
