import React from "react";
import { MapPin, Users, Calendar, Clock } from "lucide-react";

const CoachingCard = ({ coaching, onClick }) => {
    return (
        <div
            className="card bg-base-100 w-full shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-base-200"
            onClick={onClick}
        >
            <figure className="relative h-48">
                <img
                    src={coaching.turf?.image || "/banner3.jpg"}
                    alt={coaching.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {coaching.sportsType}
                </div>
            </figure>

            <div className="card-body p-5">
                <h3 className="card-title text-xl font-bold text-gray-800 line-clamp-1">
                    {coaching.name}
                </h3>

                <div className="flex items-center text-gray-600 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    <span className="line-clamp-1">{coaching.turf?.name}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-1">
                    <Clock className="w-4 h-4 mr-1 text-primary" />
                    <span>{coaching.startTime} - {coaching.endTime}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    <span>{coaching.currentStudents}/{coaching.maxStudents} Students</span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Monthly Fee</span>
                        <span className="text-lg font-extrabold text-primary">₹{coaching.monthlyFee}</span>
                    </div>
                    <button className="btn btn-primary btn-sm px-4">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachingCard;
