import { Clock2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TurfCard = ({ turf }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const linkTo = isLoggedIn ? `/auth/turf/${turf._id}` : `/turf/${turf._id}`;

  return (
    <Link to={linkTo} className="block">
      <div className="card bg-base-100 shadow-xl animate-bounce-fade-in">
        <figure>
          <img
            src={turf.image}
            alt={turf.name}
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{turf.name}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {turf.sportTypes.map((sport, index) => (
              <span key={index} className="badge badge-outline">
                {sport}
              </span>
            ))}
          </div>
          <p className="mt-2">
            <span className="flex gap-2">
              Open: {turf.openTime} - {turf.closeTime}
            </span>
    
          </p>
          <p className="text-gray-700 flex items-center gap-2">
  <span className="flex items-center gap-1">
    <span className="text-sm text-gray-500">Day:</span>
    <span className="font-semibold text-green-600">₹{turf?.priceAtMorning}</span>
    <span className="text-sm text-gray-400 line-through">₹{turf?.pricePerHour}</span>
  </span>
  <span className="text-gray-300">|</span> {/* Divider */}
  <span className="flex items-center gap-1">
    <span className="text-sm text-gray-500">Night:</span>
    <span className="font-semibold">₹{turf?.pricePerHour}</span>
  </span>
</p>
          <div className="card-actions justify-end mt-4">
            <span className="btn btn-primary">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TurfCard;
