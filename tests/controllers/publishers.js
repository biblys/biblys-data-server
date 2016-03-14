const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const Publisher = require('../../models/publisher');
const User      = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Publishers', function() {

  Publisher.collection.drop();

  beforeEach(function(done) {
    const publisher = new Publisher({
      name: 'Le Bélial\''
    });
    publisher.save(function() {
      const user = new User({ apiKey: 'key' });
      user.save(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    Publisher.collection.drop();
    User.collection.drop();
    done();
  });

  describe('POST /api/v0/publishers/', function() {

    it('should add a publisher', function(done) {
      chai.request(server)
        .post('/api/v0/publishers/')
        .set('Authorization', 'key')
        .send({ name: 'Dystopia' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Dystopia');
          done();
        });
    });

    it('should not be able to add a publisher without authentication', function(done) {
      chai.request(server)
        .post('/api/v0/publishers/')
        .send({ name: 'Dystopia' })
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.have.property('error');
          res.body.error.should.equal('API key was not provided');
          done();
        });
    });

    it('should not be able to add a publisher that already exists', function(done) {
      chai.request(server)
        .post('/api/v0/publishers/')
        .set('Authorization', 'key')
        .send({ name: 'Le Bélial\'' })
        .end(function(err, res) {
          res.should.have.status(409);
          res.body.should.have.property('error');
          res.body.error.should.equal('Publisher with name Le Bélial\' already exists');
          done();
        });
    });

    it('should not be able to add a book without a name', function(done) {
      chai.request(server)
        .post('/api/v0/publishers/')
        .set('Authorization', 'key')
        .send({ })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Publisher validation failed');
          done();
        });
    });

  });
});
