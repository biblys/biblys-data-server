const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 64,
    default: '',
    set: function(value) {
      return value.trim();
    }
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    set: function(value) {
      return value.trim();
    }
  },
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date
});

ContributorSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

ContributorSchema.virtual('response').get(function() {
  return {
    id: this._id,
    name: this.name,
    firstName: this.firstName,
    lastName: this.lastName
  };
});

module.exports = mongoose.model('Contributor', ContributorSchema);
