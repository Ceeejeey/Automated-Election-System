import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { generateDocx } from "../utils/generateDocx";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewResultAdmin = () => {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null); // will hold {title, startDate, endDate, candidates}
    const [viewType, setViewType] = useState("graph");
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef(null);
    const canvasRef = useRef(null);


    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const res = await axios.get("/api/elections", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setElections(res.data);
            } catch (err) {
                console.error("Error fetching elections", err);
            }
        };
        fetchElections();
    }, [token]);

    const getStatus = (election) => {
        const now = new Date();
        return new Date(election.endDate) < now ? "past" : "ongoing";
    };

    const handleElectionSelect = async (election) => {
        setSelectedElection(null);
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/results/${election._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSelectedElection({
                title: election.title,
                startDate: election.startDate,
                endDate: election.endDate,
                candidates: response.data.candidates,
            });
        } catch (error) {
            console.error("Error fetching election results:", error.message);
        } finally {
            setIsLoading(false);
        }
    };



    const renderResults = () => {
        if (!selectedElection || !selectedElection.candidates) return null;

        const data = {
            labels: selectedElection.candidates.map((c) => c.name),
            datasets: [
                {
                    label: "Votes",
                    data: selectedElection.candidates.map((c) => c.votes || 0),
                    backgroundColor: "#6366f1",
                    borderRadius: 6,
                },
            ],
        };

        return viewType === "graph" ? (
            <div ref={canvasRef}>
                <Bar data={data} />
            </div>

        ) : (
            <div className="overflow-x-auto">
                <table className="w-full mt-4 text-left border rounded-lg shadow-md">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-2">Candidate</th>
                            <th className="px-4 py-2">Votes</th>
                            <th className="px-4 py-2">Party</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedElection.candidates.map((c) => (
                            <tr key={c._id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">{c.votes || 0}</td>
                                <td className="px-4 py-2">{c.party || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-indigo-700">📊 View Election Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
                <div>
                    <h2 className="text-xl font-semibold mb-2">🟢 Ongoing Elections</h2>
                    <div className="space-y-2">
                        {elections
                            .filter((e) => getStatus(e) === "ongoing")
                            .map((e) => (
                                <button
                                    key={e._id}
                                    onClick={() => handleElectionSelect(e)}
                                    className={`block w-full text-left p-3 rounded-lg border ${selectedElection?.title === e.title
                                        ? "bg-indigo-100 border-indigo-500"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <p className="font-medium">{e.title}</p>
                                    <p className="text-sm text-gray-500">{new Date(e.startDate).toLocaleDateString()}</p>
                                </button>
                            ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2 print:hidden">🕘 Past Elections</h2>
                    <div className="space-y-2">
                        {elections
                            .filter((e) => getStatus(e) === "past")
                            .map((e) => (
                                <button
                                    key={e._id}
                                    onClick={() => handleElectionSelect(e)}
                                    className={`block w-full text-left p-3 rounded-lg border ${selectedElection?.title === e.title
                                        ? "bg-indigo-100 border-indigo-500"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <p className="font-medium">{e.title}</p>
                                    <p className="text-sm text-gray-500">{new Date(e.endDate).toLocaleDateString()}</p>
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            {isLoading && <p className="text-center text-gray-600 mt-6">Loading results...</p>}

            {selectedElection && !isLoading && (
                <div
                    ref={printRef}
                    className="bg-white shadow-md p-6 rounded-lg mt-6 border print:block print:p-0 print:shadow-none print:border-none"
                >
                    <div className="flex items-center justify-between mb-4 print:justify-start print:flex-col print:items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-indigo-600 ">{selectedElection.title}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(selectedElection.startDate).toLocaleDateString()} -{" "}
                                {new Date(selectedElection.endDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Hide buttons during print */}
                        <div className="space-x-2 print:hidden ">
                            <button
                                onClick={() => setViewType(viewType === "graph" ? "table" : "graph")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md "
                            >
                                Switch to {viewType === "graph" ? "Table" : "Graph"} View
                            </button>
                            <button
                                onClick={() => generateDocx(selectedElection, viewType, canvasRef)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                            >
                                📄 Download DOCX
                            </button>
                        </div>
                    </div>

                    {renderResults()}
                </div>
            )}



        </div>
    );
};

export default ViewResultAdmin;
