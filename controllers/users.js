const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/auth-admin');

// Users POST
router.post('/', auth, authAdmin, function(req, res) {

  if (typeof req.body.name === 'undefined') {
    res.status(400).send({
      error: 'Name parameter is required'
    });
    return;
  }

  const user = new User({ name: req.body.name });
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

module.exports = router;
