import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../hooks/useAxiosInstance";
import { MapPin, Phone, User, Calendar, Clock, Trophy, CheckCircle, Send } from "lucide-react";
import { useSelector } from "react-redux";

const CoachingDetails = () => {
    const { coachingId } = useParams();
    const [coaching, setCoaching] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [enquirySent, setEnquirySent] = useState(false);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        studentName: "",
        studentAge: "",
        message: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchCoachingDetails = async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/user/coaching/details/${coachingId}`
                );
                setCoaching(response.data);
            } catch (error) {
                console.error("Error fetching coaching details:", error);
                setError("Failed to load coaching details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoachingDetails();
    }, [coachingId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEnquiry = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Please login to send an enquiry");
            return;
        }

        setSubmitting(true);
        try {
            await axiosInstance.post(`/api/user/coaching/enquiry/${coachingId}`, formData);
            setEnquirySent(true);
            alert("Enquiry sent successfully! The coach will contact you soon.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send enquiry");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (error) return <div className="text-center py-20 text-error">{error}</div>;
    if (!coaching) return null;

    return (
        <div className="container mx-auto p-4 lg:p-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-base-200">
                        <img
                            src={coaching.turf?.image || "/banner3.jpg"}
                            alt={coaching.name}
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="badge badge-primary font-bold px-4 py-3">{coaching.sportsType}</span>
                                <span className="badge badge-outline badge-secondary font-bold px-4 py-3">6 Months Program</span>
                            </div>
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{coaching.name}</h2>
                            <div className="flex items-center text-gray-600 mb-6">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                <span className="text-lg font-medium">{coaching.turf?.name}, {coaching.turf?.city}</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {coaching.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-base-200/30 p-5 rounded-xl border border-base-200">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-primary" /> Schedule
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-semibold">{coaching.startTime} - {coaching.endTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Days:</span>
                                            <span className="font-semibold">{coaching.daysOfWeek.join(", ")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-base-200/30 p-5 rounded-xl border border-base-200">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-primary" /> Coach Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Coach:</span>
                                            <span className="font-semibold">{coaching.coachName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Students:</span>
                                            <span className="font-semibold">{coaching.currentStudents}/{coaching.maxStudents}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {coaching.includes && coaching.includes.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-primary" /> What's Included
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {coaching.includes.map((item, idx) => (
                                            <span key={idx} className="bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-lg text-sm font-medium">
                                                ✓ {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enquiry Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-base-200 p-6">
                        <div className="text-center mb-6">
                            <span className="text-gray-500 uppercase font-black text-xs tracking-widest">Enrollment Fee</span>
                            <div className="text-4xl font-black text-primary mb-1">₹{coaching.monthlyFee}</div>
                            <span className="text-gray-500 text-sm">per month</span>
                        </div>

                        {enquirySent ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 text-center space-y-4">
                                <CheckCircle className="w-12 h-12 mx-auto" />
                                <h3 className="font-bold text-xl">Enquiry Sent!</h3>
                                <p>We've received your enquiry. The coach will reach out to you within 24-48 hours.</p>
                                <button
                                    className="btn btn-outline btn-success w-full"
                                    onClick={() => setEnquirySent(false)}
                                >
                                    Send another enquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEnquiry} className="space-y-4">
                                <h3 className="font-bold text-gray-800 text-xl border-b pb-3 mb-4">Send Enquiry</h3>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Student Name</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        placeholder="Enter student name"
                                        className="input input-bordered w-full mt-1"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Student Age</label>
                                    <input
                                        type="number"
                                        name="studentAge"
                                        placeholder="e.g. 12"
                                        className="input input-bordered w-full mt-1"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        placeholder="Enter phone number"
                                        className="input input-bordered w-full mt-1"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Additional Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Any specific questions?"
                                        className="textarea textarea-bordered w-full mt-1"
                                        onChange={handleChange}
                                        rows={3}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary w-full mt-4 h-14 text-lg font-bold shadow-lg shadow-primary/20"
                                >
                                    {submitting ? "Sending..." : "Send Enquiry Now"}
                                    {!submitting && <Send className="w-5 h-5 ml-2" />}
                                </button>

                                {!isLoggedIn && (
                                    <p className="text-xs text-center text-error mt-2 font-medium">
                                        Note: You must be logged in to send an enquiry.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachingDetails;
