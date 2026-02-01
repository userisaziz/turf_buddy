import React, { useState } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";
import useTurfManagement from "@hooks/owner/useTurfManagement";
import { useEffect } from "react";
import SportsTypeSelector from "../../common/SportsTypeSelector";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CreateCoaching = () => {
    const [coachingData, setCoachingData] = useState({
        name: "",
        description: "",
        coachName: "",
        coachPhone: "",
        coachEmail: "",
        sportsType: "",
        startTime: "",
        endTime: "",
        daysOfWeek: [],
        startDate: "",
        termDuration: 6,
        monthlyFee: "",
        registrationFee: "",
        maxStudents: "",
        ageGroup: {
            minAge: "",
            maxAge: ""
        },
        includes: [],
        turf: ""
    });

    const [includeInput, setIncludeInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { turfs, isLoading: turfLoading, fetchTurfs } = useTurfManagement();

    useEffect(() => {
        fetchTurfs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("ageGroup.")) {
            const ageKey = name.split(".")[1];
            setCoachingData((prevData) => ({
                ...prevData,
                ageGroup: { ...prevData.ageGroup, [ageKey]: value },
            }));
        } else {
            setCoachingData({ ...coachingData, [name]: value });
        }
    };

    const handleDayToggle = (day) => {
        setCoachingData((prev) => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const handleAddInclude = () => {
        if (includeInput.trim()) {
            setCoachingData((prev) => ({
                ...prev,
                includes: [...prev.includes, includeInput.trim()]
            }));
            setIncludeInput("");
        }
    };

    const handleRemoveInclude = (index) => {
        setCoachingData((prev) => ({
            ...prev,
            includes: prev.includes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (coachingData.daysOfWeek.length === 0) {
            alert("Please select at least one day of the week");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post(
                "/api/owner/coaching/create",
                coachingData
            );
            alert("Coaching class created successfully!");
            console.log(response.data);
            // Reset form
            setCoachingData({
                name: "",
                description: "",
                coachName: "",
                coachPhone: "",
                coachEmail: "",
                sportsType: "",
                startTime: "",
                endTime: "",
                daysOfWeek: [],
                startDate: "",
                termDuration: 6,
                monthlyFee: "",
                registrationFee: "",
                maxStudents: "",
                ageGroup: { minAge: "", maxAge: "" },
                includes: [],
                turf: ""
            });
        } catch (error) {
            alert("Error creating coaching: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Create Coaching Class
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
            >
                {/* Coaching Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Coaching Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g., Junior Football Training"
                        value={coachingData.name}
                        className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Describe what students will learn..."
                        value={coachingData.description}
                        className="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Coach Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Coach Name
                        </label>
                        <input
                            type="text"
                            name="coachName"
                            placeholder="Enter coach name"
                            value={coachingData.coachName}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Coach Phone
                        </label>
                        <input
                            type="text"
                            name="coachPhone"
                            placeholder="Enter phone number"
                            value={coachingData.coachPhone}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Coach Email
                        </label>
                        <input
                            type="email"
                            name="coachEmail"
                            placeholder="Enter email (optional)"
                            value={coachingData.coachEmail}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Sports Type */}
                <SportsTypeSelector
                  value={coachingData.sportsType}
                  onChange={(value) =>
                    setCoachingData({ ...coachingData, sportsType: value })
                  }
                  name="sportsType"
                />

                {/* Time Slot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Start Time
                        </label>
                        <input
                            type="time"
                            name="startTime"
                            value={coachingData.startTime}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            End Time
                        </label>
                        <input
                            type="time"
                            name="endTime"
                            value={coachingData.endTime}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Days of Week */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${coachingData.daysOfWeek.includes(day)
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                                    }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Term Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={coachingData.startDate}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Term Duration (Months)
                        </label>
                        <select
                            name="termDuration"
                            value={coachingData.termDuration}
                            className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        >
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months</option>
                            <option value={12}>12 Months</option>
                        </select>
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Monthly Fee (₹)
                        </label>
                        <input
                            type="number"
                            name="monthlyFee"
                            placeholder="Enter monthly fee"
                            value={coachingData.monthlyFee}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Registration Fee (₹)
                        </label>
                        <input
                            type="number"
                            name="registrationFee"
                            placeholder="Enter registration fee (optional)"
                            value={coachingData.registrationFee}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Capacity and Age */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Max Students
                        </label>
                        <input
                            type="number"
                            name="maxStudents"
                            placeholder="e.g., 20"
                            value={coachingData.maxStudents}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Min Age
                        </label>
                        <input
                            type="number"
                            name="ageGroup.minAge"
                            placeholder="e.g., 8"
                            value={coachingData.ageGroup.minAge}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Max Age
                        </label>
                        <input
                            type="number"
                            name="ageGroup.maxAge"
                            placeholder="e.g., 16"
                            value={coachingData.ageGroup.maxAge}
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* What's Included */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        What's Included
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="e.g., Training equipment, Jersey"
                            value={includeInput}
                            className="input input-bordered flex-1 focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setIncludeInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                        />
                        <button
                            type="button"
                            onClick={handleAddInclude}
                            className="btn btn-primary"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {coachingData.includes.map((item, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInclude(index)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Turf Selection */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Select Turf
                    </label>
                    <select
                        name="turf"
                        value={coachingData.turf}
                        className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Turf</option>
                        {!turfLoading &&
                            turfs?.map((turf) => (
                                <option key={turf._id} value={turf._id}>
                                    {turf.name} - {turf.city}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Coaching Class"}
                </button>
            </form>
        </div>
    );
};

export default CreateCoaching;
