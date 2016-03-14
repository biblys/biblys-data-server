const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const User = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Users', function() {

  User.collection.drop();

  beforeEach(function(done) {
    const user = new User({ apiKey: 'key' });
    user.save(function(err) {
      if (err) {
        throw err;
      }

      done();
    });
  });

  afterEach(function(done) {
    User.collection.drop();
    done();
  });

  describe('POST /api/v0/users/ ', function() {

    it('should add a user when authenticated', function(done) {
      chai.request(server)
        .post('/api/v0/users/')
        .set('Authorization', 'key')
        .send({ name: 'User', email: 'user@example.com', url: 'http://example.com' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('apiKey');
          done();
        });
    });

    it('should not be able to create a user without authentication', function(done) {
      chai.request(server)
        .post('/api/v0/users/')
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.error.should.equal('API key was not provided');
          done();
        });
    });

    it('should not add a user without name', function(done) {
      chai.request(server)
        .post('/api/v0/users/')
        .set('Authorization', 'key')
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('apiKey');
          done();
        });
    });

  });
});
