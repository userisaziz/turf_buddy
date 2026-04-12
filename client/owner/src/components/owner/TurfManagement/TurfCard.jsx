import React from "react";
import { Edit2, MapPin, Clock, Zap, Star } from "lucide-react";

const TurfCard = ({ turf, onEdit }) => {
  return (
    <div className="group relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 cursor-default">
      
      {/* 1. Full Background Image */}
      <div className="absolute inset-0">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 ease-in-out"
        />
        {/* Heavy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      {/* 2. Top Bar (Rating & Price) */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          {turf.avgRating?.toFixed(1) || "New"}
        </div>
        
        <div className="flex flex-col items-end">
             <div className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">
                <span className="text-primary text-base align-top mr-1">₹</span>{turf.pricePerHour}
             </div>
             <span className="text-[10px] text-gray-300 uppercase tracking-widest">Per Hour</span>
        </div>
      </div>

      {/* 3. Bottom Content Panel */}
      <div className="absolute bottom-0 w-full p-6 z-10 flex flex-col gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        
        {/* Title */}
        <h2 className="text-3xl font-black text-white italic tracking-wide leading-none">
          {turf.name}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-gray-300 text-xs font-medium">
            <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="truncate">{turf.location}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
                <Clock size={14} className="text-primary shrink-0" />
                <span>{turf.openTime} - {turf.closeTime}</span>
            </div>
        </div>

        {/* Sports List (Glass Effect) */}
        <div className="flex flex-wrap gap-2 my-2">
            {turf.sportTypes.slice(0, 3).map((sport, i) => (
                <span key={i} className="text-[10px] uppercase font-bold text-white bg-white/10 border border-white/10 px-2 py-1 rounded">
                    {sport}
                </span>
            ))}
            {turf.sportTypes.length > 3 && (
                <span className="text-[10px] text-white bg-primary/20 px-2 py-1 rounded">+{turf.sportTypes.length - 3}</span>
            )}
        </div>

        {/* Edit Button (Slide Up Effect) */}
        <div className="pt-4 border-t border-gray-700/50 opacity-100 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => onEdit(turf)}
                className="w-full py-3 rounded-xl bg-primary text-primary-content font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(var(--p),0.5)] hover:shadow-[0_0_25px_rgba(var(--p),0.8)] transition-all flex justify-center items-center gap-2"
            >
                <Edit2 size={16} /> Edit Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;