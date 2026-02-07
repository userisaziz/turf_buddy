import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Trophy, Calendar, Users, ArrowRight, Zap } from "lucide-react";

const TournamentCard = ({ tournament, image, onClick }) => {
  const turf = tournament?.turf && tournament?.turf[0];
  const dateObj = new Date(tournament.date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();

  return (
    <div
      className="group relative w-full h-[380px] bg-gray-900 rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:shadow-primary/50 transition-all duration-500 border border-gray-800"
      onClick={onClick}
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image || "/banner3.jpg"}
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-90" />
      </div>

      {/* Floating Date Badge (Top Left) */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 text-center text-white min-w-[60px] group-hover:bg-primary group-hover:border-primary transition-colors">
        <span className="block text-xs font-bold uppercase tracking-wider">{month}</span>
        <span className="block text-2xl font-black leading-none">{day}</span>
      </div>

      {/* Status Badge (Top Right) */}
      <div className="absolute top-4 right-4">
        {tournament.status === 'open' ? (
          <span className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-400"></span> Open
          </span>
        ) : (
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Closed</span>
        )}
      </div>

      {/* Content Body */}
      <div className="absolute bottom-0 w-full p-6 flex flex-col h-full justify-end">
        
        {/* Entry Fee Tag */}
        <div className="mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 ease-out">
            <span className="inline-block bg-primary text-primary-content text-xs font-extrabold px-2 py-0.5 rounded transform -skew-x-12">
                {tournament.registrationFees === 0 ? "FREE ENTRY" : `ENTRY: ₹${tournament.registrationFees}`}
            </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-white italic tracking-wide mb-1 leading-tight group-hover:text-primary transition-colors">
          {tournament.name}
        </h3>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-gray-400 text-xs font-medium mb-4 mt-2">
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="truncate">{turf?.name || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{tournament.maxNumTeams} Teams Max</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
                 <Trophy className="w-4 h-4 text-yellow-500" />
                 <span className="text-yellow-500 font-bold">Tournament Mode</span>
            </div>
        </div>

        {/* Interactive Button Area */}
        <div className="w-full pt-4 border-t border-gray-700/50 flex justify-between items-center group-hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 text-white text-sm font-bold">
               <Zap className="w-4 h-4 fill-white" />
               <span>Ready?</span>
            </div>
            <button className="bg-white text-gray-900 hover:bg-primary hover:text-white p-2 rounded-full transition-all duration-300 transform group-hover:rotate-45">
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;