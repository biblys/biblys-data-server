const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

const Book = require('../../models/book');
const User = require('../../models/user');

chai.should();
chai.use(chaiHttp);

describe('Books', function() {

  Book.collection.drop();

  beforeEach(function(done) {
    const book = new Book({
      ean: '9791091146135',
      title: 'Chants du cauchemar et de la nuit'
    });
    book.save(function() {
      const user = new User({
        apiKey: 'key'
      });
      user.save(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    Book.collection.drop();
    User.collection.drop();
    done();
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

    it('should add a book', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '9782953595109', title: 'Bara Yogoï' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('ean');
          res.body.ean.should.equal('9782953595109');
          res.body.should.have.property('title');
          res.body.title.should.equal('Bara Yogoï');
          done();
        });
    });

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
          res.body.should.have.property('error');
          res.body.error.should.equal('Book with EAN 9791091146135 already exists');
          done();
        });
    });

    it('should not be able to add a book without EAN', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ title: 'Chants du cauchemar et de la nuit' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          done();
        });
    });

    it('should not be able to add a book with an invalid ISBN', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '979105', title: 'Chants du cauchemar et de la nuit' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          done();
        });
    });

    it('should not be able to add a book without title', function(done) {
      chai.request(server)
        .post('/api/v0/books/')
        .set('Authorization', 'key')
        .send({ ean: '9782953595109' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.equal('Book validation failed');
          done();
        });
    });

  });

  it('should update a SINGLE book on PUT /api/v0/books/:ean');
});
