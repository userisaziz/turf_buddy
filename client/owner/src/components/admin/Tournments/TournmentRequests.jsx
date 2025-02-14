import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../hooks/useAxiosInstance";

const TournamentRequests = () => {
  const { tournamentId } = useParams(); // Get tournamentId from URL parameters
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/admin/tournaments/${tournamentId}` // Fetch tournament details
        );
        setPendingRequests(response.data.pendingRegistrations);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, [tournamentId]); // Add tournamentId as a dependency

  const handleApprove = async (teamId) => {
    try {
      await axiosInstance.post(
        `/api/admin/tournaments/${tournamentId}/approve/${teamId}`
      );
      setPendingRequests((prev) => prev.filter((req) => req.teamId !== teamId));
      alert("Registration approved successfully!");
    } catch (error) {
      alert("Error approving registration: " + error.response.data.message);
    }
  };

  const handleReject = async (teamId) => {
    try {
      await axiosInstance.post(
        `/api/admin/tournaments/${tournamentId}/reject/${teamId}`
      );
      setPendingRequests((prev) => prev.filter((req) => req.teamId !== teamId));
      alert("Registration rejected successfully!");
    } catch (error) {
      alert("Error rejecting registration: " + error.response.data.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Pending Tournament Registration Requests
      </h2>
      <div className="space-y-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div
              key={request.teamId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">
                    Team Name: {request.teamName}
                  </p>
                  <p className="text-gray-600">
                    Requested By: {request.requestedBy.name}
                  </p>
                  <p className="text-gray-600">
                    Phone: {request.requestedBy.phone}
                  </p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => handleApprove(request.teamId)}
                    className="btn btn-primary px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.teamId)}
                    className="btn btn-danger px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">
            No pending requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TournamentRequests;
