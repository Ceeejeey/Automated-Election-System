import React, { useState } from "react";
import axios from "../api/axios";

const CreateElection = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [electionId, setElectionId] = useState(null);
    const [candidates, setCandidates] = useState([{ name: "", party: "", bio: "", photo: null }]);
    const [step, setStep] = useState(1);

    const handleCandidateChange = (index, field, value) => {
        const newCandidates = [...candidates];
        newCandidates[index][field] = value;
        setCandidates(newCandidates);
    };

    const addCandidate = () => {
        setCandidates([...candidates, { name: "", party: "", bio: "", photo: null }]);
    };

    const handleCreateElection = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/api/create-election",
                { title, description, startDate, endDate },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newElectionId = response.data.election._id;
            setElectionId(newElectionId);
            setStep(2); // Move to Add Candidates step

            alert("Election created successfully! Now add candidates.");

        } catch (error) {
            console.error("Error creating election:", error.message);
            alert("Failed to create election");
        }
    };

    const handleAddCandidates = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            for (const candidate of candidates) {
                const { name, party, bio, photo } = candidate;
                // Convert photo to a string (e.g., base64) if it exists
                let photoString = "";
                if (photo) {
                    const reader = new FileReader();
                    reader.readAsDataURL(photo);
                    photoString = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result);
                    });
                }

                const candidateData = {
                    name,
                    party,
                    bio,
                    photo: photoString, // Since the backend expects photo as a regular field, not a file
                    electionId,
                };

                await axios.post("/api/create-candidate", candidateData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            alert("Candidates added successfully!");
            setCandidates([{ name: "", party: "", bio: "", photo: "" }]); // Reset candidates

        } catch (error) {
            console.error("Error adding candidates:", error.message);
            alert("Failed to add candidates");
        }
    };


    return (
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {step === 1 ? "Create Election" : "Add Candidates"}
            </h2>

            {/* Step 1: Create Election */}
            {step === 1 && (
                <form onSubmit={handleCreateElection} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-600 mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Election Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-600 mb-2">Description</label>
                            <textarea
                                placeholder="Brief Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Create Election
                    </button>
                </form>
            )}

            {/* Step 2: Add Candidates */}
            {step === 2 && (
                <div className="mt-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Candidates to Election</h3>

                    <form onSubmit={handleAddCandidates} className="space-y-6">
                        {candidates.map((candidate, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                                <h4 className="text-lg font-medium text-gray-800 mb-2">Candidate {index + 1}</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Candidate Name"
                                        value={candidate.name}
                                        onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />

                                    <input
                                        type="text"
                                        placeholder="Party"
                                        value={candidate.party}
                                        onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <textarea
                                    placeholder="Bio"
                                    value={candidate.bio}
                                    onChange={(e) => handleCandidateChange(index, "bio", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                                ></textarea>

                                <input
                                    type="file"
                                    onChange={(e) => handleCandidateChange(index, "photo", e.target.files[0])}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        ))}

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={addCandidate}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                            >
                                Add Another Candidate
                            </button>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                            >
                                Submit Candidates
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateElection;
