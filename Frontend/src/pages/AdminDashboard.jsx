import React, { useEffect, useState } from "react";

// Admin components
import CreateElection from "../components/CreateElection";
import ManageElections from '../components/ManageElections';
import ApproveVoters from "../components/ApproveVoters";
import ViewResultAdmin from "../components/ViewResultAdmin";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(() => {
    // Load from localStorage or default to "home"
    return localStorage.getItem("adminActiveComponent") || "home";
  });

  // Sync localStorage when activeComponent changes
  useEffect(() => {
    localStorage.setItem("adminActiveComponent", activeComponent);
  }, [activeComponent]);

  // This allows child components to listen to changes via localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("adminActiveComponent");
      if (stored && stored !== activeComponent) {
        setActiveComponent(stored);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "create":
        return <CreateElection />;
      case "manage":
        return <ManageElections />;
      case "approve":
        return <ApproveVoters />;
      case "results":
        return <ViewResultAdmin />;
      default:
        return (
          <div className="text-gray-600 text-lg">
            Select a section from the sidebar to get started. 📦
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 space-y-4 fixed h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Panel 👑</h1>
        <nav className="flex flex-col space-y-3">
          <button onClick={() => setActiveComponent("home")} className="hover:bg-indigo-600 p-2 rounded-lg text-left">
            Dashboard Home
          </button>
          <button onClick={() => setActiveComponent("create")} className="hover:bg-indigo-600 p-2 rounded-lg text-left">
            Create Election
          </button>
          <button onClick={() => setActiveComponent("manage")} className="hover:bg-indigo-600 p-2 rounded-lg text-left">
            Manage Elections
          </button>
          <button onClick={() => setActiveComponent("approve")} className="hover:bg-indigo-600 p-2 rounded-lg text-left">
            Approve Voters
          </button>
          <button onClick={() => setActiveComponent("results")} className="hover:bg-indigo-600 p-2 rounded-lg text-left">
            View Results
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-hidden">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin! 🎉</h2>
          <p className="text-gray-600 mt-2">Manage elections with power and elegance.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
