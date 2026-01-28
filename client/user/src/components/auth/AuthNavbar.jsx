import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import {
  Home,
  LayoutGrid,
  Trophy,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import NavbarLayout from "../layout/NavbarLayout.jsx";

export default function AuthNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const items = [
    { label: "Home", path: "/auth", icon: Home },
    { label: "Turfs", path: "/auth/turfs", icon: LayoutGrid },
    {
      label: "Tournaments",
      path: "/auth/tournaments",
      icon: Trophy,
      mobileLabel: "Events",
    },
    {
      label: "My Bookings",
      path: "/auth/booking-history",
      icon: CalendarCheck,
      mobileLabel: "Bookings",
    },
    {
      label: "Become an Owner",
      path: "/auth/become-owner",
      desktopOnly: true,
      render: (isActive) => (
        <NavLink
          to="/auth/become-owner"
          className={isActive ? "text-accent" : ""}
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
    <NavbarLayout homePath="/auth" items={items} endContent={endContent} />
  );
}
