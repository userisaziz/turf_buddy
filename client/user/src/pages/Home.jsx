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

import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { turfs, loading: turfLoading } = useTurfData();
  const { tournaments, loading: tournamentLoading } = useTournamentData();
  const navigate = useNavigate();
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
        <Carousel />

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
          <Button
            onClick={() => navigate(isLoggedIn ? "/auth/turfs" : "/turfs")}
            className="btn btn-primary"
          >
            View More Turfs
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Events</h2>

        {tournamentLoading
          ? Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide key={index}>
              <TurfCardSkeleton key={`skeleton-${index}`} />
            </SwiperSlide>
          ))
          : tournaments.map((tournament) => (
            <TournamentCard
              tournament={tournament}
              image={banner3}
              onClick={() =>
                navigate(`/auth/tournaments/${tournament._id}`, {
                  state: {
                    tournament,
                  },
                })
              }
            />
          ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
