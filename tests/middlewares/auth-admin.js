const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
require('../../index');

chai.should();
chai.use(chaiHttp);

const User      = require('../../models/user');

const auth      = require('../../middlewares/auth');
const authAdmin = require('../../middlewares/auth-admin');

describe('authenticate admin middleware', function() {

  beforeEach(function(done) {
    const user = new User({ apiKey: 'user_key', name: 'User' });
    const admin = new User({ apiKey: 'admin_key', name: 'Admin', isAdmin: true });
    user.save(function(err) {
      if (err) throw err;

      admin.save(function(err) {
        if (err) throw err;

        done();
      });
    });
  });

  const app = express();
  app.get('/admin/', auth, authAdmin, function(req, res) {
    res.end();
  });

  it('should grant access to a user with admin privileges', function(done) {
    chai.request(app)
      .get('/admin/')
      .set('Authorization', 'admin_key')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should not grant access to a user without admin privileges', function(done) {
    chai.request(app)
      .get('/admin/')
      .set('Authorization', 'user_key')
      .end(function(err, res) {
        res.should.have.status(403);
        res.should.have.property('error');
        res.body.error.should.equal('You must be an administrator to do this');
        done();
      });
  });
});
