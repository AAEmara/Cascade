import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server.js';
import mongoose from 'mongoose';

const chai = use(chaiHttp);

before(async () => {
  process.env.NODE_ENV = 'test';
  await mongoose.connection.dropDatabase();
});

after(async () => {
  await mongoose.disconnect();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request.execute(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.be.a('string');
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.deep.equal({});
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('User was registered successfully.');
          done();
        });
    });
  });
});
