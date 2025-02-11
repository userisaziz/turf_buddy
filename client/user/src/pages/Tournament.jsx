import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useHistory } from "react-router-dom";
import axiosInstance from "../hooks/useAxiosInstance";
import { useNavigation } from "react-router-dom";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigation();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axiosInstance.get("/api/users/tournaments");
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = (tournamentId) => {
    navigate(`/register/${tournamentId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Available Tournaments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament._id}
            className="card bg-base-100 shadow-xl transition-transform transform hover:scale-105 p-4"
          >
            <div className="card-body">
              <h3 className="card-title text-xl font-semibold">
                {tournament.name}
              </h3>
              <p className="text-gray-600">{tournament.description}</p>
              <p className="text-gray-700 mt-2">
                Max Teams: {tournament.maxNumTeams}
              </p>
              <p className="text-gray-700">
                Prize Money: 1st: ${tournament.prizeMoney.first}, 2nd: $
                {tournament.prizeMoney.second}, 3rd: $
                {tournament.prizeMoney.third}
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => handleRegister(tournament._id)}
              >
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
