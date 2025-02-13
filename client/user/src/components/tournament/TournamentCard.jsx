import React from "react";
import { useNavigate } from "react-router-dom";

const TournamentCard = ({ tournament, image, onClick }) => {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 w-full shadow-xl animate-bounce-fade-in p-4">
      <img
        src={image}
        alt={tournament.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      {tournament.registrationFees === 0 && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded">
          Free
        </div>
      )}
      <div className="card-body">
        <h3 className="text-xl font-semibold">{tournament.name}</h3>
        <p
          className="text-gray-500 font-semibold underline "
          onClick={() => navigate(`/auth/turf/${tournament?.turf[0]?._id}`)}
        >
          Location: {tournament?.turf[0]?.name}
        </p>
        {/* <p className="text-gray-600">{tournament.description}</p> */}
        <p className="text-gray-500">
          Date: {new Date(tournament.date).toLocaleDateString()}
        </p>
        <p className="text-gray-500">Max Teams: {tournament.maxNumTeams}</p>
        <p className="text-gray-500">
          Registration Fee:{" "}
          {tournament.registrationFees === 0
            ? "Free"
            : tournament.registrationFees}
        </p>
        <button
          className="btn btn-primary mt-2"
          // onClick={() => navigate("/auth/tournaments")}
          onClick={onClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
