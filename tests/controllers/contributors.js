'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const Contributor = require('../../models/contributor');
const User      = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Contributors', function() {

  let contributorId;

  Contributor.collection.drop();

  beforeEach(function(done) {
    const contributor = new Contributor({
      firstName: 'Thomas',
      lastName: 'Ligotti'
    });
    contributor.save(function(err, contributor) {
      contributorId = contributor._id;
      const user = new User({ apiKey: 'key', name: 'User' });
      user.save(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    Contributor.collection.drop();
    User.collection.drop();
    done();
  });

  describe('GET /api/v0/contributors/', function() {
    it('should return an array of contributors', function(done) {
      chai.request(server)
        .get('/api/v0/contributors/')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('count');
          res.body.count.should.equal(1);
          res.body.should.have.property('total');
          res.body.total.should.equal(1);
          res.body.should.have.property('skipped');
          res.body.skipped.should.equal(0);
          res.body.results.should.be.an('array');
          res.body.results[0].should.be.an('object');
          res.body.results[0].should.have.property('id');
          res.body.results[0].id.should.equal(contributorId.toString());
          res.body.results[0].should.have.property('name');
          res.body.results[0].name.should.equal('Thomas Ligotti');
          res.body.results[0].should.have.property('firstName');
          res.body.results[0].firstName.should.equal('Thomas');
          res.body.results[0].should.have.property('lastName');
          res.body.results[0].lastName.should.equal('Ligotti');
          done();
        });
    });
  });

  describe('GET /api/v0/contributors/:id', function() {

    it('should get a contributor', function(done) {
      chai.request(server)
        .get(`/api/v0/contributors/${contributorId}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.id.should.equal(contributorId.toString());
          res.body.should.have.property('name');
          res.body.name.should.equal('Thomas Ligotti');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Thomas');
          res.body.should.have.property('lastName');
          res.body.lastName.should.equal('Ligotti');
          done();
        });
    });

    it('should respond 404 if contributor does not exist', function(done) {
      chai.request(server)
        .get('/api/v0/contributors/1234')
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.equal('Cannot find a contributor with id 1234');
          done();
        });
    });

  });

  describe('POST /api/v0/contributors/', function() {

    it('should add a contributor', function(done) {
      chai.request(server)
        .post('/api/v0/contributors/')
        .set('Authorization', 'key')
        .send({ firstName: 'Lucius', lastName: 'Shepard' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Lucius Shepard');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Lucius');
          res.body.should.have.property('lastName');
          res.body.lastName.should.equal('Shepard');
          done();
        });
    });

    it('should add a contributor without first name', function(done) {
      chai.request(server)
        .post('/api/v0/contributors/')
        .set('Authorization', 'key')
        .send({ lastName: 'Voltaire' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Voltaire');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('');
          res.body.should.have.property('lastName');
          res.body.lastName.should.equal('Voltaire');
          done();
        });
    });

    it('should not be able to add a contributor without authentication', function(done) {
      chai.request(server)
        .post('/api/v0/contributors/')
        .send({ name: 'Dystopia' })
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.have.property('error');
          res.body.error.should.equal('API key was not provided');
          done();
        });
    });

    it('should not be able to add a contributor that already exists', function(done) {
      chai.request(server)
        .post('/api/v0/contributors/')
        .set('Authorization', 'key')
        .send({ firstName: 'Thomas', lastName: 'Ligotti' })
        .end(function(err, res) {
          res.should.have.status(409);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Thomas Ligotti');
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Thomas');
          res.body.should.have.property('lastName');
          res.body.lastName.should.equal('Ligotti');
          done();
        });
    });

    it('should not be able to add a contributor without a last name', function(done) {
      chai.request(server)
        .post('/api/v0/contributors/')
        .set('Authorization', 'key')
        .send({ firstName: 'Thomas' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Contributor validation failed');
          done();
        });
    });

  });

  describe('PUT /api/v0/contributors/:id', function() {

    it('should update a contributor');
    it('should update all books from this contributor if name changed');

  });
});
