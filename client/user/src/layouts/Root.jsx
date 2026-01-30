import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import CitySelectionPopup from "../components/common/CitySelectionPopup";
import { useCitySelection } from "../hooks/useCitySelection";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";


const Root = () => {

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="flex-grow pt-16">

        <Outlet />
      </main>

    </>
  );
};

export default Root;