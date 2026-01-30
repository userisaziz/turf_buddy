import { Clock2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Button from "../common/Button";
import { PATHS } from "../../constants/constants";

const TurfCard = ({ turf }) => {
  const { city } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const citySlug = city?.toLowerCase() || "";

  const linkTo = isLoggedIn
    ? `/auth/${citySlug}/${PATHS.TURF_DETAILS.replace(":id", turf._id)}`
    : `/${citySlug}/${PATHS.TURF_DETAILS.replace(":id", turf._id)}`;

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
        <div className="card-body p-4">
          <div className="flex justify-between items-center">
            <h2 className="card-title">{turf.name}</h2>
            <Button className="btn bg-primary btn-sm text-white">
              View Details
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {turf.sportTypes.map((sport, index) => (
              <span key={index} className="badge badge-outline">
                {sport}
              </span>
            ))}
          </div>
          <p className="mt-2">
            <span className="flex gap-2 text-sm">
              <Clock2 className="w-4 h-4" />
              Open: {turf.openTime} - {turf.closeTime}
            </span>
          </p>
          <p className="text-gray-700 flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Day:</span>
              <span className="font-semibold text-green-600">₹{turf?.priceAtMorning}</span>
              <span className="text-sm text-gray-400 line-through">₹{turf?.pricePerHour}</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Night:</span>
              <span className="font-semibold">₹{turf?.pricePerHour}</span>
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TurfCard;
