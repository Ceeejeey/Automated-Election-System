const express = require('express');
const router = express.Router();
const { createElection, getAllElections, updateElection, deleteElection } = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/elections
// @desc    Admin creates an election
// @access  Private/Admin
router.post('/create-election', protect, adminOnly, createElection);
// Get All Elections
router.get('/elections', getAllElections);
// @route  PUT /api/elections/:id
// @desc   Update an election by ID
router.put('/update', protect, adminOnly, updateElection);
// @route  DELETE /api/elections/:id
router.delete('/delete/:id', protect, adminOnly, deleteElection);
module.exports = router;
