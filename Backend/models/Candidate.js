const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    default: 'Independent'
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  bio: {
    type: String
  },
  photo: {
    type: String // URL to image (optional for now)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
