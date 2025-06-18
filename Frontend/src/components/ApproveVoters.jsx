import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const ApproveVoters = () => {
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVoters = async () => {
    try {
      const res = await axios.get('/api/admin/pending-voters');
      setVoters(res.data.voters);
      setFilteredVoters(res.data.voters);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching voters:', error);
      toast.error("Failed to load voters");
      setLoading(false);
    }
  };

  const handleApproval = async (voterId, action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action} this voter?`);
    if (!confirmed) return;

    try {
      await axios.put(`/api/admin/voters/${voterId}/${action}`);
      toast.success(`Voter ${action}ed successfully!`);
      fetchVoters(); // Refresh list
    } catch (error) {
      console.error(`Error ${action}ing voter:`, error);
      toast.error(`Failed to ${action} voter`);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  useEffect(() => {
    const filtered = voters.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black-700">🧾 Approve or Reject Voters</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading voters...</p>
      ) : filteredVoters.length === 0 ? (
        <p className="text-gray-500">No pending voter requests 💨</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Email</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.map(voter => (
                <tr key={voter._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-5 font-medium">{voter.name}</td>
                  <td className="py-3 px-5">{voter.email}</td>
                  <td className="py-3 px-5 space-x-2">
                    <button
                      onClick={() => handleApproval(voter._id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleApproval(voter._id, 'reject')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApproveVoters;
