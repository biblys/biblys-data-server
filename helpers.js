'use strict';

const User = require('./models/user');

// Authenticate
var authenticate = function(req, callback) {
  var apiKey = req.get('Authorization');

  if (apiKey === '' || typeof apiKey === 'undefined') {
    callback(false, 'API key was not provided');
    return;
  }

  User.findOne({ apiKey: apiKey }, function(err, user) {
    if (err) {
      callback(false, 'An error occured while authentication');
      return;
    }

    if (user) {
      callback(true, user);
      return;
    }

    callback(false, 'Invalid credentials');
  });
};

module.exports = {
  authenticate: authenticate
};
