import React, { useState } from "react";
import PropTypes from "prop-types";
import { Plus, X } from "lucide-react";

const SPORTS_TYPES = [
  "Football",
  "Cricket",
  "Badminton",
  "Tennis",
  "Basketball",
  "Hockey",
  "Swimming",
  "Other",
];

const SportsTypeSelector = ({
  value,
  onChange,
  onBlur,
  error,
  label = "Sports Type",
  placeholder = "Select or add a sport",
  allowCustom = true,
  name,
}) => {
  const [isCustomInput, setIsCustomInput] = useState(
    value && !SPORTS_TYPES.includes(value)
  );
  const [customInput, setCustomInput] = useState(
    isCustomInput ? value : ""
  );

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "custom") {
      setIsCustomInput(true);
      setCustomInput("");
    } else {
      setIsCustomInput(false);
      setCustomInput("");
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      setCustomInput("");
      setIsCustomInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleClearCustom = () => {
    setIsCustomInput(false);
    setCustomInput("");
    onChange("");
  };

  return (
    <div>
      {label && (
        <label className="label">
          <span className="label-text font-semibold">{label}</span>
        </label>
      )}

      {!isCustomInput ? (
        <select
          name={name}
          value={value}
          onChange={handleSelectChange}
          onBlur={onBlur}
          className={`select select-bordered w-full focus:ring-2 focus:ring-blue-500 ${
            error ? "select-error" : ""
          }`}
        >
          <option value="">{placeholder}</option>
          {SPORTS_TYPES.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
          {allowCustom && <option value="custom">+ Add Custom Sport</option>}
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter custom sport name"
            className={`input input-bordered flex-1 focus:ring-2 focus:ring-blue-500 ${
              error ? "input-error" : ""
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="btn btn-primary gap-1"
            disabled={!customInput.trim()}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
          <button
            type="button"
            onClick={handleClearCustom}
            className="btn btn-ghost"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {value && (
        <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-800">{value}</span>
          {isCustomInput && (
            <span className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-900">
              Custom
            </span>
          )}
        </div>
      )}

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

SportsTypeSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  allowCustom: PropTypes.bool,
  name: PropTypes.string,
};

export default SportsTypeSelector;
