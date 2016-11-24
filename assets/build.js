'use strict';

require('!style!css!milligram');

document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/v0/books/')
  .then(function(response) {
    return response.json();
  }).then(function(body) {
    const results = body.results;
    const booksUl = document.querySelector('#books');
    results.forEach(function(book) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/api/v0/books/${book.ean}">${book.title}</a>`;
      booksUl.appendChild(li);
    });
  });
});
