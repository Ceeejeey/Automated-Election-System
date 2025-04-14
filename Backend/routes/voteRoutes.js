const express = require('express');
const { castVote } = require('../controllers/voteController');
const router = express.Router();

// Route for casting a vote
router.post('/castVote', castVote);

module.exports = router;
