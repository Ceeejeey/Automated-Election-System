const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// Vote Casting Logic
const castVote = async (req, res) => {
  try {
    const { userId, candidateId, electionId } = req.body;

    // Check if the election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    // Check if the election is still ongoing
    const currentDate = new Date();
    if (currentDate < election.startDate || currentDate > election.endDate) {
      return res.status(400).json({ message: 'Election is not active' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already voted in this election
    const alreadyVoted = user.votedElections.some(
      (vote) => vote.election.toString() === electionId.toString()
    );
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Find the candidate the user voted for
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Increment the candidate's vote count
    candidate.votes += 1;
    await candidate.save();

    // Add this election to the user's votedElections list
    user.votedElections.push({ election: electionId, votedAt: new Date() });
    await user.save();

    res.status(200).json({ message: 'Vote casted successfully', candidate, user });
  } catch (error) {
    console.error('Vote casting error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { castVote };
