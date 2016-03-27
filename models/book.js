
const mongoose = require('mongoose');
const ISBN = require('isbn-utils');

// Book model
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
    }
  };
});

module.exports = mongoose.model('Book', BookSchema);
