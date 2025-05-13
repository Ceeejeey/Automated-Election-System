const express = require('express');
const router = express.Router();
const { createElection, getAllElections } = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/elections
// @desc    Admin creates an election
// @access  Private/Admin
router.post('/create-election', protect, adminOnly, createElection);
// Get All Elections
router.get('/elections', getAllElections);

module.exports = router;
