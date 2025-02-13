import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../hooks/useAxiosInstance";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [teamId, setTeamId] = useState("");
  const navigate = useNavigate();

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
      await axiosInstance.post(`/api/tournaments/register/${tournamentId}`, {
        teamId,
      });
      alert("Successfully registered for the tournament!");
      setTeamId("");
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

  const handleViewRequests = (tournamentId) => {
    navigate(`/admin/tournaments/${tournamentId}/requests`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Tournament List
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {tournament.name}
              </h3>
              <p className="text-gray-600 mb-4">{tournament.description}</p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Manager:</span>{" "}
                  {tournament.managerName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(tournament.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Timings:</span>{" "}
                  {tournament.timings}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tournament.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tournament.status}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Teams:</span>{" "}
                  {tournament.currentNumTeams}/{tournament.maxNumTeams}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Prize Money:</span>{" "}
                  {`1st: $${tournament.prizeMoney.first}, 2nd: $${tournament.prizeMoney.second}, 3rd: $${tournament.prizeMoney.third}`}
                </p>
              </div>
              <input
                type="text"
                placeholder="Enter your Team ID"
                className="input input-bordered w-full mt-4"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              />
              <button
                className="btn btn-primary w-full mt-4"
                onClick={() => handleRegister(tournament._id)}
              >
                Register
              </button>
              <button
                className="btn btn-info w-full mt-4"
                onClick={() => handleViewRequests(tournament._id)}
              >
                View Pending Requests
              </button>
              <div className="mt-4 flex justify-between">
                <button
                  className="btn btn-warning flex-1 mr-2"
                  onClick={() => handleDisable(tournament._id)}
                >
                  Disable
                </button>
                <button
                  className="btn btn-danger flex-1 ml-2"
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
