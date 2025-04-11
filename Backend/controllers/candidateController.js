const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

const addCandidate = async (req, res) => {
  try {
    const { name, party, bio, photo, electionId } = req.body;

    // Check if the election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Create new candidate
    const candidate = new Candidate({
      name,
      party,
      bio,
      photo,
      election: electionId
    });

    await candidate.save();

    // Add candidate ID to election's candidate list if needed
    election.candidates.push(candidate._id);
    await election.save();

    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    console.error('Add Candidate Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addCandidate };
