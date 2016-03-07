'use strict';

const gk = require('generate-key');
const mongoose = require('mongoose');
const ISBN = require('isbn-utils');

// User model
const User = mongoose.model('User', {
  apiKey: {
    type: String,
    required: true,
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
const Book = mongoose.model('Book', {
  ean: {
    type: String,
    required: true,
    validate: {
      validator: function(ean) {
        return ISBN.parse(ean) !== null && ISBN.parse(ean).isIsbn13();
      },
      message: '{VALUE} is not a valid ISBN-13'
    }
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

// Publisher
const Publisher = mongoose.model('Publiser', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256
  },
  createdBy: String,
}, { timestamps: true });

module.exports = {
  Book: Book,
  User: User,
  Publisher: Publisher
};
