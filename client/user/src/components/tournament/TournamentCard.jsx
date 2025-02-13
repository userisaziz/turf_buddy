import React from "react";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 shadow-xl animate-bounce-fade-in">
      <div className="card-body">
        <h3 className="text-xl font-semibold">{tournament.name}</h3>
        {/* <p className="text-gray-600">{tournament.description}</p> */}
        <p className="text-gray-500">
          Date: {new Date(tournament.date).toLocaleDateString()}
        </p>
        <p className="text-gray-500">Max Teams: {tournament.maxNumTeams}</p>
        <p className="text-gray-500">
          Registration Fee: {tournament.registrationFees}
        </p>
        <button
          className="btn btn-primary mt-2"
          onClick={() => navigate("/auth/tournaments")}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
