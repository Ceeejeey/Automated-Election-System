const express = require('express');
const router = express.Router();
const {
  getPendingVoters,
  approveVoter,
  rejectVoter
} = require('../controllers/adminController');

// Middleware to protect routes if needed, add auth if you have it!

router.get('/pending-voters', getPendingVoters);
router.put('/voters/:id/approve', approveVoter);
router.put('/voters/:id/reject', rejectVoter);

module.exports = router;
