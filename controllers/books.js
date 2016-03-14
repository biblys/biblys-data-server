const express = require('express');
const router  = express.Router();

const Book      = require('../models/book');
const Publisher = require('../models/publisher');

const auth    = require('../middlewares/auth');

// Books GET
router.get('/:ean', function(req, res) {
  Book.findOne({ ean: req.params.ean }, function(err, book) {
    if (!book) {
      res.status(404).send({
        error: `Cannot find a book with EAN ${req.params.ean}`
      });
      return;
    }

    res.send({
      ean: book.ean,
      isbn: book.isbn,
      title: book.title,
      publisher: book.publisher
    });
  });
});

// Books POST
router.post('/', auth, function(req, res) {
  Book.findOne({ ean: req.body.ean }, function(err, book) {
    if (book) {
      res.status(409).send({
        error: `Book with EAN ${req.body.ean} already exists`
      });
      return;
    }

    if (typeof req.body.publisher === 'undefined') {
      res.status(400).send({
        error: 'Publisher parameter is required'
      });
    }

    // Get publisher
    Publisher.findOne({ _id: req.body.publisher }, function(err, publisher) {
      if (err) throw err;

      if (!publisher) {
        res.status(400).send({ error: `Cannot find a publisher with id ${req.body.publisher}` });
        return;
      }

      book = new Book({
        ean: req.body.ean,
        title: req.body.title,
        publisher: {
          _id: publisher._id,
          name: publisher.name
        },
        createdBy: req.user._id
      });
      book.save(function(err) {
        if (err) {
          res.status(400).send({
            error: err.message,
            errors: err.errors
          });
          return;
        }

        res.status(201).send({
          ean: book.ean,
          title: book.title,
          publisher: book.publisher
        });
      });

    });
  });
});

module.exports = router;
