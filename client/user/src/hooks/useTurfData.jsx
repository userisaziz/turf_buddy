import { useParams } from "react-router-dom";
import { useGetTurfsQuery } from "../redux/api/apiSlice";

const useTurfData = () => {
  const { city } = useParams();

  // Normalize the city name to ensure consistent cache keys regardless of URL casing.
  const normalizedCity = city?.toLowerCase() || "";

  const { data, isLoading, isError, error, isFetching } = useGetTurfsQuery(normalizedCity, {
    skip: !normalizedCity,
    // Ensure we don't refetch on every mount if data is already in cache
    refetchOnMountOrArgChange: false,
  });

  return {
    turfs: data?.turfs || [],
    loading: isLoading,
    fetching: isFetching,
    error: isError ? error : null
  };
};

export default useTurfData;
