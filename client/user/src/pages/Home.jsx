import { Link } from "react-router-dom";
import Carousel from "../components/common/Carousel";
import Footer from "../components/layout/Footer";
import useTurfData from "../hooks/useTurfData";
import useTournamentData from "../hooks/useTournamentData";
import TournamentCard from "../components/tournament/TournamentCard";
import TurfCard from "../components/turf/TurfCard";
import TurfCardSkeleton from "../components/ui/TurfCardSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useSelector } from "react-redux";
import banner1 from "/banner-1.png";
import banner2 from "/banner-2.jpeg";
import banner3 from "/banner-3.jpeg";
import { Helmet } from "react-helmet";
import InstallButton from "../components/common/InstallButton";
const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { turfs, loading: turfLoading } = useTurfData();
  const { tournaments, loading: tournamentLoading } = useTournamentData();
  const slides = [banner1, banner2, banner3];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Helmet>
        <title>
          Turf Buddy | Klb TurfBuddy | Turf Buddy Gulbarga / Kalaburgi |
        </title>

        <meta
          name="description"
          content="Discover and book the best sports turfs in Kalaburgi/Gulbarga. Klb TurfBuddy makes it easy to find venues for soccer, cricket, and other sports. Book your turf today!"
        />
        <meta
          name="keywords"
          content="Klb TurfBuddy,Turf Buddy Gulbarga, Turf Buddy Kalaburgi, sports turf booking, soccer turfs Kalaburgi, cricket venues Gulbarga, football ground booking, sports facilities Kalaburgi"
        />
        <link rel="canonical" href="https://turf-buddy.vercel.app/" />
      </Helmet>
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse animate-slide-in-right">
          <div className="w-full lg:w-1/2">
            <Carousel slides={slides} />
          </div>

          <div className="w-full lg:w-1/2 animate-zoom-in">
            <h1 className="text-5xl font-bold ">Welcome to TurfBuddy</h1>
            <p className="py-6">
              Discover and book the best turf fields in your area. Whether
              you&#39;re planning a casual game or a tournament, TurfBuddy has
              got you covered.
            </p>
            <Link
              to={isLoggedIn ? "/auth/turfs" : "/signup"}
              className="btn btn-accent"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto  p-4 animate-slide-in-left">
        <h2 className="text-3xl font-bold mb-6">Featured Turfs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TurfCardSkeleton key={`skeleton-${index}`} />
              ))
            : turfs
                .slice(0, 3)
                .map((turf) => <TurfCard key={turf._id} turf={turf} />)}
        </div>
        <div className="text-center mt-8">
          <Link
            to={isLoggedIn ? "/auth/turfs" : "/turfs"}
            className="btn btn-primary"
          >
            View More Turfs
          </Link>
        </div>
      </div>

      <Footer />
      <InstallButton />
    </div>
  );
};

export default Home;
