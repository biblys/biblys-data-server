'use strict';

const app        = require('express')();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

// App settings
const port     = process.env.PORT || 8080;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/biblys';

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB
mongoose.connect(mongoUrl);
process.stdout.write(`Mongoose connected to ${mongoUrl}\n`);

// Controllers
app.use(require('./controllers'));

// HTTP server
app.listen(port);
process.stdout.write(`Biblys Data Server listening on port ${port}.\n`);

module.exports = app;
