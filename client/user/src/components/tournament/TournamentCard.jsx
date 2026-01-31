import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, Calendar, Users } from "lucide-react";

const TournamentCard = ({ tournament, image, onClick }) => {
  const navigate = useNavigate();
  const turf = tournament?.turf && tournament?.turf[0];

  return (
    <div
      className="card bg-base-100 w-full shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-base-200 animate-fade-in"
      onClick={onClick}
    >
      <figure className="relative h-48">
        <img
          src={image || "/banner3.jpg"}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        {tournament.registrationFees === 0 ? (
          <div className="absolute top-2 left-2 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Free Entry
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ₹{tournament.registrationFees}
          </div>
        )}
        {tournament.status === 'open' && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Registration Open
          </div>
        )}
      </figure>

      <div className="card-body p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="card-title text-xl font-bold text-gray-800 line-clamp-1">
            {tournament.name}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
            <span className="line-clamp-1">{turf?.name || "Location TBD"}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-primary shrink-0" />
            <span>{new Date(tournament.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-2 text-primary shrink-0" />
            <span>Max Teams: {tournament.maxNumTeams}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Tournament</span>
          </div>
          <button className="btn btn-primary btn-sm px-4">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
