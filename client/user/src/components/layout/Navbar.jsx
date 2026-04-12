import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarLayout from "./NavbarLayout";
import CityButton from "../common/CityButton";
import CitySelectionPopup from "../common/CitySelectionPopup";
import { useCitySelection } from "../../hooks/useCitySelection";
import { PATHS } from "../../constants/constants";
import { getNavItems } from "../../constants/navItems";
import ThemeSwitcher from "../common/ThemeSwitcher";

const Navbar = () => {
  const { selectedCity, updateCity, isLoading } = useCitySelection();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open modal if no city is selected and loading is done
  useEffect(() => {
    const isCityNotSelected = !selectedCity || selectedCity === 'null' || selectedCity === '';
    if (!isLoading && isCityNotSelected) {
      setIsModalOpen(true);
    }
  }, [isLoading, selectedCity]);

  const citySlug = selectedCity?.toLowerCase() || "";

  // Using centralized nav items config
  const items = getNavItems(citySlug, false);

  const handleCityChange = (city) => {
    updateCity(city);
    setIsModalOpen(false);
  };

  const endContent = (
    <div className="flex items-center gap-3">
      <CityButton
        selectedCity={selectedCity}
        onClick={() => setIsModalOpen(true)}
      />
      {/* <ThemeSwitcher /> */}
      {/* <Link
        to={citySlug ? `/${citySlug}/${PATHS.LOGIN}` : `/${PATHS.LOGIN}`}
        className="btn btn-primary btn-sm lg:btn-md"
      >
        Login
      </Link> */}
    </div>
  );

  return (
    <>
      <NavbarLayout homePath="/" items={items} endContent={endContent} citySlug={citySlug} />
      <CitySelectionPopup
        isOpen={isModalOpen}
        onClose={handleCityChange}
      />
    </>
  );
};

export default Navbar;
