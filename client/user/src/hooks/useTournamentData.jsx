import { useParams } from "react-router-dom";
import { useGetTournamentsQuery } from "../redux/api/apiSlice";

const useTournamentData = () => {
  const { city } = useParams();

  // Normalize the city name to ensure consistent cache keys regardless of URL casing.
  const normalizedCity = city?.toLowerCase() || "";

  const { data, isLoading, isError, error, isFetching } = useGetTournamentsQuery(normalizedCity, {
    skip: !normalizedCity,
    refetchOnMountOrArgChange: false,
  });

  return {
    tournaments: data || [],
    loading: isLoading,
    fetching: isFetching,
    error: isError ? error : null
  };
};

export default useTournamentData;
