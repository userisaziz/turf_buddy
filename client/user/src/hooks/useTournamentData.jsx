import { useParams } from "react-router-dom";
import { useGetTurfsQuery } from "../redux/api/apiSlice";

const useTournamentData = () => {
  const { city } = useParams();

  // Normalize the city name to ensure consistent cache keys regardless of URL casing.
  const normalizedCity = city?.toLowerCase() || "";

  // Use the unified query that returns turfs, tournaments, and coachings
  const { data, isLoading, isError, error, isFetching } = useGetTurfsQuery(normalizedCity, {
    skip: !normalizedCity,
    refetchOnMountOrArgChange: false,
  });

  return {
    tournaments: data?.tournaments || [],
    loading: isLoading,
    fetching: isFetching,
    error: isError ? error : null
  };
};

export default useTournamentData;
