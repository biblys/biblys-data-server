const express = require('express');
const router  = express.Router();
const Publisher = require('../models/publisher');
const authenticate = require('../helpers').authenticate;

// Publishers POST
router.post('/', function(req, res) {
  authenticate(req, function(success, user) {
    if (!success) {
      res.status(403).send({ error: 'Authentication required' });
      return;
    }

    Publisher.findOne({ name: req.body.name }, function(err, publisher) {
      if (publisher) {
        res.status(409).send({
          error: `Publisher with name ${req.body.name} already exists`
        });
        return;
      }

      publisher = new Publisher({
        name: req.body.name,
        createdBy: user._id
      });
      publisher.save(function(err) {
        if (err) {
          res.status(400).send({
            error: err.message
          });
          return;
        }

        res.status(201).send({
          id: publisher._id,
          name: publisher.name
        });
      });
    });
  });
});

module.exports = router;
