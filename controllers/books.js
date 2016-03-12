const express = require('express');
const router  = express.Router();
const Book    = require('../models/book');
const authenticate = require('../helpers').authenticate;

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
      title: book.title
    });
  });
});

// Books POST
router.post('/', function(req, res) {
  authenticate(req, function(success, user) {
    if (!success) {
      res.status(403).send({ error: 'Authentication required' });
      return;
    }

    Book.findOne({ ean: req.body.ean }, function(err, book) {
      if (book) {
        res.status(409).send({
          error: `Book with EAN ${req.body.ean} already exists`
        });
        return;
      }

      book = new Book({
        ean: req.body.ean,
        title: req.body.title,
        createdBy: user._id
      });
      book.save(function(err) {
        if (err) {
          res.status(400).send({
            error: err.message
          });
          return;
        }

        res.status(201).send({
          ean: book.ean,
          title: book.title
        });
      });
    });
  });
});

module.exports = router;
