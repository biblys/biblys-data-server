'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const Book      = require('../../models/book');
const Publisher = require('../../models/publisher');
const User      = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Books', function() {

  Book.collection.drop();
  Publisher.collection.drop();

  let publisherId;

  before(function(done) {
    const publisher = new Publisher({
      name: 'Dystopia'
    });
    publisher.save(function(err, publisher) {
      if (err) throw err;
      publisherId = publisher._id;
      const book = new Book({
        ean: '9791091146135',
        title: 'Chants du cauchemar et de la nuit',
        publisher: {
          id: publisher._id,
          name: publisher.name
        }
      });
      book.save(function(err) {
        if (err) throw err;
        const user = new User({
          apiKey: 'key'
        });
        user.save(function(err) {
          if (err) throw err;
          done();
        });
      });
    });
  });

  after(function(done) {
    Book.collection.drop();
    Publisher.collection.drop();
    User.collection.drop();
    done();
  });

  describe('GET /api/v0/books/', function() {

    it('should return an array of books', function(done) {
      chai.request(server)
        .get('/api/v0/books/')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('count');
          res.body.count.should.equal(1);
          res.body.should.have.property('total');
          res.body.total.should.equal(1);
          res.body.should.have.property('skipped');
          res.body.skipped.should.equal(0);
          res.body.should.have.property('count');
          res.body.results.should.be.an('array');
          res.body.results[0].should.be.an('object');
          res.body.results[0].should.have.property('ean');
          res.body.results[0].ean.should.equal('9791091146135');
          res.body.results[0].should.have.property('isbn');
          res.body.results[0].isbn.should.equal('979-10-91146-13-5');
          res.body.results[0].should.have.property('title');
          res.body.results[0].title.should.equal('Chants du cauchemar et de la nuit');
          res.body.results[0].should.have.property('publisher');
          res.body.results[0].publisher.should.have.property('id');
          res.body.results[0].publisher.id.should.equal(publisherId.toString());
          res.body.results[0].publisher.should.have.property('name');
          res.body.results[0].publisher.name.should.equal('Dystopia');
          done();
        });
    });

  });

  describe('GET /api/v0/books/:ean', function() {

    it('should list a SINGLE book', function(done) {
      chai.request(server)
        .get('/api/v0/books/9791091146135')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('ean');
          res.body.ean.should.equal('9791091146135');
          res.body.should.have.property('isbn');
          res.body.isbn.should.equal('979-10-91146-13-5');
          res.body.should.have.property('title');
          res.body.title.should.equal('Chants du cauchemar et de la nuit');
          res.body.should.have.property('publisher');
          res.body.publisher.should.have.property('id');
          res.body.publisher.id.should.equal(publisherId.toString());
          res.body.publisher.should.have.property('name');
          res.body.publisher.name.should.equal('Dystopia');
          done();
        });
    });

    it('should respond 404 when querying a book that does not exist', function(done) {
      chai.request(server)
        .get('/api/v0/books/9781234567890')
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.equal('Cannot find a book with EAN 9781234567890');
          done();
        });
    });

  });

  describe('POST /api/v0/books/ ', function() {

    it('should not be able to add a book without authentication', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .send({ ean: '9782953595109', title: 'Bara Yogoï' })
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.have.property('error');
          res.body.error.should.equal('API key was not provided');
          done();
        });
    });

    it('should not be able to add a book that already exists', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '9791091146135', title: 'Chants du cauchemar et de la nuit' })
        .end(function(err, res) {
          res.should.have.status(409);
          res.body.should.have.property('ean');
          res.body.ean.should.equal('9791091146135');
          res.body.should.have.property('title');
          res.body.title.should.equal('Chants du cauchemar et de la nuit');
          done();
        });
    });

    it('should not be able to add a book without EAN', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ title: 'Chants du cauchemar et de la nuit', publisher: publisherId })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          res.body.errors.ean.message.should.equal('Path `ean` is required.');
          done();
        });
    });

    it('should not be able to add a book with an invalid ISBN', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '979105', title: 'Chants du cauchemar et de la nuit', publisher: publisherId })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          res.body.errors.ean.message.should.equal('979105 is not a valid ISBN-13');
          done();
        });
    });

    it('should not be able to add a book without title', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '9782953595109', publisher: publisherId })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          res.body.errors.title.message.should.equal('Path `title` is required.');
          done();
        });
    });

    it('should not add a book without publisher', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '9782953595109', title: 'Chants du cauchemar et de la nuit' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Publisher parameter is required');
          done();
        });
    });

    it('should not add a book with a unknown publisher');

    it('should add a book', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({
          ean: '9782953595109',
          title: 'Bara Yogoï',
          publisher: publisherId
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('ean');
          res.body.ean.should.equal('9782953595109');
          res.body.should.have.property('title');
          res.body.title.should.equal('Bara Yogoï');
          res.body.should.have.property('publisher');
          res.body.publisher.should.have.property('id');
          res.body.publisher.id.should.equal(publisherId.toString());
          res.body.publisher.should.have.property('name');
          res.body.publisher.name.should.equal('Dystopia');
          done();
        });
    });

  });

  describe('PUT /api/v0/books/:ean', function() {
    it('should update a book');
  });

});
