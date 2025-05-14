import React, { useState } from "react";

// Import your voter components
import CastVote from "../components/CastVote";
import ViewLiveResults from "../components/ViewLiveResults";

const VoterDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home");

  const renderComponent = () => {
    switch (activeComponent) {
      case "cast":
        return <CastVote />;
      case "results":
        return <ViewLiveResults />;
      default:
        return (
          <div className="text-gray-600 text-lg">
            Welcome, Voter! 🗳️ Participate in elections and view live results here.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-6 space-y-4 fixed h-screen">
        <h1 className="text-2xl font-bold mb-6">Voter Panel 🌐</h1>
        <nav className="flex flex-col space-y-3">
          <button
            onClick={() => setActiveComponent("home")}
            className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
              activeComponent === "home" ? "bg-blue-600" : ""
            }`}
          >
            Dashboard Home
          </button>
          <button
            onClick={() => setActiveComponent("cast")}
            className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
              activeComponent === "cast" ? "bg-blue-600" : ""
            }`}
          >
            Cast Vote
          </button>
          <button
            onClick={() => setActiveComponent("results")}
            className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
              activeComponent === "results" ? "bg-blue-600" : ""
            }`}
          >
            Live Results
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-6 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, Voter! 🌟</h2>
          <p className="text-gray-600 mt-2">Cast your vote and stay updated with live election results.</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default VoterDashboard;
