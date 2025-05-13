import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const ViewLiveResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/live-results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching live results:", error.message);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Live Election Results 📊</h2>
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((election) => (
            <div key={election._id} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">{election.title}</h3>
              {election.candidates.map((candidate) => (
                <div key={candidate._id} className="flex justify-between mb-2">
                  <span>{candidate.name}</span>
                  <span>{candidate.voteCount} votes</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No results available yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewLiveResults;
