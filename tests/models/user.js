'use strict';

const User = require('../../models/user.js');

const user = new User();

describe('User model', function() {

  it('should create a user with an api key', function() {
    user.should.have.property('apiKey');
  });

  it('should create a user without admin rights by default', function() {
    user.should.have.property('isAdmin');
    user.isAdmin.should.be.false;
  });

});
