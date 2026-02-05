import React, { useEffect, useState } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";

const CoachingEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnquiries = async () => {
        try {
            const response = await axiosInstance.get("/api/owner/coaching/enquiries/all");
            setEnquiries(response.data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleUpdateStatus = async (enquiryId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/owner/coaching/enquiries/${enquiryId}`, {
                status: newStatus
            });
            setEnquiries((prev) =>
                prev.map((enq) =>
                    enq._id === enquiryId ? { ...enq, status: newStatus } : enq
                )
            );
            alert(`Enquiry marked as ${newStatus}`);
        } catch (error) {
            alert("Error updating status: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="text-center py-10">Loading enquiries...</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Student Enquiries
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                {enquiries.length > 0 ? (
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th>Student/User</th>
                                <th>Coaching Class</th>
                                <th>Contact Details</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map((enq) => (
                                <tr key={enq._id} className="hover:bg-gray-50">
                                    <td>
                                        <div className="font-bold">{enq.studentName || enq.name}</div>
                                        <div className="text-xs text-gray-500">Age: {enq.studentAge || "N/A"}</div>
                                        <div className="text-xs italic">User: {enq.user?.name}</div>
                                    </td>
                                    <td>
                                        <div className="font-semibold text-blue-600">{enq.coaching?.name}</div>
                                        <div className="text-xs">{enq.coaching?.sportsType}</div>
                                    </td>
                                    <td>
                                        <div>{enq.phone}</div>
                                        <div className="text-sm text-gray-500">{enq.email}</div>
                                    </td>
                                    <td>
                                        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={enq.message}>
                                            {enq.message}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge border-none font-semibold ${enq.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                enq.status === "contacted" ? "bg-blue-100 text-blue-800" :
                                                    enq.status === "enrolled" ? "bg-green-100 text-green-800" :
                                                        "bg-red-100 text-red-800"
                                            }`}>
                                            {enq.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1 flex-wrap">
                                            {enq.status === "pending" && (
                                                <button
                                                    className="btn btn-xs btn-outline btn-info"
                                                    onClick={() => handleUpdateStatus(enq._id, "contacted")}
                                                >
                                                    Mark Contacted
                                                </button>
                                            )}
                                            {(enq.status === "pending" || enq.status === "contacted") && (
                                                <button
                                                    className="btn btn-xs btn-outline btn-success"
                                                    onClick={() => handleUpdateStatus(enq._id, "enrolled")}
                                                >
                                                    Enroll
                                                </button>
                                            )}
                                            {enq.status !== "rejected" && enq.status !== "enrolled" && (
                                                <button
                                                    className="btn btn-xs btn-outline btn-error"
                                                    onClick={() => handleUpdateStatus(enq._id, "rejected")}
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No enquiries received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachingEnquiries;
