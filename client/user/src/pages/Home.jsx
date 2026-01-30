import { Link, useParams, useNavigate } from "react-router-dom";
import { CalendarX, MapPinOff } from "lucide-react";
import Carousel from "../components/common/Carousel";
import Footer from "../components/layout/Footer";
import useTurfData from "../hooks/useTurfData";
import useTournamentData from "../hooks/useTournamentData";
import TournamentCard from "../components/tournament/TournamentCard";
import TurfCard from "../components/turf/TurfCard";
import TurfCardSkeleton from "../components/ui/TurfCardSkeleton";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import Button from "../components/common/Button";
import { PATHS } from "../constants/constants";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { city } = useParams();
  const citySlug = city?.toLowerCase() || "";
  const { turfs, loading: turfLoading } = useTurfData();
  const { tournaments, loading: tournamentLoading } = useTournamentData();
  const navigate = useNavigate();

  const handleNavigateMoreTurfs = () => {
    const path = isLoggedIn
      ? `/auth/${citySlug}/${PATHS.TURFS}`
      : `/${citySlug}/${PATHS.TURFS}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Helmet>
        <title>Turf Buddy | Find Sports Turfs in {city || 'Your City'}</title>
        <meta name="description" content={`Discover and book the best sports turfs in ${city}. Book soccer, cricket, and other sports turfs easily.`} />
      </Helmet>

      <Carousel />

      <div className="container mx-auto p-4 animate-slide-in-left">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Turfs</h2>
          <Link
            to={isLoggedIn ? `/auth/${citySlug}/${PATHS.TURFS}` : `/${citySlug}/${PATHS.TURFS}`}
            className="btn bg-primary text-white btn-sm lg:btn-md ml-2"
          >
            View More
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TurfCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : turfs.length > 0 ? (
            turfs
              .slice(0, 3)
              .map((turf) => <TurfCard key={turf._id} turf={turf} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-base-content/50">
              <MapPinOff className="w-16 h-16 mb-4" />
              <p className="text-xl font-medium">No turfs available in {city} at the moment</p>
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <Button
            onClick={handleNavigateMoreTurfs}
            className="btn bg-primary text-white"
          >
            View More Turfs
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournamentLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TurfCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <TournamentCard
                key={tournament._id}
                tournament={tournament}
                image="/banner3.jpg"
                onClick={() =>
                  navigate(`/auth/${citySlug}/${PATHS.TOURNAMENTS}/${tournament._id}`, {
                    state: { tournament },
                  })
                }
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-base-content/50">
              <CalendarX className="w-16 h-16 mb-4" />
              <p className="text-xl font-medium">No ongoing events in {city}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
