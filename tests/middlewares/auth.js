const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
require('../../index');

chai.should();
chai.use(chaiHttp);

const User      = require('../../models/user');

// middlewares
const auth = require('../../middlewares/auth');

describe('authenticate middleware', function() {

  beforeEach(function(done) {
    const user = new User({ apiKey: 'key', name: 'User' });
    user.save(function(err) {
      if (err) throw err;

      done();
    });
  });

  const app = express();
  app.get('/', auth, function(req, res) {
    res.end();
  });

  it('should authenticate with correct credentials', function(done) {
    chai.request(app)
      .get('/')
      .set('Authorization', 'key')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should not authenticate with incorrect credentials', function(done) {
    chai.request(app)
      .get('/')
      .set('Authorization', 'wrong key')
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.have.property('error');
        res.body.error.should.equal('API key is invalid');
        done();
      });
  });

  it('should not authenticate with empty credentials', function(done) {
    chai.request(app)
      .get('/')
      .set('Authorization', '')
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.have.property('error');
        res.body.error.should.equal('API key was not provided');
        done();
      });
  });
});
