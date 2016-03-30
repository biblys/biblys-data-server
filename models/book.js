
const mongoose = require('mongoose');
const ISBN = require('isbn-utils');

const ContributorSchema = new mongoose.Schema ({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128
  },
  role: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32
  }
});

const BookSchema = new mongoose.Schema({
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
  contributors: [ContributorSchema],
  publisher: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256
    }
  },
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

BookSchema.virtual('isbn').get(function() {
  return ISBN.parse(this.ean).asIsbn13(true);
});

BookSchema.virtual('response').get(function() {
  return {
    ean: this.ean,
    isbn: this.isbn,
    title: this.title,
    publisher: {
      id: this.publisher.id,
      name: this.publisher.name
    },
    contributors: this.contributors.map(function(contributor) {
      return {
        id: contributor.id,
        name: contributor.name,
        role: contributor.role
      };
    })
  };
});

BookSchema.method('addContributor', function(contributor, role) {
  this.contributors.push({
    id: contributor._id,
    name: contributor.name,
    role: role
  });
});

module.exports = mongoose.model('Book', BookSchema);
