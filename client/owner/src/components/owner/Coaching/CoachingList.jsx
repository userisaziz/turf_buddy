import React, { useEffect, useState } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";

const CoachingList = () => {
    const [coachings, setCoachings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCoachings = async () => {
        try {
            const response = await axiosInstance.get("/api/owner/coaching/all");
            setCoachings(response.data);
        } catch (error) {
            console.error("Error fetching coachings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoachings();
    }, []);

    const handleToggleStatus = async (coachingId) => {
        try {
            await axiosInstance.patch(`/api/owner/coaching/${coachingId}/toggle-status`);
            setCoachings((prev) =>
                prev.map((c) =>
                    c._id === coachingId
                        ? { ...c, status: c.status === "active" ? "inactive" : "active" }
                        : c
                )
            );
        } catch (error) {
            alert("Error updating status: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (coachingId) => {
        if (window.confirm("Are you sure you want to delete this coaching class? This will also delete all related enquiries.")) {
            try {
                await axiosInstance.delete(`/api/owner/coaching/${coachingId}`);
                setCoachings((prev) => prev.filter((c) => c._id !== coachingId));
                alert("Coaching deleted successfully!");
            } catch (error) {
                alert("Error deleting coaching: " + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading coaching classes...</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                My Coaching Classes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coachings.length > 0 ? (
                    coachings.map((coaching) => (
                        <div
                            key={coaching._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {coaching.name}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${coaching.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {coaching.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">{coaching.description}</p>

                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Turf:</span> {coaching.turf?.name} ({coaching.turf?.city})
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Coach:</span> {coaching.coachName}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Sport:</span> {coaching.sportsType}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Timings:</span> {coaching.startTime} - {coaching.endTime}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Days:</span> {coaching.daysOfWeek.join(", ")}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Students:</span> {coaching.currentStudents}/{coaching.maxStudents}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Fee:</span> ₹{coaching.monthlyFee}/month
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <button
                                        className={`btn w-full ${coaching.status === "active" ? "btn-warning" : "btn-success"}`}
                                        onClick={() => handleToggleStatus(coaching._id)}
                                    >
                                        {coaching.status === "active" ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        className="btn btn-error w-full"
                                        onClick={() => handleDelete(coaching._id)}
                                    >
                                        Delete Class
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">You haven't created any coaching classes yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachingList;
