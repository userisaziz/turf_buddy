import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../hooks/useAxiosInstance";
import { ArrowLeft, Check, X, Phone, User as UserIcon, Users } from "lucide-react";

const TournamentRequests = () => {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tournament, setTournament] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await axiosInstance.get(`/api/owner/tournaments/details/${tournamentId}`);
            setTournament(resp.data);

            // Filter pending registrations from the tournament data
            const pending = resp.data.pendingRegistrations?.filter(reg => reg.status === "pending") || [];
            setPendingRequests(pending);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tournamentId]);

    const handleApprove = async (teamId) => {
        try {
            await axiosInstance.post(`/api/owner/tournaments/${tournamentId}/approve/${teamId}`);
            alert("Registration approved!");
            fetchData();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to approve"));
        }
    };

    const handleReject = async (teamId) => {
        if (!window.confirm("Are you sure you want to reject this request?")) return;
        try {
            await axiosInstance.post(`/api/owner/tournaments/${tournamentId}/reject/${teamId}`);
            alert("Registration rejected!");
            fetchData();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to reject"));
        }
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="container mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost mb-6 gap-2"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Tournaments
            </button>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Registration Requests</h2>
                <p className="text-gray-500">{tournament?.name} • {tournament?.currentNumTeams}/{tournament?.maxNumTeams} Teams Filled</p>
            </div>

            <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => (
                        <div
                            key={request.teamId?._id || request.teamId}
                            className="bg-white rounded-2xl shadow-sm border border-base-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all"
                        >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Users className="w-3" /> Team Name
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">{request.teamId?.name || "Unknown Team"}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                        <UserIcon className="w-3" /> Requested By
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-700">{request.requestedBy?.name}</span>
                                        <span className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3" /> {request.requestedBy?.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => handleApprove(request.teamId?._id || request.teamId)}
                                    className="btn btn-primary flex-1 md:flex-none gap-2"
                                >
                                    <Check className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleReject(request.teamId?._id || request.teamId)}
                                    className="btn btn-ghost text-error flex-1 md:flex-none gap-2 hover:bg-error/10"
                                >
                                    <X className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
                        <p className="text-gray-400 font-medium">No pending requests found for this tournament.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentRequests;
