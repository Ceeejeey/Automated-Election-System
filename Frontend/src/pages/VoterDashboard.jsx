import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import your voter components
import CastVote from "../components/CastVote";
import ViewLiveResults from "../components/ViewLiveResults";
import VoterHome from "../components/VoterHome";

const VoterDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(() => {
    return localStorage.getItem("voterActiveComponent") || "home";
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("voterActiveComponent", activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("voterActiveComponent");
      if (stored && stored !== activeComponent) {
        setActiveComponent(stored);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [activeComponent]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "cast":
        return <CastVote />;
      case "results":
        return <ViewLiveResults />;
      case "home":
        return <VoterHome />;
      default:
        return (
          <div className="text-gray-600 text-lg">
            Welcome, Voter! 🗳️ Participate in elections and view live results here.
          </div>
        );
    }
  };

  const handleComponentSwitch = (component) => {
    setActiveComponent(component);
    localStorage.setItem("voterActiveComponent", component);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 space-y-4 fixed h-screen justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Voter Panel 🌐</h1>
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => handleComponentSwitch("home")}
              className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
                activeComponent === "home" ? "bg-blue-600" : ""
              }`}
            >
              Dashboard Home
            </button>
            <button
              onClick={() => handleComponentSwitch("cast")}
              className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
                activeComponent === "cast" ? "bg-blue-600" : ""
              }`}
            >
              Cast Vote
            </button>
            <button
              onClick={() => handleComponentSwitch("results")}
              className={`hover:bg-blue-600 p-2 rounded-lg text-left ${
                activeComponent === "results" ? "bg-blue-600" : ""
              }`}
            >
              Live Results
            </button>
          </nav>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-left font-semibold"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-hidden">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, Voter! 🌟</h2>
          <p className="text-gray-600 mt-2">
            Cast your vote and stay updated with live election results.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
          {renderComponent()}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;
