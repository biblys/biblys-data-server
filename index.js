'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// App settings
const port = process.env.PORT || 8080;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/biblys';

// Models
const User      = require('./models/user');
const Book      = require('./models/book');
const Publisher = require('./models/publisher');

// Helpers
const authenticate = require('./helpers').authenticate;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongo
mongoose.connect(mongoUrl);
process.stdout.write(`Mongoose connected to ${mongoUrl}\n`);

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
      ean: book.ean,
      isbn: book.isbn,
      title: book.title
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

// Publishers POST
app.post('/api/v0/publishers/', function(req, res) {
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
process.stdout.write(`Biblys Data Server listening on port ${port}.\n`);

module.exports = app;
