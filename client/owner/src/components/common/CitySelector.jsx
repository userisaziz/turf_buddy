import React from "react";
import PropTypes from "prop-types";
import { MapPin } from "lucide-react";

const SUPPORTED_CITIES = [
  "Bangalore",
  "Gulbarga",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Chennai",
  "Afzalpur",
];


const CitySelector = ({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  label = "City", 
  placeholder = "Select a city",
  name,
  required = false,
  disabled = false,
}) => {
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="label">
          <span className={`label-text font-semibold ${required ? "after:content-['*'] after:ml-0.5 after:text-error" : ""}`}>
            {label}
          </span>
        </label>
      )}
      
      <select
        name={name}
        value={value || ""}
        onChange={handleSelectChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`select select-bordered w-full ${
          error ? "select-error" : ""
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder}</option>
        {SUPPORTED_CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {value && !SUPPORTED_CITIES.includes(value) && (
        <div className="mt-2 p-2 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm">
          Note: {value} is not in our supported cities list. It may not work properly.
        </div>
      )}

      {error && (
        <div className="mt-2 text-error text-sm flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};

CitySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CitySelector;