const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// Function to get current time in Sri Lankan timezone
const getCurrentSriLankanTime = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return formatter.format(new Date());
};


// Vote Casting Logic
const castVote = async (req, res) => {
  try {
    const { userId, candidateId, electionId } = req.body;

    // Check if the election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Get current Sri Lankan time
    const currentDate = getCurrentSriLankanTime();
    console.log('Current Sri Lankan Date:', currentDate);
    console.log('Election Start Date:', election.startDate);
    console.log('Election End Date:', election.endDate);

    if (currentDate < election.startDate || currentDate > election.endDate) {
      return res.status(400).json({ message: "Election is not active" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already voted in this election
    const alreadyVoted = user.votedElections.some(
      (vote) => vote.election.toString() === electionId.toString()
    );
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    // Find the candidate the user voted for
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Increment the candidate's vote count
    candidate.votes += 1;
    await candidate.save();

    // Add this election to the user's votedElections list
    user.votedElections.push({ election: electionId, votedAt: currentDate });
    await user.save();

    res.status(200).json({ message: "Vote casted successfully", candidate, user });
  } catch (error) {
    console.error("Vote casting error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Check Vote Logic
const checkVote = async (req, res) => {
  try {
    const { userId, electionId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasVoted = user.votedElections.some(
      (vote) => vote.election.toString() === electionId
    );

    res.json({ hasVoted });
  } catch (error) {
    console.error("Check Vote Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Exporting the functions
module.exports = { castVote, checkVote };
