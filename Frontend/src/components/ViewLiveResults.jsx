import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ElectionResults = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setResults([]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/results/${electionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(response.data.candidates);
    } catch (error) {
      console.error("Error fetching election results:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    const labels = results.map((candidate) => candidate.name);
    const votes = results.map((candidate) => candidate.votes);

    return {
      labels,
      datasets: [
        {
          label: "Votes",
          data: votes,
          backgroundColor: "#3b82f6", // Blue
          borderColor: "#2563eb", // Darker Blue
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#3b82f6",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#374151", // Gray
        },
      },
      x: {
        ticks: {
          color: "#374151", // Gray
        },
      },
    },
  };

  return (
    <div className="min-w-full bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Live Election Results 📊</h2>

      {/* Election Selection */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2">Select Election</label>
        <select
          value={selectedElection}
          onChange={(e) => handleElectionSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>-- Select Election --</option>
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

      {/* Results Display */}
      {isLoading ? (
        <div className="text-center text-blue-500 font-semibold">Loading results...</div>
      ) : selectedElection && results.length > 0 ? (
        <>
          <div className="bg-gray-100 p-4 rounded-lg space-y-3 mb-6">
            {results.map((candidate) => (
              <div
                key={candidate._id}
                className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                  <p className="text-gray-500">{candidate.party}</p>
                </div>
                <div className="bg-blue-500 text-white py-1 px-3 rounded-lg text-sm font-semibold">
                  {candidate.votes} Votes
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Vote Distribution Chart</h3>
            <Bar data={getChartData()} options={chartOptions} />
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center">
          {selectedElection ? "No candidates or votes yet." : "Select an election to view results."}
        </div>
      )}
    </div>
  );
};

export default ElectionResults;
