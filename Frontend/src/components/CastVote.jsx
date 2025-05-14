import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const CastVote = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/elections", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setElections(response.data);
            } catch (error) {
                console.error("Error fetching elections:", error.message);
            }
        };

        fetchElections();
    }, []);

    const handleElectionSelect = async (electionId) => {
        setSelectedElection(electionId);
        setSelectedCandidate(""); // Reset candidate selection when election changes
        setHasVoted(false); // Reset voting status

        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            // Check if the user has already voted in the selected election
            const voteCheckResponse = await axios.post(
                "/api/vote/check",
                { userId, electionId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setHasVoted(voteCheckResponse.data.hasVoted);

            // Fetch candidates
            const response = await axios.get(`/api/elections/${electionId}/candidates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCandidates(response.data.candidates);
        } catch (error) {
            console.error("Error fetching candidates or vote status:", error.message);
        }
    };

    const handleVote = async (e) => {
        e.preventDefault();

        if (!selectedElection || !selectedCandidate) {
            alert("Please select both an election and a candidate.");
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            const voteData = {
                userId,
                candidateId: selectedCandidate,
                electionId: selectedElection,
            };

            await axios.post("/api/vote/castVote", voteData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Vote successfully cast! ✅");
            setSelectedElection("");
            setSelectedCandidate("");
            setCandidates([]);
            setHasVoted(true); // Update the voting status
        } catch (error) {
            console.error("Error casting vote:", error.message);
            alert("Failed to cast vote.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-w-full bg-white shadow-md rounded-lg p-8">
            
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-wide">
                    Cast Your Vote 🗳️
                </h2>

                <form onSubmit={handleVote} className="space-y-6">
                    {/* Election Selection */}
                    <div className="space-y-2">
                        <label className="block text-gray-600 font-medium">Select Election</label>
                        <select
                            value={selectedElection}
                            onChange={(e) => handleElectionSelect(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        >
                            <option value="" disabled>
                                -- Select Election --
                            </option>
                            {elections.length > 0 ? (
                                elections.map((election) => (
                                    <option key={election._id} value={election._id}>
                                        {election.title}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Elections Available</option>
                            )}
                        </select>
                    </div>

                    {/* Candidate Selection */}
                    {selectedElection && (
                        <div className="space-y-2 mt-4">
                            <label className="block text-gray-600 font-medium">Select Candidate</label>
                            <div className="space-y-3">
                                {candidates.length > 0 ? (
                                    candidates.map((candidate) => (
                                        <div
                                            key={candidate._id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${selectedCandidate === candidate._id
                                                    ? "bg-blue-100 border-blue-400"
                                                    : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                                                }`}
                                            onClick={() => setSelectedCandidate(candidate._id)}
                                        >
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">{candidate.name}</h3>
                                                <p className="text-gray-500 text-sm">{candidate.party}</p>
                                            </div>
                                            <div
                                                className={`px-3 py-1 rounded-lg text-sm font-semibold ${selectedCandidate === candidate._id
                                                        ? "bg-blue-400 text-white"
                                                        : "bg-gray-300 text-gray-600"
                                                    }`}
                                            >
                                                {selectedCandidate === candidate._id ? "Selected" : "Select"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No candidates available for this election.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {selectedElection && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className={`py-2 px-8 rounded-lg transition-shadow shadow-lg focus:outline-none focus:ring-2 ${hasVoted
                                        ? "bg-green-500 text-white block w-full cursor-not-allowed focus:ring-green-400"
                                        : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400"
                                    }`}
                                disabled={isLoading || hasVoted}
                            >
                                {isLoading ? "Submitting..." : hasVoted ? "Already Voted ✅" : "Cast Vote"}
                            </button>
                        </div>
                    )}

                </form>
            
        </div>
    );
};

export default CastVote;
