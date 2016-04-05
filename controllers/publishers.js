'use strict';

const express = require('express');
const router  = express.Router();
const Publisher = require('../models/publisher');
const auth = require('../middlewares/auth');

// Publishers GET all
router.get('/', function(req, res) {
  let total = 0;
  const skip = parseInt(req.query.skip) || 0;
  const totalQuery = Publisher.find({});
  const limitQuery = Publisher.find({}).sort({ createdAt: -1 }).limit(10).skip(skip);
  totalQuery.exec().then(function(publishers) {
    total = publishers.length;
    return limitQuery.exec();
  }).then(function(publishers) {
    publishers = publishers.map(function(publishers) {
      return publishers.response;
    });

    res.status(200).send({
      count: publishers.length,
      total: total,
      skipped: skip,
      results: publishers
    });
  }).catch(function(err) {
    throw err;
  });
});

// Publishers GET single
router.get('/:id', function(req, res) {
  Publisher.findById(req.params.id, function(err, publisher) {
    if (!publisher) {
      res.status(404).send({
        error: `Cannot find a publisher with id ${req.params.id}`
      });
      return;
    }

    res.status(200).send(publisher.response);
  });
});

// Publishers POST
router.post('/', auth, function(req, res) {
  Publisher.findOne({ name: req.body.name }, function(err, publisher) {
    if (publisher) {
      res.status(409).send(publisher.response);
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

      res.status(201).send(publisher.response);
    });
  });
});

module.exports = router;
