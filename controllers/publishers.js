const express = require('express');
const router  = express.Router();
const Publisher = require('../models/publisher');
const auth = require('../middlewares/auth');

// Publishers GET
router.get('/:id', function(req, res) {
  Publisher.findById(req.params.id, function(err, publisher) {
    if (!publisher) {
      res.status(404).send({
        error: `Cannot find a publisher with id ${req.params.id}`
      });
      return;
    }

    res.status(200).send({
      id: publisher._id,
      name: publisher.name
    });
  });
});

// Publishers POST
router.post('/', auth, function(req, res) {
  Publisher.findOne({ name: req.body.name }, function(err, publisher) {
    if (publisher) {
      res.status(409).send({
        error: `Publisher with name ${req.body.name} already exists`,
        publisher: {
          id: publisher._id,
          name: publisher.name
        }
      });
      return;
    }

    publisher = new Publisher({
      name: req.body.name,
      createdBy: req.user._id
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

module.exports = router;
