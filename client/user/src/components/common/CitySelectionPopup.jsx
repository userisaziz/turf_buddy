import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Preferences } from "@capacitor/preferences";
import { Search, MapPin, X, Navigation, ChevronRight } from "lucide-react";
import { useCitySelection } from "../../hooks/useCitySelection";
import { CITIES } from "../../constants/constants";



const CitySelectionPopup = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedCity } = useCitySelection();


    const filteredCities = CITIES.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCitySelect = (city) => {
        onClose(city);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>

            {/* 1. Backdrop (Blurred & Darkened) */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}

            />

            {/* 2. Modal Container (Bottom Sheet on Mobile, Center Modal on Web) */}
            <div className={`
        relative w-full bg-base-100 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out
        /* Mobile Styles: Bottom Sheet */
        h-[85vh] rounded-t-3xl translate-y-0
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        
        /* Desktop/Tablet Styles: Center Modal */
        sm:h-[600px] sm:max-w-md sm:rounded-2xl sm:translate-y-0 sm:scale-100
        ${!isOpen && 'sm:scale-95 sm:opacity-0'}
      `}>

                {/* Mobile Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-base-300 rounded-full" />
                </div>

                {/* Header Section */}
                <div className="px-5 pt-2 pb-4 border-b border-base-200 bg-base-100 z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            Select City
                        </h3>

                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                        <input
                            type="text"
                            placeholder="Search for your city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-lg w-full pl-12 pr-10 bg-base-200/50 focus:bg-base-100 border-transparent focus:border-primary focus:outline-none transition-all rounded-2xl text-base"
                            autoFocus={isOpen} // Auto focus when opened
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-base-300 text-base-content/50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain pb-6">
                    {/* City List */}
                    <div className="px-2">
                        {filteredCities.length > 0 ? (
                            <div className="flex flex-col">
                                {filteredCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        className="group flex items-center justify-between p-4 hover:bg-base-200 rounded-xl transition-colors border-b border-base-100 last:border-0 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-white transition-colors">
                                                <MapPin className="h-5 w-5 text-base-content/70" />
                                            </div>
                                            <span className="text-base font-medium">{city}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-base-content/30 group-hover:text-base-content/60" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
                                <MapPin className="h-12 w-12 mb-2 opacity-20" />
                                <p>No cities found</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

CitySelectionPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CitySelectionPopup;