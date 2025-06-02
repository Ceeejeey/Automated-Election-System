import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { FaTrash, FaEdit, FaPlus, FaEye } from "react-icons/fa";
import { format } from "date-fns";


const ManageElection = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });



  const fetchElections = async () => {
    try {
      const res = await axios.get("/api/elections"); // Adjust to your actual route
      console.log("API Response:", res.data);
      setElections(res.data);
    } catch (err) {
      console.error("Failed to fetch elections", err);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (selectedElection) {
        await axios.put(`/api/update/${selectedElection._id}`, form, config);
      } else {
        await axios.post("/api/elections", form, config);
      }

      fetchElections();
      setForm({ title: "", description: "", startDate: "", endDate: "" });
      setSelectedElection(null);
      setShowModal(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`/api/delete/${id}`, config);
        fetchElections();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };


  const openEditModal = (election) => {
    setSelectedElection(election);
    setForm({
      title: election.title,
      description: election.description,
      startDate: election.startDate.slice(0, 10),
      endDate: election.endDate.slice(0, 10),
    });
    setShowModal(true);
  };

  const openCreateComponent = () => {
    localStorage.setItem("adminActiveComponent", "create");
    window.dispatchEvent(new Event("storage")); // Trigger storage event manually
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Elections 🗳️</h2>
        <button
          onClick={openCreateComponent}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> New Election
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => (
          <div
            key={election._id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{election.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{election.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Start:</strong> {format(new Date(election.startDate), "PPP")}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>End:</strong> {format(new Date(election.endDate), "PPP")}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                onClick={() => openEditModal(election)}
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                onClick={() => handleDelete(election._id)}
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-brightness-60 bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">
              {selectedElection ? "Edit Election" : "Create Election"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Election Title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {selectedElection ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageElection;
