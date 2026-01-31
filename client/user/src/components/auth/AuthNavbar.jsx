import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import NavbarLayout from "../layout/NavbarLayout.jsx";
import { getNavItems } from "../../constants/navItems.js";
import { useCitySelection } from "../../hooks/useCitySelection.jsx";
import CityButton from "../common/CityButton.jsx";
import CitySelectionPopup from "../common/CitySelectionPopup.jsx";
import { useState } from "react";

export default function AuthNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { city } = useParams();
  const { selectedCity, updateCity } = useCitySelection();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const citySlug = city?.toLowerCase() || selectedCity?.toLowerCase() || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const handleCityChange = (newCity) => {
    updateCity(newCity);
    setIsModalOpen(false);
  };

  const items = getNavItems(citySlug, true, handleLogout);

  const endContent = (
    <div className="flex items-center gap-2">
      <CityButton
        selectedCity={selectedCity}
        onClick={() => setIsModalOpen(true)}
      />
    </div>
  );

  return (
    <>
      <NavbarLayout homePath={`/auth/${citySlug}`} items={items} endContent={endContent} />
      <CitySelectionPopup
        isOpen={isModalOpen}
        onClose={handleCityChange}
      />
    </>
  );
}
