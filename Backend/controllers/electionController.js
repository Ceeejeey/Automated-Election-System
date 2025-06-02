const Election = require('../models/Election');

//==============create election================
/**
 * @route   POST /api/elections/create-election
 * @desc    Admin creates an election
 * @access  Private/Admin
 */

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

//==============get all elections================
/**
 * @route   GET /api/elections
 * @desc    Get all elections sorted by start date in descending order
 * @access  Public
 */
// This function retrieves all elections, sorted by start date in descending order
const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ startDate: -1 }); // Latest first
    res.status(200).json(elections);
  } catch (error) {
    console.error('Get All Elections Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

//==============update election================
/**
 * @route   PUT /api/elections/:id
 * @desc    Update an election by ID
 * @access  Private/Admin
 */


const updateElection = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedElection = await Election.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedElection) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.status(200).json(updatedElection);
  } catch (error) {
    console.error("Update Election Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//==============delete election================
/**
 * @route   DELETE /api/elections/:id
 * @desc    Delete an election by ID
 * @access  Private/Admin
 */

const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Election.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.status(200).json({ message: "Election deleted successfully" });
  } catch (error) {
    console.error("Delete Election Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  createElection,
  getAllElections,
  updateElection,
  deleteElection
};
