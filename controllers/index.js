const express = require('express');
const router  = express.Router();
const Book    = require('../models/book');

router.use('/api/v0/books', require('./books'));
router.use('/api/v0/publishers', require('./publishers'));
router.use('/api/v0/users', require('./users'));

// Home page
router.get('/', function(req, res) {
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

module.exports = router;
