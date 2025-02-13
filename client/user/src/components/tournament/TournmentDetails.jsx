import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../hooks/useAxiosInstance";
import { useNavigate } from "react-router-dom";
const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/user/tournaments/${tournamentId}`
        );
        setTournament(response.data);
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        setError("Failed to load tournament details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [tournamentId]);

  if (loading)
    return <p className="text-center">Loading tournament details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!tournament) return null;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {tournament.name}
      </h2>
      <img
        src={tournament.turf[0].image} // Assuming the first turf image is used
        alt={tournament.turf[0].name}
        className="w-full h-64 object-cover rounded-lg mb-4" // Style the image
      />
      <p className="text-gray-600 mb-4">{tournament.description}</p>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          Tournament Details
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Manager:</span>
            <span className="text-gray-600">
              {tournament.managerName} ({tournament.managerPhone})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">
              Registration Fee:
            </span>
            <span className="text-gray-600">
              {tournament.registrationFees === 0 ? (
                <span className="p-1 rounded bg-red-800 text-white">Free</span>
              ) : (
                `₹${tournament.registrationFees}`
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Sport:</span>
            <span className="text-gray-600">{tournament.sportsType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Date:</span>
            <span className="text-gray-600">
              {new Date(tournament.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Timings:</span>
            <span className="text-gray-600">{tournament.timings}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">
              Last Registration:
            </span>
            <span className="text-gray-600">
              {new Date(tournament.lastRegistrationDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Teams:</span>
            <span className="text-gray-600">
              {tournament.currentNumTeams}/{tournament.maxNumTeams}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">
              Players per Team:
            </span>
            <span className="text-gray-600">{tournament.maxPlayersInTeam}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          Prize Money
        </h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-700">1st Place:</span>
            <span className="text-gray-600">
              ₹{tournament.prizeMoney.first}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">2nd Place:</span>
            <span className="text-gray-600">
              ₹{tournament.prizeMoney.second}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">3rd Place:</span>
            <span className="text-gray-600">
              ₹{tournament.prizeMoney.third}
            </span>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={() => navigate(`/auth/tournaments/register/${tournamentId}`)}
      >
        Register
      </button>
    </div>
  );
};

export default TournamentDetails;
