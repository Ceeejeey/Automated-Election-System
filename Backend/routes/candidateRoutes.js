const express = require('express');
const router = express.Router();
const { addCandidate } = require('../controllers/candidateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/candidates
// @desc    Admin adds a candidate to election
// @access  Private/Admin
router.post('/', protect, adminOnly, addCandidate);

module.exports = router;
