import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import NavbarLayout from "../layout/NavbarLayout.jsx";
import { getNavItems } from "../../constants/navItems.js";

export default function AuthNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { city } = useParams();
  const citySlug = city?.toLowerCase() || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const items = getNavItems(citySlug, true, handleLogout);

  const endContent = (
    <button className="btn btn-ghost ml-2" onClick={handleLogout}>
      Logout
    </button>
  );

  return (
    <NavbarLayout homePath={`/auth/${citySlug}`} items={items} endContent={endContent} />
  );
}
