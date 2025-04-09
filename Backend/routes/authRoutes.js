const express = require('express');
const router = express.Router();

const { registerVoter, loginUser } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register as a voter
router.post('/register', registerVoter);

// @route   POST /api/auth/login
// @desc    Login as voter or admin
router.post('/login', loginUser);

module.exports = router;
