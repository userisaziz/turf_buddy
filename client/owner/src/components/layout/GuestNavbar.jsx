import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher.jsx";
import { Home, LogIn, UserPlus } from "lucide-react";

const GuestNavbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <div className="navbar bg-base-100 fixed top-0 z-50 shadow-md hidden lg:flex">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <img
              src="/logo.png"
              alt="TurfBuddy"
              className="h-10 w-10 mask mask-squircle"
            />
            TurfBuddy
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <ThemeSwitcher />
          <Link to="/signup" className="btn btn-primary btn-outline ml-2">
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="navbar bg-base-100 fixed top-0 z-50 shadow-sm lg:hidden min-h-[4rem]">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl px-2">
            <img
              src="/logo.png"
              alt="TurfBuddy"
              className="h-8 w-8 mask mask-squircle"
            />
            TurfBuddy
          </Link>
        </div>
        <div className="navbar-end">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Mobile Bottom Navigation (Android-like) */}
      <div className="btm-nav lg:hidden z-50 bg-base-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link to="/" className={`${isActive("/") ? "active text-primary" : "text-base-content/70"}`}>
          <Home className="h-5 w-5" />
          <span className="btm-nav-label text-xs mt-1">Home</span>
        </Link>
        <Link to="/login" className={`${isActive("/login") ? "active text-primary" : "text-base-content/70"}`}>
          <LogIn className="h-5 w-5" />
          <span className="btm-nav-label text-xs mt-1">Login</span>
        </Link>
        <Link to="/signup" className={`${isActive("/signup") ? "active text-primary" : "text-base-content/70"}`}>
          <UserPlus className="h-5 w-5" />
          <span className="btm-nav-label text-xs mt-1">Sign Up</span>
        </Link>
      </div>
    </>
  );
};

export default GuestNavbar;
