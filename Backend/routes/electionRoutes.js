const express = require('express');
const router = express.Router();
const { createElection } = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/elections
// @desc    Admin creates an election
// @access  Private/Admin
router.post('/', protect, adminOnly, createElection);

module.exports = router;
