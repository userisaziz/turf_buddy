import { NavLink, useNavigate, useParams } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import {
  Home as HomeIcon,
  LayoutGrid,
  Trophy,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import NavbarLayout from "../layout/NavbarLayout.jsx";
import { PATHS } from "../../constants/constants.js";

export default function AuthNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { city } = useParams();
  const citySlug = city?.toLowerCase() || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const items = [
    { label: "Home", path: `/auth/${citySlug}`, icon: HomeIcon },
    { label: "Turfs", path: `/auth/${citySlug}/${PATHS.TURFS}`, icon: LayoutGrid },
    {
      label: "Tournaments",
      path: `/auth/${citySlug}/${PATHS.TOURNAMENTS}`,
      icon: Trophy,
      mobileLabel: "Events",
    },
    {
      label: "My Bookings",
      path: `/auth/${citySlug}/${PATHS.BOOKING_HISTORY}`,
      icon: CalendarCheck,
      mobileLabel: "Bookings",
    },
    {
      label: "Become an Owner",
      path: `/auth/${citySlug}/${PATHS.BECOME_OWNER}`,
      desktopOnly: true,
      render: (active) => (
        <NavLink
          to={`/auth/${citySlug}/${PATHS.BECOME_OWNER}`}
          className={active ? "text-accent active" : ""}
        >
          Become an Owner
        </NavLink>
      ),
    },
    {
      label: "Logout",
      icon: LogOut,
      onClick: handleLogout,
      mobileOnly: true,
    },
  ];

  const endContent = (
    <button className="btn btn-ghost ml-2" onClick={handleLogout}>
      Logout
    </button>
  );

  return (
    <NavbarLayout homePath={`/auth/${citySlug}`} items={items} endContent={endContent} />
  );
}
