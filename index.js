"use strict";

const app = require('express')();

const port = 8080;

app.get('/', function(req, res) {
  res.send('Hello, data!');
});

app.listen(port);
console.log('Biblys Data Server listening on port 8080.');
