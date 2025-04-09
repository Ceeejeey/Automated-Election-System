const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
const registerVoter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered.' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new voter
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'voter',
    });

    await user.save();
    res.status(201).json({ message: 'Voter registered successfully. Await admin approval.' });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    // Check if voter is approved
    if (user.role === 'voter' && !user.isVerified) {
      return res.status(403).json({ message: 'Voter account not approved yet.' });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = {
  registerVoter,
  loginUser,
};
