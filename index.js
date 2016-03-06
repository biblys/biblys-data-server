'use strict';

const app = require('express')();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// App settings
const port = process.env.PORT || 8080;
const mongo_url = process.env.MONGO_URL || 'mongodb://localhost/biblys';

// Models
const models = require('./models');
const Book = models.Book;
const User = models.User;

// Helpers
const authenticate = require('./helpers').authenticate;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongo
mongoose.connect(mongo_url);

// Home page
app.get('/', function(req, res) {
  Book.find({}, function(err, books) {
    books = books.map(function(book) {
      return `<li>
          <a href="/api/v0/books/${book.ean}">${book.title}</a>
        </li>`;
    });
    res.send(`
      <h1>Biblys Data</h1>
      <a href="https://github.com/biblys/biblys-data-server">Read me</a>
      <ul>${books.join('')}</ul>`);
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
app.post('/api/v0/books/', function(req, res) {
  authenticate(req, function(success, user) {
    if (!success) {
      res.status(403).send({ error: 'Authentication required' });
      return;
    }
    Book.findOne({ ean: req.body.ean }, function(err, book) {
      if (book) {
        res.status(409).send({
          error: `Book with EAN ${req.params.ean} already exists`
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
        res.status(201).send();
      });
    });
  });
});

// Users POST
app.post('/api/v0/users/', function(req, res) {
  authenticate(req, function(success) {
    if (!success) {
      res.status(403).send({ error: 'Authentication required' });
      return;
    }
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
});

app.listen(port);
console.log(`Biblys Data Server listening on port ${port}.`);

module.exports = app;
