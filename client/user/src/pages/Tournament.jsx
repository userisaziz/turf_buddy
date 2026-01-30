import { useParams, useNavigate } from "react-router-dom";
import TournamentCard from "../components/tournament/TournamentCard";
import useTournamentData from "../hooks/useTournamentData";
import { PATHS } from "../constants/constants";
import banner3 from "/banner3.jpg";

const TournamentList = () => {
  const { tournaments, loading, error } = useTournamentData();
  const { city } = useParams();
  const citySlug = city?.toLowerCase() || "";
  const navigate = useNavigate();

  const handleRegister = (tournamentId) => {
    navigate(`/auth/${citySlug}/${PATHS.TOURNAMENT_REGISTER.replace(':tournamentId', tournamentId)}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Available Tournaments in {city}
      </h2>

      {loading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && tournaments.length === 0 && (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-base-content/60">No tournaments available in {city} at the moment.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && tournaments.map((tournament) => (
          <TournamentCard
            key={tournament._id}
            tournament={tournament}
            image={banner3}
            onClick={() => handleRegister(tournament._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
