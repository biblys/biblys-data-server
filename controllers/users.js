const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const authenticate = require('../helpers').authenticate;

// Users POST
router.post('/', function(req, res) {
  authenticate(req, function(success) {
    if (!success) {
      res.status(403).send({ error: 'Authentication required' });
      return;
    }

    const user = new User();
    user.save(function(err) {
      if (err) {
        res.status(500).send({
          error: err
        });
        return;
      }

      res.status(201).send({
        apiKey: user.apiKey
      });
    });
  });
});

module.exports = router;
