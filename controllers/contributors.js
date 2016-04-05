'use strict';

const express     = require('express');
const router      = express.Router();
const Contributor = require('../models/contributor');
const auth        = require('../middlewares/auth');

// Contributors GET all
router.get('/', function(req, res) {
  let total = 0;
  const skip = parseInt(req.query.skip) || 0;
  const totalQuery = Contributor.find({});
  const limitQuery = Contributor.find({}).sort({ createdAt: -1 }).limit(10).skip(skip);
  totalQuery.exec().then(function(contributors) {
    total = contributors.length;
    return limitQuery.exec();
  }).then(function(contributors) {
    contributors = contributors.map(function(contributor) {
      return contributor.response;
    });

    res.status(200).send({
      count: contributors.length,
      total: total,
      skipped: skip,
      results: contributors
    });
  }).catch(function(err) {
    throw err;
  });
});

// Contributors GET single
router.get('/:id', function(req, res) {
  Contributor.findById(req.params.id, function(err, contributor) {
    if (!contributor) {
      res.status(404).send({
        error: `Cannot find a contributor with id ${req.params.id}`
      });
      return;
    }

    res.send(contributor.response);
  });
});

// Contributors POST
router.post('/', auth, function(req, res) {

  const contributorAttributes = {};

  if (!req.body.lastName) {
    res.status(400).send({ error: 'Last name parameter is required' });
    return;
  }

  contributorAttributes.lastName = req.body.lastName.trim();

  if (req.body.firstName) {
    contributorAttributes.firstName = req.body.firstName.trim();
  }

  Contributor.findOne(contributorAttributes, function(err, contributor) {
    if (err) throw err;
    if (contributor) {
      res.status(409).send(contributor.response);
      return;
    }

    contributorAttributes.createdBy = req.user._id;
    contributor = new Contributor(contributorAttributes);
    contributor.save(function(err) {
      if (err) {
        res.status(400).send({ error: err.message });
        return;
      }

      res.status(201).send(contributor.response);
    });
  });
});

module.exports = router;
