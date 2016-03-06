'use strict';

const gk = require('generate-key');
const mongoose = require('mongoose');

// User model
var User = mongoose.model('User', {
  apiKey: {
    type: String,
    default: function() {
      return gk.generateKey(32);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

// Book model
var Book = mongoose.model('Book', {
  ean: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

module.exports = {
  Book: Book,
  User: User
};
