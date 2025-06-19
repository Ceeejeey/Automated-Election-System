import React, { useEffect, useState } from "react";
import axios from "../api/axios";

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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const VoterDashboardHome = () => {
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get("/api/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = getCurrentSriLankanDate();
        console.log("📍 SL Today:", now.toISOString());

        const ongoing = res.data.filter((e) => {
          const start = convertToSriLankanDate(e.startDate);
          const end = convertToSriLankanDate(e.endDate);

          console.log(`🗳️ ${e.title} | Start: ${start.toISOString()} | End: ${end.toISOString()}`);
          return now >= start && now <= end;
        });

        console.log("✅ Ongoing elections found:", ongoing.length);
        setElections(ongoing);
      } catch (err) {
        console.error("❌ Failed to fetch elections:", err.message);
        setError("Failed to load elections. Please try again.");
      }
    };

    fetchElections();
  }, [token]);

  const viewDetails = async (election) => {
    try {
      setSelected(election);
      setLoadingCandidates(true);
      setError(null);
      const res = await axios.get(`/api/elections/${election._id}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming API returns { candidates: [...] }
      const candidatesData = res.data.candidates || [];
      if (!Array.isArray(candidatesData)) {
        throw new Error("Candidates data is not an array");
      }
      setCandidates(candidatesData);
    } catch (err) {
      console.error("Failed to fetch candidates:", err.message);
      setError("Failed to load candidates. Please try again.");
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleVoteNow = (electionId) => {
    localStorage.setItem("voterActiveComponent", "cast");
    localStorage.setItem("selectedElectionId", electionId);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-w-full bg-white shadow-md rounded-lg p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">🗳️ Welcome to Your Dashboard</h1>
        <p className="text-gray-600">Participate in elections and make your vote count.</p>

        {error && (
          <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">No ongoing elections right now.</p>
          ) : (
            elections.map((e) => (
              <div
                key={e._id}
                className="bg-white border border-indigo-200 rounded-xl p-5 shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-indigo-800">{e.title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {formatDate(e.startDate)} → {formatDate(e.endDate)}
                </p>
                <p className="mt-2 text-sm text-gray-500">{e.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
                    onClick={() => viewDetails(e)}
                  >
                    👁️ View Candidates
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
                    onClick={() => handleVoteNow(e._id)}
                  >
                    🗳️ Vote Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-indigo-700">
                  Candidates for {selected.title}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✖️
                </button>
              </div>

              {loadingCandidates ? (
                <p className="text-center text-gray-500">Loading candidates...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : candidates.length === 0 ? (
                <p className="text-center text-gray-500">No candidates available.</p>
              ) : (
                <ul className="space-y-4">
                  {candidates.map((c) => (
                    <li
                      key={c._id}
                      className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <h3 className="text-lg font-medium text-gray-800">{c.name}</h3>
                      <p className="text-sm text-gray-500">{c.party}</p>
                      {c.description && (
                        <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboardHome;