const User = require('../models/user');

// Authenticate
module.exports = function(req, res, next) {
  var apiKey = req.get('Authorization');

  if (apiKey === '' || typeof apiKey === 'undefined') {
    res.status(401).send({ error: 'API key was not provided' });
    return;
  }

  User.findOne({ apiKey: apiKey }, function(err, user) {
    if (err) {
      res.status(500).send({ error: 'An error occured while authentication' });
      return;
    }

    if (user) {
      req.user = user;
      next();
      return;
    }

    res.status(401).send({ error: 'API key is invalid' });
  });
};
