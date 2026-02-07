import React from "react";
import { MapPin, Users, Clock, Trophy, Zap, ArrowUpRight } from "lucide-react";

const CoachingCard = ({ coaching, onClick }) => {
  const capacityPercentage = Math.min(
    (coaching.currentStudents / coaching.maxStudents) * 100,
    100
  );

  const isFull = coaching.currentStudents >= coaching.maxStudents;
  const isFillingFast = capacityPercentage > 75;

  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[400px] bg-gray-900 rounded-3xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-primary/40 transition-all duration-500 border border-gray-800"
    >
      {/* 1. Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={coaching.turf?.image || "/banner3.jpg"}
          alt={coaching.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      {/* 2. Floating "Hype" Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="inline-block bg-primary text-white text-xs font-black italic uppercase px-3 py-1 -skew-x-12 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          {coaching.sportsType}
        </span>
        {isFillingFast && (
          <span className="inline-block bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1 -skew-x-12 animate-pulse">
            High Demand
          </span>
        )}
      </div>

      {/* 3. The "Big Price" Tag */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end text-white">
        <div className="text-3xl font-black leading-none tracking-tighter">
            <span className="text-primary text-lg align-top mr-1">₹</span>
            {coaching.monthlyFee}
        </div>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Per Month</span>
      </div>

      {/* 4. Content Overlay */}
      <div className="absolute bottom-0 w-full p-6 z-10 flex flex-col gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        
        {/* Title */}
        <div>
            <h3 className="text-2xl font-black text-white italic uppercase leading-none mb-1 line-clamp-2">
            {coaching.name}
            </h3>
            <div className="flex items-center text-gray-400 text-xs font-medium">
            <MapPin className="w-3 h-3 mr-1 text-primary" />
            <span className="truncate max-w-[200px]">{coaching.turf?.name}</span>
            </div>
        </div>

        {/* The "Power Bar" (Capacity) */}
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> Squad Energy</span>
                <span className={isFull ? "text-red-500" : "text-green-400"}>
                    {coaching.currentStudents}/{coaching.maxStudents}
                </span>
            </div>
            {/* Sassy Segmented Bar */}
            <div className="flex gap-1 h-2 w-full">
                {[...Array(10)].map((_, i) => {
                    const threshold = (i + 1) * 10;
                    const isFilled = capacityPercentage >= threshold;
                    return (
                        <div 
                            key={i} 
                            className={`flex-1 rounded-sm transition-all duration-300 ${
                                isFilled 
                                    ? (isFull ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-primary shadow-[0_0_8px_rgba(var(--p),0.8)]") 
                                    : "bg-gray-700"
                            }`}
                        />
                    );
                })}
            </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800/50 mt-1">
            <div className="flex items-center gap-2 text-white bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-bold">{coaching.startTime}</span>
            </div>
            
            <button className="bg-white text-black hover:bg-primary hover:text-white rounded-full p-2 transition-all duration-300 transform group-hover:rotate-45">
                <ArrowUpRight className="w-5 h-5 font-bold" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingCard;