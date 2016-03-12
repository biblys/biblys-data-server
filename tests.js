const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');

chai.should();
chai.use(chaiHttp);

// Models
const models = require('./models');
const User = models.User;
const Book = models.Book;
const Publisher = models.Publisher;

// Helpers
const authenticate = require('./helpers').authenticate;

describe('Web', function() {
  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});

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
          res.should.have.status(403);
          res.body.error.should.equal('Authentication required');
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
          res.should.have.status(403);
          res.body.should.have.property('error');
          res.body.error.should.equal('Authentication required');
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
          res.should.have.status(403);
          res.body.should.have.property('error');
          res.body.error.should.equal('Authentication required');
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
