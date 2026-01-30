import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LayoutGrid, MessageSquare, LogIn } from "lucide-react";
import NavbarLayout from "./NavbarLayout";
import CityButton from "../common/CityButton";
import CitySelectionPopup from "../common/CitySelectionPopup";
import { useCitySelection } from "../../hooks/useCitySelection";
import { PATHS } from "../../constants/constants";

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

  const items = [
    { label: "Home", path: `/${citySlug}`, icon: Home },
    { label: "Turfs", path: `/${citySlug}/${PATHS.TURFS}`, icon: LayoutGrid },
    {
      label: "Contact Us",
      path: `/${citySlug}/${PATHS.CONTACT_US}`,
      icon: MessageSquare,
      mobileLabel: "Contact",
    },
    { label: "Login", path: `/${citySlug}/${PATHS.LOGIN}`, icon: LogIn, mobileOnly: true },
  ];

  const handleCityChange = (city) => {
    updateCity(city);
    setIsModalOpen(false);
  };

  const endContent = (
    <div className="flex items-center gap-2">
      <CityButton
        selectedCity={selectedCity}
        onClick={() => setIsModalOpen(true)}
      />
      <Link
        to={`/${citySlug}/${PATHS.LOGIN}`}
        className="btn btn-primary btn-sm lg:btn-md ml-2 hidden lg:flex"
      >
        Login
      </Link>
    </div>
  );

  return (
    <>
      <NavbarLayout homePath="/" items={items} endContent={endContent} />
      <CitySelectionPopup
        isOpen={isModalOpen}
        onClose={handleCityChange}
      />
    </>
  );
};

export default Navbar;
