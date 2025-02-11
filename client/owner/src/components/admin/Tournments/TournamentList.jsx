import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../../hooks/useAxiosInstance";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/tournaments/all");
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = async (tournamentId) => {
    try {
      await axios.post(`/api/tournaments/register/${tournamentId}`, { teamId });
      alert("Successfully registered for the tournament!");
      setTeamId(""); // Clear the input after registration
    } catch (error) {
      alert(
        "Error registering for the tournament: " + error.response.data.message
      );
    }
  };

  const handleDisable = async (tournamentId) => {
    try {
      await axiosInstance.patch(
        `/api/admin/tournaments/disable/${tournamentId}`
      );
      setTournaments((prev) =>
        prev.map((tournament) =>
          tournament._id === tournamentId
            ? { ...tournament, status: "disabled" }
            : tournament
        )
      );
      alert("Tournament disabled successfully!");
    } catch (error) {
      alert("Error disabling tournament: " + error.response.data.message);
    }
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await axiosInstance.delete(`/api/admin/tournaments/${tournamentId}`);
        setTournaments((prev) =>
          prev.filter((tournament) => tournament._id !== tournamentId)
        );
        alert("Tournament deleted successfully!");
      } catch (error) {
        alert("Error deleting tournament: " + error.response.data.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Tournament List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="card bg-base-100 shadow-xl transition-transform transform hover:scale-105"
          >
            <div className="card-body">
              <h3 className="card-title text-xl font-semibold">
                {tournament.name}
              </h3>
              <p className="text-gray-600">{tournament.description}</p>
              <p className="text-gray-500">Status: {tournament.status}</p>
              <input
                type="text"
                placeholder="Enter your Team ID"
                className="input input-bordered w-full mt-2"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              />
              <button
                className="btn btn-primary mt-4"
                onClick={() => handleRegister(tournament._id)}
              >
                Register
              </button>
              <div className="mt-4 flex justify-between">
                <button
                  className="btn btn-warning"
                  onClick={() => handleDisable(tournament._id)}
                >
                  Disable
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(tournament._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
