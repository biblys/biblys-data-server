'use strict';

const User = require('./models').User;

// Authenticate
var authenticate = function(req, callback) {
  var apiKey = req.get('Authorization');
  User.findOne({ apiKey: apiKey }, function(err, user) {
    if (err) {
      callback(false, 'An error occured while authentication');
      console.log(err);
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
