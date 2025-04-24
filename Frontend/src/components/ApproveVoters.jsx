import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ApproveVoters = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVoters = async () => {
    try {
      const res = await axios.get('/api/admin/pending-voters');
      setVoters(res.data.voters);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching voters:', error);
      setLoading(false);
    }
  };

  const handleApproval = async (voterId, action) => {
    try {
      await axios.put(`/api/admin/voters/${voterId}/${action}`);
      alert(`Voter ${action}ed successfully!`);
      fetchVoters(); // Refresh list
    } catch (error) {
      console.error(`Error ${action}ing voter:`, error);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Approve or Reject Voters 🧾</h2>
      {loading ? (
        <p>Loading voters...</p>
      ) : voters.length === 0 ? (
        <p className="text-gray-600">No pending voter requests 💨</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map(voter => (
              <tr key={voter._id} className="border-b">
                <td className="py-2 px-4">{voter.name}</td>
                <td className="py-2 px-4">{voter.email}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleApproval(voter._id, 'approve')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(voter._id, 'reject')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveVoters;
