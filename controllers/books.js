'use strict';

const express = require('express');
const router  = express.Router();

const Book        = require('../models/book');
const Contributor = require('../models/contributor');
const Publisher   = require('../models/publisher');

const auth    = require('../middlewares/auth');

// Books GET all
router.get('/', function(req, res) {
  let total = 0;
  const skip = parseInt(req.query.skip) || 0;
  const totalQuery = Book.find({});
  const limitQuery = Book.find({}).sort({ createdAt: -1 }).limit(10).skip(skip);
  totalQuery.exec().then(function(books) {
    total = books.length;
    return limitQuery.exec();
  }).then(function(books) {
    books = books.map(function(book) {
      return book.response;
    });

    res.status(200).send({
      count: books.length,
      total: total,
      skipped: skip,
      results: books
    });
  }).catch(function(err) {
    throw err;
  });
});

// Books GET single
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
      res.status(409).send(book.response);
      return;
    }

    // Check publisher parameter
    if (typeof req.body.publisher === 'undefined') {
      res.status(400).send({
        error: 'Publisher parameter is required'
      });
      return;
    }

    // Check publisher parameter
    if (typeof req.body.authors === 'undefined') {
      res.status(400).send({
        error: 'Authors parameter is required'
      });
      return;
    }

    // Parse authors parameter and build query
    const authors = JSON.parse(req.body.authors);
    const authorQuery = authors.map(function(author) {
      return { _id: author.id };
    });

    // Get authors
    Contributor.find({ $or: authorQuery }, function(err, authors) {

      if (typeof authors === 'undefined' || authors.length === 0) {
        res.status(400).send({
          error: 'There should be at least one author'
        });
        return;
      }

      const bookAuthors = authors.map(function(author) {
        return {
          id: author._id,
          name: author.name
        };
      });

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
          authors: bookAuthors,
          publisher: {
            id: publisher._id,
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

          res.status(201).send(book.response);
        });

      });
    });
  });
});

module.exports = router;
