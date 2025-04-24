const User = require('../models/User');

// GET /api/admin/pending-voters
const getPendingVoters = async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter', isVerified: false });
    res.status(200).json({ voters });
  } catch (error) {
    console.error('Get Pending Voters Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/admin/voters/:id/approve
const approveVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Voter not found' });

    res.status(200).json({ message: 'Voter approved successfully', voter: updated });
  } catch (error) {
    console.error('Approve Voter Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/admin/voters/:id/reject
const rejectVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Voter not found' });

    res.status(200).json({ message: 'Voter rejected and removed' });
  } catch (error) {
    console.error('Reject Voter Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPendingVoters,
  approveVoter,
  rejectVoter,
};
