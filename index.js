'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
const fs         = require('fs');

// App settings
const port     = process.env.PORT || 8080;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/biblys';

// Create express server
const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Morgan logger
var accessLogStream = fs.createWriteStream(`${__dirname}/logs/access.log`, { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// MongoDB
mongoose.connect(mongoUrl);
process.stdout.write(`Mongoose connected to ${mongoUrl}\n`);

// Controllers
app.use(require('./controllers'));

// Public folder
app.use(express.static('public'));

// HTTP server
app.listen(port, function() {
  process.stdout.write(`Biblys Data Server listening on port ${port}.\n`);
});

module.exports = app;
