import React, { useEffect, useState } from "react";
import axiosInstance from "../hooks/useAxiosInstance";
import { useNavigate } from "react-router-dom";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axiosInstance.get("/api/user/tournaments/all");
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setError("Failed to load tournaments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = (tournamentId) => {
    navigate(`/auth/tournaments/register/${tournamentId}`);
  };

  const isRegistrationAllowed = (tournament) => {
    const currentDate = new Date();
    const lastRegistrationDate = new Date(tournament.lastRegistrationDate);
    return (
      tournament.currentNumTeams < tournament.maxNumTeams &&
      currentDate <= lastRegistrationDate
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Available Tournaments
      </h2>

      {loading && <p className="text-center">Loading tournaments...</p>}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {tournaments.length === 0 && !loading && (
        <p className="text-center">No tournaments available at the moment.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments?.map((tournament) => (
          <div
            key={tournament._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              {/* Tournament Name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {tournament.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">{tournament.description}</p>

              {/* Tournament Details */}
              <div className="space-y-3">
                {/* Manager Details */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">Manager:</span>
                  <span className="text-gray-600">
                    {tournament.managerName} ({tournament.managerPhone})
                  </span>
                </div>

                {/* Sports Type */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">Sport:</span>
                  <span className="text-gray-600">{tournament.sportsType}</span>
                </div>

                {/* Date and Timings */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">Date:</span>
                  <span className="text-gray-600">
                    {new Date(tournament.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">Timings:</span>
                  <span className="text-gray-600">{tournament.timings}</span>
                </div>

                {/* Registration Details */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">
                    Last Registration:
                  </span>
                  <span className="text-gray-600">
                    {new Date(
                      tournament.lastRegistrationDate
                    ).toLocaleDateString()}
                  </span>
                </div>

                {/* Teams and Players */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">Teams:</span>
                  <span className="text-gray-600">
                    {tournament.currentNumTeams}/{tournament.maxNumTeams}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-semibold">
                    Players per Team:
                  </span>
                  <span className="text-gray-600">
                    {tournament.maxPlayersInTeam}
                  </span>
                </div>

                {/* Prize Money */}
                <div className="bg-gray-50 p-4 rounded-lg">
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
              </div>

              {/* Register Button */}
              <button
                className={`btn btn-primary w-full mt-6 py-2 text-lg font-semibold ${
                  !isRegistrationAllowed(tournament)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleRegister(tournament._id)}
                disabled={!isRegistrationAllowed(tournament)}
              >
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
