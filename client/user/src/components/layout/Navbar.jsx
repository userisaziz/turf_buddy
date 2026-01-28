import { Link } from "react-router-dom";
import { Home, LayoutGrid, MessageSquare, LogIn } from "lucide-react";
import NavbarLayout from "./NavbarLayout";

const Navbar = () => {
  const items = [
    { label: "Home", path: "/", icon: Home },
    { label: "Turfs", path: "/turfs", icon: LayoutGrid },
    {
      label: "Contact Us",
      path: "/contact-us",
      icon: MessageSquare,
      mobileLabel: "Contact",
    },
    { label: "Login", path: "/login", icon: LogIn, mobileOnly: true },
  ];

  const endContent = (
    <Link to="/login" className="btn btn-ghost ml-2">
      Login
    </Link>
  );

  return <NavbarLayout homePath="/" items={items} endContent={endContent} />;
};

export default Navbar;
