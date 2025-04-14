const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'voter'],
    default: 'voter',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add this to track votes
  votedElections: [
    {
      election: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election' 
      },
      votedAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
