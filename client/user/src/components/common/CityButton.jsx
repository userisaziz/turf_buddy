import PropTypes from "prop-types";
import { MapPin, ChevronDown } from "lucide-react";
import { capitalizeFirstLetter } from "../../utils/commonUtils";



const CityButton = ({ selectedCity, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="btn btn-ghost gap-2 normal-case"
            aria-label={selectedCity ? `Change city: ${capitalizeFirstLetter(selectedCity)}` : "Select city"}
        >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{capitalizeFirstLetter(selectedCity) || "Select City"}</span>
            <ChevronDown className="h-4 w-4" />
        </button>
    );
};

CityButton.propTypes = {
    selectedCity: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default CityButton;