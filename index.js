'use strict';

const app = require('express')();
const mongoose = require('mongoose');

const port = 8080;

// Mongo
mongoose.connect('mongodb://localhost/biblys');

var Book = mongoose.model('Book', {
  title: String,
  ean: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date,
});

// Home page
app.get('/', function(req, res) {
  Book.find({}, function(err, books) {
    books = books.map(function(book) {
      return `<li>${book.title} (${book.ean})</li>`;
    });
    res.send(`<ul>${books.join()}</ul>`);
  });
});

// Books GET
app.get('/api/v0/books/:ean', function(req, res) {
  Book.findOne({ ean: req.params.ean }, function(err, book) {
    if (!book) {
      res.status(404).send({
        error: `Cannot find a book with EAN ${req.params.ean}`
      });
      return;
    }
    res.send({
      title: book.title,
      ean: book.ean
    });
  });
});

app.listen(port);
console.log('Biblys Data Server listening on port 8080.');
