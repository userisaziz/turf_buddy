import { useParams } from "react-router-dom";
import { useGetCoachingsQuery } from "../redux/api/apiSlice";

const useCoachingData = () => {
    const { city } = useParams();

    // Normalize the city name to ensure consistent cache keys regardless of URL casing.
    const normalizedCity = city?.toLowerCase() || "";

    const { data, isLoading, isError, error, isFetching } = useGetCoachingsQuery(normalizedCity, {
        skip: !normalizedCity,
        refetchOnMountOrArgChange: false,
    });

    return {
        coachings: data || [],
        loading: isLoading,
        fetching: isFetching,
        error: isError ? error : null
    };
};

export default useCoachingData;
