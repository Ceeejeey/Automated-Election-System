import React, { useState } from "react";

// Import your admin components
import CreateElection from "../components/CreateElection";
// import ManageElections from './ManageElections';
import ApproveVoters from "../components/ApproveVoters";
// import ViewResults from './ViewResults';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home");

  const renderComponent = () => {
    switch (activeComponent) {
      case "create":
        return <CreateElection />;
      // case "manage":
      //   return <ManageElections />;
      case "approve":
        return <ApproveVoters />;
      // case "results":
      //   return <ViewResults />;
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
          <button
            onClick={() => setActiveComponent("home")}
            className="hover:bg-indigo-600 p-2 rounded-lg text-left"
          >
            Dashboard Home
          </button>
          <button
            onClick={() => setActiveComponent("create")}
            className="hover:bg-indigo-600 p-2 rounded-lg text-left"
          >
            Create Election
          </button>
          <button
            onClick={() => setActiveComponent("manage")}
            className="hover:bg-indigo-600 p-2 rounded-lg text-left"
          >
            Manage Elections
          </button>
          <button
            onClick={() => setActiveComponent("approve")}
            className="hover:bg-indigo-600 p-2 rounded-lg text-left"
          >
            Approve Voters
          </button>
          <button
            onClick={() => setActiveComponent("results")}
            className="hover:bg-indigo-600 p-2 rounded-lg text-left"
          >
            View Results
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-6 overflow-hidden">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin! 🎉</h2>
          <p className="text-gray-600 mt-2">Manage elections with power and elegance.</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
