
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ScrollToTop from "../components/common/ScrollToTop";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-16 lg:pb-0 ">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
