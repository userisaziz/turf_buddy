import { Link } from "react-router-dom";

import { Carousel, Footer } from "@components/common";

import banner1 from "/banner-1.png";
import banner2 from "/banner-2.jpeg";
import banner3 from "/banner-3.jpeg";
import TurfLanding from "../components/common/FeaturedCard";
import TurfSalesPage from "../components/common/TurfSalesPage";


const Home = () => {
  const slides = [banner1, banner2, banner3];

  return (
    <div className="  bg-base-100 text-base-content">
      {/* <Carousel slides={slides} /> */}

      <TurfLanding />
      <TurfSalesPage />
      <Footer />
    </div>
  );
};

export default Home;
