const mongoose = require('mongoose');

module.exports = mongoose.model('Publisher', {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256
  },
  createdBy: String
});
