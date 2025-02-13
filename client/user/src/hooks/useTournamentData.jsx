import { useEffect, useState } from "react";
import axiosInstance from "./useAxiosInstance"; // Adjust the import based on your project structure

const useTournamentData = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axiosInstance.get("/api/user/tournaments/all"); // Adjust the endpoint as necessary
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return { tournaments, loading };
};

export default useTournamentData;
