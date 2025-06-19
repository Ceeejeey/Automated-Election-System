import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const CastVote = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const getCurrentSriLankanDate = () => {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        const dateParts = formatter.format(new Date()).split("-");
        return new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T00:00:00+05:30`);
    };

    const convertToSriLankanDate = (utcString) => {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        const dateParts = formatter.format(new Date(utcString)).split("-");
        return new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T00:00:00+05:30`);
    };

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/elections", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const now = getCurrentSriLankanDate();
                console.log("📍 Current Sri Lankan Date:", now.toISOString());

                const ongoing = res.data.filter((election) => {
                    const start = convertToSriLankanDate(election.startDate);
                    const end = convertToSriLankanDate(election.endDate);

                    console.log(`🗳️ ${election.title} | Start: ${start.toISOString()} | End: ${end.toISOString()}`);

                    return now >= start && now <= end;
                });

                console.log("✅ Ongoing elections found:", ongoing.length);
                setElections(ongoing);
            } catch (error) {
                console.error("❌ Failed to fetch elections:", error.message);
            }
        };

        fetchElections();
    }, []);


    const handleElectionSelect = async (electionId) => {
        setSelectedElection(electionId);
        setSelectedCandidate("");
        setHasVoted(false);
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;
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

    const handleVote = async (eventData) => {
        eventData.preventDefault();

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
            setHasVoted(true);
        } catch (error) {
            console.error("Error casting vote:", error.message);
            alert("Failed to cast vote");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-w-full bg-white shadow-md rounded-lg p-8">
                
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Cast Your Vote 🗳️
                    </h2>
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Select an Election</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {elections.length > 0 ? (
                                elections.map((election) => (
                                    <div
                                        key={election._id}
                                        onClick={() => handleElectionSelect(election._id)}
                                        className={`p-6 rounded-xl cursor-pointer transform transition-all duration-300 ${selectedElection === election._id
                                                ? "bg-indigo-600 text-white shadow-lg scale-105"
                                                : "bg-gray-50 hover:bg-indigo-50 hover:shadow-md"
                                            }`}
                                    >
                                        <h4 className="text-xl font-semibold">{election.title}</h4>
                                        <p className={`text-sm ${selectedElection === election._id ? "text-indigo-100" : "text-gray-500"}`}>
                                            {election.description || "Participate in this election"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-2 text-center">No ongoing elections available.</p>
                            )}
                        </div>
                    </div>
                    {selectedElection && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Candidate</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {candidates.length > 0 ? (
                                    candidates.map((candidate) => (
                                        <div
                                            key={candidate._id}
                                            onClick={() => setSelectedCandidate(candidate._id)}
                                            className={`p-6 rounded-xl cursor-pointer transform transition-all duration-300 ${selectedCandidate === candidate._id
                                                    ? "bg-blue-100 border-2 border-blue-500 shadow-lg scale-105"
                                                    : "bg-gray-50 hover:bg-blue-50 hover:shadow-md border border-gray-200"
                                                }`}
                                        >
                                            <h4 className="text-xl font-semibold text-gray-900">{candidate.name}</h4>
                                            <p className="text-sm text-gray-500">{candidate.party}</p>
                                            <div
                                                className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${selectedCandidate === candidate._id
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {selectedCandidate === candidate._id ? "Selected" : "Select"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 col-span-2 text-center">No candidates available for this election.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedElection && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleVote}
                                className={`py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 ${hasVoted
                                        ? "bg-green-500 text-white cursor-not-allowed shadow-md"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
                                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isLoading || hasVoted}
                            >
                                {isLoading ? "Submitting..." : hasVoted ? "Already Voted ✅" : "Cast Vote"}
                            </button>
                        </div>
                    )}
                </div>
            
        
    );
};

export default CastVote;