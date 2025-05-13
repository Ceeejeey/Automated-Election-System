const Election = require('../models/Election');

const createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // Optional: validate date logic (e.g., start < end)
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id // from auth middleware
    });

    await election.save();
    res.status(201).json({ message: 'Election created successfully', election });
  } catch (error) {
    console.error('Create Election Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ startDate: -1 }); // Latest first
    res.status(200).json(elections);
  } catch (error) {
    console.error('Get All Elections Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createElection,
  getAllElections,
};
