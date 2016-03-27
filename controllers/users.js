const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/auth-admin');

// Users POST
router.post('/', auth, authAdmin, function(req, res) {
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

module.exports = router;
