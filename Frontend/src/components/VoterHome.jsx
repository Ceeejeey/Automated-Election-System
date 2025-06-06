import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const VoterDashboardHome = () => {
  const [elections, setElections] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get("/api/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const ongoing = res.data.filter(
          (e) => new Date(e.startDate) <= now && new Date(e.endDate) > now
        );

        setElections(ongoing);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      }
    };

    fetchElections();
  }, [token]);

  const handleVoteNow = (electionId) => {
    localStorage.setItem("voterActiveComponent", "cast");
    localStorage.setItem("selectedElectionId", electionId); // optional if needed
    window.dispatchEvent(new Event("storage")); // trigger update across tabs
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">🗳️ Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Check out the elections you can participate in!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.length === 0 ? (
          <p className="text-gray-500">No ongoing elections at the moment.</p>
        ) : (
          elections.map((election) => (
            <div
              key={election._id}
              className="bg-white border border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-indigo-800">{election.title}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(election.startDate).toLocaleDateString()} -{" "}
                {new Date(election.endDate).toLocaleDateString()}
              </p>
              <p className="mt-3 text-gray-500 text-sm">
                Participate and make your voice count. 🗳️
              </p>
              <button
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={() => handleVoteNow(election._id)}
              >
                Vote Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoterDashboardHome;
