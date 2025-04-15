const express = require('express');
const router = express.Router();
const { getElectionResults } = require('../controllers/resultController');

// @route   GET /api/results/:electionId
// @desc    Get election results
// @access  Public
// This route is public to allow anyone to view the results
router.get('/results/:electionId', getElectionResults);

module.exports = router;
