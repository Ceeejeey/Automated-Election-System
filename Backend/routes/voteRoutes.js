const express = require('express');
const { castVote, checkVote } = require('../controllers/voteController');
const router = express.Router();

// Route for casting a vote
router.post('/castVote', castVote);

// Route for checking if a user has voted in a specific election
router.post('/check', checkVote);

module.exports = router;
