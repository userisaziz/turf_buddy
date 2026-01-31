import { Link, useParams, useNavigate } from "react-router-dom";
import { CalendarX, MapPinOff } from "lucide-react";
import Carousel from "../components/common/Carousel";
import Footer from "../components/layout/Footer";
import useTurfData from "../hooks/useTurfData";
import useTournamentData from "../hooks/useTournamentData";
import useCoachingData from "../hooks/useCoachingData";
import TournamentCard from "../components/tournament/TournamentCard";
import CoachingCard from "../components/tournament/CoachingCard";
import TurfCard from "../components/turf/TurfCard";
import TurfCardSkeleton from "../components/ui/TurfCardSkeleton";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Button from "../components/common/Button";
import { PATHS } from "../constants/constants";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { city } = useParams();
  const citySlug = city?.toLowerCase() || "";
  const { turfs, loading: turfLoading } = useTurfData();
  const { tournaments, loading: tournamentLoading } = useTournamentData();
  const { coachings, loading: coachingLoading } = useCoachingData();
  const navigate = useNavigate();

  const handleNavigateMoreTurfs = () => {
    // If no city is in URL, we shouldn't attempt to go to a city-prefixed auth route without one
    if (!citySlug && isLoggedIn) {
      // This shouldn't normally happen due to useCitySelection redirect, 
      // but we'll fallback to a generic search or the root
      navigate(`/${PATHS.TURFS}`);
      return;
    }

    const path = isLoggedIn
      ? `/auth/${citySlug}/${PATHS.TURFS}`
      : citySlug
        ? `/${citySlug}/${PATHS.TURFS}`
        : `/${PATHS.TURFS}`;

    navigate(path);
  };

  const getCityPath = (basePath) => {
    return citySlug ? `/${citySlug}/${basePath}` : `/${basePath}`;
  };

  const getAuthCityPath = (basePath) => {
    return isLoggedIn
      ? `/auth/${citySlug || 'mumbai'}/${basePath}`
      : getCityPath(basePath);
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
            to={isLoggedIn ? getAuthCityPath(PATHS.TURFS) : getCityPath(PATHS.TURFS)}
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
              <p className="text-xl font-medium">No turfs available in {city || 'this area'} at the moment</p>
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
                  navigate(getAuthCityPath(PATHS.TOURNAMENTS), { state: { tab: "tournaments" } })
                }
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-base-content/50">
              <CalendarX className="w-16 h-16 mb-4" />
              <p className="text-xl font-medium">No ongoing events in {city || 'this area'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Coaching Classes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachingLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TurfCardSkeleton key={`skeleton-coaching-${index}`} />
            ))
          ) : coachings.length > 0 ? (
            coachings.map((coaching) => (
              <CoachingCard
                key={coaching._id}
                coaching={coaching}
                onClick={() =>
                  navigate(getAuthCityPath(PATHS.TOURNAMENTS), { state: { tab: "coaching" } })
                }
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-base-content/50 bg-base-200/20 rounded-2xl border border-dashed border-base-300">
              <CalendarX className="w-16 h-16 mb-4" />
              <p className="text-xl font-medium">No coaching classes scheduled in {city || 'this area'}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
