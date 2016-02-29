const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');
const should = chai.should();

chai.use(chaiHttp);

// Models
const models = require('./models');
const Book = models.Book;
const User = models.User;

// Helpers
const authenticate = require('./helpers').authenticate;

describe('Web', function() {
  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

describe('Users', function() {

  User.collection.drop();

  beforeEach(function(done) {
    const user = new User({ apiKey: 'key' });
    const userWithoutKey = new User({ apiKey: '' });
    user.save(function(err) {
      const user = new User({
        apiKey: 'key'
      });
      userWithoutKey.save(function(err) {
        done();
      });
    });
  });

  afterEach(function(done){
    User.collection.drop();
    done();
  });

  describe('authenticate method', function() {

    it('should authenticate with correct credentials', function(done) {
      var req = { get: function() { return 'key'; } };
      authenticate(req, function(success) {
        success.should.be.true;
        done();
      });
    });

    it('should not authenticate with incorrect credentials', function(done) {
      var req = { get: function() { return 'wrong key'; } };
      authenticate(req, function(success) {
        success.should.be.false;
        done();
      });
    });

    it('should not authenticate with empty credentials', function(done) {
      var req = { get: function() { return ''; } };
      authenticate(req, function(success) {
        success.should.be.false;
        done();
      });
    });

  });

  describe('POST /api/v0/users/ ', function() {

    it('should not be able to create a user without authentication', function(done) {
      chai.request(server)
        .post(`/api/v0/users/`)
        .end(function(err, res){
          res.should.have.status(403);
          done();
      });
    });

    it('should add a user when authenticated', function(done) {
      chai.request(server)
        .post(`/api/v0/users/`)
        .set('Authorization', 'key')
        .end(function(err, res) {
          res.should.have.status(201);
          done();
      });
    });

  });
});

describe('Books', function() {

  Book.collection.drop();

  beforeEach(function(done) {
    const book = new Book({
      ean: '9791091146135',
      title: 'Chants du cauchemar et de la nuit'
    });
    book.save(function(err) {
      const user = new User({
        apiKey: 'key'
      });
      user.save(function(err) {
        done();
      });
    });
  });
  afterEach(function(done){
    Book.collection.drop();
    done();
  });

  describe('GET /api/v0/books/:ean', function() {

    it('should list a SINGLE book', function(done) {
      chai.request(server)
        .get(`/api/v0/books/9791091146135`)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('title');
          res.body.should.have.property('ean');
          res.body.ean.should.equal('9791091146135');
          res.body.title.should.equal('Chants du cauchemar et de la nuit');
          done();
      });
    });

    it('should respond 404 when querying a book that doesn\'t exist', function(done) {
      chai.request(server)
        .get(`/api/v0/books/9781234567890`)
        .end(function(err, res){
          res.should.have.status(404);
          done();
      });
    });

  });

  describe('POST /api/v0/books/ ', function() {

    it('should not be able to create a book without authentication', function(done) {
      chai.request(server)
        .post(`/api/v0/books/`)
        .send({ 'ean': '9782953595109', 'title': 'Bara Yogoï' })
        .end(function(err, res){
          res.should.have.status(403);
          done();
      });
    });

    it('should add a book when authenticated', function(done) {
      chai.request(server)
        .post(`/api/v0/books/`)
        .set('Authorization', 'key')
        .send({ 'ean': '9782953595109', 'title': 'Bara Yogoï' })
        .end(function(err, res) {
          res.should.have.status(201);
          done();
      });
    });

    it('should not be able to add a book that already exists', function(done) {
      chai.request(server)
        .post(`/api/v0/books/`)
        .set('Authorization', 'key')
        .send({ 'ean': '9791091146135', 'title': 'Chants du cauchemar et de la nuit' })
        .end(function(err, res) {
          res.should.have.status(409);
          done();
      });
    });

  });

  it('should update a SINGLE book on PUT /api/v0/books/:ean');
  it('should delete a SINGLE book on DELETE /api/v0/books/:ean');
});
