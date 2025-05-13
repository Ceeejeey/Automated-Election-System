import React, { useState } from 'react';

// Import your admin components
import CreateElection from '../components/CreateElection';
// import ManageElections from './ManageElections';
import ApproveVoters from '../components/ApproveVoters';
// import ViewResults from './ViewResults';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('home');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'create':
       return <CreateElection />;
      // case 'manage':
      //   return <ManageElections />;
      case 'approve':
        return <ApproveVoters />;
      // case 'results':
      //   return <ViewResults />;
     
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel 👑</h1>
        <nav className="flex flex-col space-y-3">
          <button onClick={() => setActiveComponent('home')} className="hover:bg-indigo-600 p-2 rounded-lg text-left">Dashboard Home</button>
          <button onClick={() => setActiveComponent('create')} className="hover:bg-indigo-600 p-2 rounded-lg text-left">Create Election</button>
          <button onClick={() => setActiveComponent('manage')} className="hover:bg-indigo-600 p-2 rounded-lg text-left">Manage Elections</button>
          <button onClick={() => setActiveComponent('approve')} className="hover:bg-indigo-600 p-2 rounded-lg text-left">Approve Voters</button>
          <button onClick={() => setActiveComponent('results')} className="hover:bg-indigo-600 p-2 rounded-lg text-left">View Results</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin! 🎉</h2>
          <p className="text-gray-600 mt-2">Manage elections with power and elegance.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
