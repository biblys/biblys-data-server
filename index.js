'use strict';

const app = require('express')();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// App settings
const port = process.env.PORT || 8080;
const mongo_url = process.env.MONGO_URL || 'mongodb://localhost/biblys';

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongo
mongoose.connect(mongo_url);
console.log(`Connected to mongodb at ${mongo_url}`);

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
    res.send(`<ul>${books.join('')}</ul>`);
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

// Books POST
app.post('/api/v0/books/:ean', function(req, res) {
  Book.findOne({ ean: req.params.ean }, function(err, book) {
    if (book) {
      res.status(409).send({
        error: `Book with EAN ${req.params.ean} already exists`
      });
      return;
    }
    book = new Book({
      ean: req.params.ean,
      title: req.body.title
    });
    book.save(function(err) {
      if (err) {
        res.status(500).send({
          error: err
        });
        return;
      }
      res.send();
    });
  });
});

app.listen(port);
console.log(`Biblys Data Server listening on port ${port}.`);
