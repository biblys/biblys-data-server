const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256
  },
  createdBy: String
});

PublisherSchema.virtual('response').get(function() {
  return {
    id: this.id,
    name: this.name
  };
});

module.exports = mongoose.model('Publisher', PublisherSchema);
