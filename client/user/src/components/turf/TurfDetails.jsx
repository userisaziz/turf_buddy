import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useTurfData from "../../hooks/useTurfData";
import useReviews from "../../hooks/useReviews";
import Reviews from "../reviews/Reviews";
import TurfDetailsSkeleton from "../ui/TurfDetailsSkeleton";
import { MapPin, Clock, Activity, IndianRupee, ArrowRight, Star } from "lucide-react";

const TurfDetails = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, turfs } = useTurfData();
  const { averageRating } = useReviews(id);

  if (loading) {
    return <TurfDetailsSkeleton />;
  }

  const turf = turfs.find((t) => t._id === id);

  if (!turf) {
    return (
      <div className="alert alert-warning shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Turf not found</span>
        </div>
      </div>
    );
  }

  const handleReservation = () => {
    if (isLoggedIn) {
      navigate(`/auth/reserve/${id}`);
    } else {
      navigate(`/login`);
    }
  };

  const handleMapRedirect = () => {
    const query = encodeURIComponent(turf.location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in-left">

        <div className="w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

          {/* Image Section */}
          <div className="relative h-64 overflow-hidden group">
            <img
              src={turf.image || "/banner-1.png"}
              alt={turf.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Available Today
            </div>

            {/* Rating Floating on Image */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{averageRating}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-5">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                {turf.name}
              </h2>
              <p className="text-gray-500 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {turf.location}
              </p>
            </div>

            {/* The Two Actions Stacked */}
            <div className="space-y-3">
              {/* 1. Your Custom Map Button (Fits perfectly here) */}
              <div
                onClick={handleMapRedirect}
                className="group cursor-pointer w-full p-3 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm text-blue-600 ring-1 ring-blue-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      Navigate to Turf
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      View on Google Maps
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* 2. Primary Book Button */}
              <button
                className="btn bg-primary text-white w-full"
                onClick={handleReservation}
              >
                Reserve Now
              </button>
            </div>

          </div>
        </div>
        <div className="bg-base-100 shadow-xl rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-2xl font-bold">Rating</h3>
            <div className="rating rating-md">
              {averageRating ? (
                [1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    checked={star === Math.round(averageRating)}
                    readOnly
                  />
                ))
              ) : (
                <p className="text-sm opacity-70">No reviews yet</p>
              )}
            </div>
            {averageRating && (
              <span className="text-lg">({averageRating.toFixed(1)})</span>
            )}
          </div>

          <p className="text-lg mb-6">{turf.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-2 mb-4">
            <InfoItem
              icon={<IndianRupee className="w-6 h-6" />}
              label="PRICE PER HOUR"
              value={
                <p className="text-gray-700 grid grid-rows-2">
                  <span className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Day:</span>
                    <span className="font-semibold text-green-600">
                      ₹{turf?.priceAtMorning}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{turf?.pricePerHour}
                    </span>
                  </span>
                  {/* <span className="text-gray-300">|</span> Divider */}
                  <span className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Night:</span>
                    <span className="font-semibold">₹{turf?.pricePerHour}</span>
                  </span>
                </p>
              }
            />
            <InfoItem
              icon={<Activity className="w-6 h-6" />}
              label="SPORTS AVAILABLE"
              value={turf.sportTypes.join(", ")}
            />
            <InfoItem
              icon={<Clock className="w-6 h-6" />}
              label="OPENING HOURS"
              value={`${turf.openTime} - ${turf.closeTime}`}
            />
          </div>
          <div className="card-actions">
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleReservation}
            >
              Reserve Now
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Reviews turfId={id} />
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="bg-primary bg-opacity-10 p-3 rounded-full">
      {React.cloneElement(icon, { className: "w-6 h-6 text-primary" })}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  </div>
);

export default TurfDetails;
