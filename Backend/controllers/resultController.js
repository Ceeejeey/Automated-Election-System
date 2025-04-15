// controllers/resultController.js
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

const getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidates = await Candidate.find({ election: electionId })
      .select('name party votes')
      .sort({ votes: -1 }); // sort by most voted

    res.status(200).json({ election: election.title,  candidates });
  } catch (error) {
    console.error('Fetch Results Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getElectionResults };
