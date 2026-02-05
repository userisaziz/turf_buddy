import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../hooks/useAxiosInstance";
import { Trophy, Calendar, MapPin, Users, History, Eye, Ban, Trash2 } from "lucide-react";

const TournamentList = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/owner/tournaments/all");
            setTournaments(response.data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    const handleDisable = async (tournamentId) => {
        if (!window.confirm("Are you sure you want to disable this tournament?")) return;
        try {
            await axiosInstance.patch(`/api/owner/tournaments/disable/${tournamentId}`);
            alert("Tournament disabled successfully!");
            fetchTournaments();
        } catch (error) {
            alert("Error disabling tournament: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    const handleDelete = async (tournamentId) => {
        if (!window.confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return;
        try {
            await axiosInstance.delete(`/api/owner/tournaments/${tournamentId}`);
            alert("Tournament deleted successfully!");
            fetchTournaments();
        } catch (error) {
            alert("Error deleting tournament: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Tournaments</h2>

            {tournaments.length === 0 ? (
                <div className="text-center py-20 bg-base-200 rounded-2xl">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-base-content/20" />
                    <p className="text-xl font-medium text-base-content/50">No tournaments created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament._id}
                            className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-all"
                        >
                            <div className="card-body p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                                        {tournament.name}
                                    </h3>
                                    <span className={`badge ${tournament.status === 'available' ? 'badge-success' : 'badge-ghost'} badge-sm`}>
                                        {tournament.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{tournament.turf?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{new Date(tournament.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>{tournament.currentNumTeams}/{tournament.maxNumTeams} Teams</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <button
                                        className="btn btn-primary btn-sm flex-1 gap-1"
                                        onClick={() => navigate(`/owner/tournaments/${tournament._id}/requests`)}
                                    >
                                        <Eye className="w-4 h-4" /> Requests
                                    </button>
                                    {tournament.status === 'available' && (
                                        <button
                                            className="btn btn-warning btn-sm gap-1"
                                            onClick={() => handleDisable(tournament._id)}
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-error btn-sm gap-1 text-white"
                                        onClick={() => handleDelete(tournament._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TournamentList;
