import { expect } from 'chai';
import sinon from 'sinon';
import User from '../../models/Users.js';
import bcrypt from 'bcryptjs';
import { checkUserExists,
         returnUser,
         hashPassword,
         checkHashedPassword } from '../../utils/userHelper.js';


describe('User Helper Functions', () => {
  let execStub;
  let findOneStub;
  let findByIdStub;
  let hashStub;
  let compareStub;

  beforeEach(() => {
    execStub = sinon.stub();
    findOneStub = sinon.stub(User, 'findOne').returns({ exec: execStub });
    findByIdStub = sinon.stub(User, 'findById').returns({ exec: execStub });
    hashStub = sinon.stub(bcrypt, 'hash');
    compareStub = sinon.stub(bcrypt, 'compare');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('checkUserExists', () => {
    it('should throw an error if email is not provided', async () => {
      try {
        await checkUserExists(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return the user if the user exists', async () => {
      const email = 'john.doe@example.com';
      const userData = { firstName: 'John',
                         lastName: 'Doe',
                         email,
                         password: '123eedcsadf1245dsa213',
                         webAppRole: 'USER',
                         companyRoles: [],
                         createdAt: new Date('2024-01-01T00:00:00Z'),
                         updatedAt: new Date('2024-01-01T00:00:00Z')};

      execStub.resolves(userData);

      const result = await checkUserExists(email);
      expect(result).to.deep.equal({ isSaved: true, user: userData });
    });

    it('should return null if the user does not exist', async () => {
      const email = 'john.doe@example.com';
      execStub.resolves(null);

      const result = await checkUserExists(email);
      expect(result).to.deep.equal({ isSaved: false, user: null });
    });
  });

  describe('returnUser', () => {
    it('should throw an error if the userId is not provided', async () => {
      try {
        await returnUser(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return an error if the user is not found', async () => {
      try {
        const userId = '1edda120dfwqqjrf12llf3';
        execStub.resolves(null);

        await returnUser(userId);
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
    });

    it('should return user if found', async () => {
      const userId = '7eda120dfwqqjrf12llfi3'
      const userData = { firstName: 'John',
                         lastName: 'Doe',
                         email: 'john.doe@example.com',
                         password: '123eedcsadf1245dsa213',
                         webAppRole: 'USER',
                         companyRoles: [],
                         createdAt: new Date('2024-01-01T00:00:00Z'),
                         updatedAt: new Date('2024-01-01T00:00:00Z')};
      execStub.resolves(userData);

      const result = await returnUser(userId);
      expect(result).to.deep.equal(userData);
    });
  });

  describe('hashPassword', () => {
    it('should throw an error if password is not provided', async () => {
      try {
        await hashPassword(null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return a hashed password', async() => {
      const password = 'thisIsAPassword';
      const hashedPassword = '2ds123a24dfew2p3pndt';

      hashStub.resolves(hashedPassword);
      const result = await hashPassword(password);

      expect(result).to.equal(hashedPassword);
    });
  });

  describe('checkHashedPassword', () => {
    it('should throw an error if the password is not provided',
    async () => {
      try {
        const hashedPassword = '2ds123a24dfew2p3pndt';
        checkHashedPassword(null, hashedPassword);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should throw an error if the hashedPassword is not provided',
    async () => {
      try {
        const password = 'thisIsAPassword';
        checkHashedPassword(password, null);
      } catch (error) {
        expect(error.message).to.equal('One of the arguments is missing.');
      }
    });

    it('should return false if the password does not match the hashedPassword',
    async () => {
      const password = 'thisIsAPassword';
      const hashedPassword = '2ds123a24dfew2p3pndz';
      compareStub.resolves(false);

      const result = await checkHashedPassword(password, hashedPassword);
      expect(result).to.equal(false);
    });

    it('should return true if the password matches the hashedPassword',
    async () => {
      const password = 'thisIsAPassword';
      const hashedPassword = '2ds123a24dfew2p3pndt';
      compareStub.resolves(true);

      const result = await checkHashedPassword(password, hashedPassword);
      expect(result).to.equal(true);
    });
  });
});
