const gk = require('generate-key');
const mongoose = require('mongoose');

// User model
const UserSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
    default: function() {
      return gk.generateKey(32);
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

module.exports = mongoose.model('User', UserSchema);
