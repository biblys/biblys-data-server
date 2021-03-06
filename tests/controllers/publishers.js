'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const Publisher = require('../../models/publisher');
const User      = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Publishers', function() {

  let publisherId;

  Publisher.collection.drop();

  beforeEach(function(done) {
    const publisher = new Publisher({
      name: 'Le Bélial\''
    });
    publisher.save(function(err, publisher) {
      publisherId = publisher._id;
      const user = new User({ apiKey: 'key', name: 'User' });
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

  describe('GET /api/v0/publishers/', function() {
    it('should return an array of publishers', function(done) {
      chai.request(server)
        .get('/api/v0/publishers/')
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
          res.body.results[0].id.should.equal(publisherId.toString());
          res.body.results[0].should.have.property('name');
          res.body.results[0].name.should.equal('Le Bélial\'');
          done();
        });
    });
  });

  describe('GET /api/v0/publishers/:id', function() {

    it('should get a publisher', function(done) {
      chai.request(server)
        .get(`/api/v0/publishers/${publisherId}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.id.should.equal(publisherId.toString());
          res.body.should.have.property('name');
          res.body.name.should.equal('Le Bélial\'');
          done();
        });
    });

    it('should respond 404 if publisher does not exist', function(done) {
      chai.request(server)
        .get('/api/v0/publishers/1234')
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.equal('Cannot find a publisher with id 1234');
          done();
        });
    });

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
          res.body.should.have.property('id');
          res.body.id.should.equal(publisherId.toString());
          res.body.should.have.property('name');
          res.body.name.should.equal('Le Bélial\'');
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

  describe('PUT /api/v0/publishers/:id', function() {

    it('should update a publisher');
    it('should update all books from this publisher if name changed');

  });
});
