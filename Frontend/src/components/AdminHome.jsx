import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const AdminHome = () => {
  const [ongoingElections, setOngoingElections] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get("/api/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const ongoing = res.data
          .filter((e) => new Date(e.endDate) > now)
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 3);

        setOngoingElections(ongoing);
      } catch (err) {
        console.error("Failed to fetch elections:", err);
      }
    };

    fetchElections();
  }, [token]);

  const handleCardClick = () => {
    localStorage.setItem("adminActiveComponent", "manage");
    window.dispatchEvent(new Event("storage"));
  };

  const handleShortcut = (type) => {
    localStorage.setItem("adminActiveComponent", type);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🎯 Dashboard Overview</h2>
        <br /><br />
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">🟢 Ongoing Elections</h3><br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingElections.map((e) => (
            <div
              key={e._id}
              onClick={handleCardClick}
              className="bg-white shadow-md border border-indigo-100 rounded-xl p-4 hover:shadow-lg cursor-pointer transition duration-300"
            >
              <h4 className="text-lg font-semibold text-indigo-600">{e.title}</h4>
              <p className="text-sm text-gray-500">
                {new Date(e.startDate).toLocaleDateString()} → {new Date(e.endDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-gray-600">Click to manage ➜</p>
            </div>
          ))}
          {ongoingElections.length === 0 && (
            <p className="text-gray-500 col-span-3">No ongoing elections found.</p>
          )}
        </div>
      </div>
<br /><br />
      <div>
  <h3 className="text-xl font-semibold mb-4 text-gray-800">⚡ Quick Shortcuts</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Create Election Card */}
    <div
      onClick={() => handleShortcut("create")}
      className="cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300"
    >
      <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
        ➕ Create Election
      </h4>
      <p className="text-sm text-indigo-100">
        Start a new election by setting the title, duration, and candidates.
      </p>
    </div>

    {/* View Results Card */}
    <div
      onClick={() => handleShortcut("results")}
      className="cursor-pointer bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300"
    >
      <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
        📊 View Results
      </h4>
      <p className="text-sm text-green-100">
        Analyze the results of completed elections in real time.
      </p>
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminHome;
