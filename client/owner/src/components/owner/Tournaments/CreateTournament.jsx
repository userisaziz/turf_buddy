import React, { useState, useEffect } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";
import useTurfManagement from "../../../hooks/owner/useTurfManagement";
import SportsTypeSelector from "../../common/SportsTypeSelector";

const CreateTournament = ({ onSuccess }) => {
    const [tournamentData, setTournamentData] = useState({
        name: "",
        description: "",
        managerName: "",
        managerPhone: "",
        registrationFees: "",
        sportsType: "",
        date: "",
        timings: "",
        lastRegistrationDate: "",
        maxNumTeams: "",
        maxPlayersInTeam: "",
        prizeMoney: {
            first: "",
            second: "",
            third: "",
        },
        turf: "",
    });

    const { turfs, isLoading, fetchTurfs } = useTurfManagement();

    useEffect(() => {
        fetchTurfs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("prizeMoney.")) {
            const prizeKey = name.split(".")[1];
            setTournamentData((prevData) => ({
                ...prevData,
                prizeMoney: { ...prevData.prizeMoney, [prizeKey]: value },
            }));
        } else {
            setTournamentData({ ...tournamentData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                "/api/owner/tournaments/create",
                tournamentData
            );
            alert("Tournament created successfully!");
            if (onSuccess) onSuccess();
        } catch (error) {
            alert("Error creating tournament: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create Tournament
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-base-200"
            >
                {/* Tournament Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Tournament Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter tournament name"
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary"
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
                        placeholder="Enter tournament description"
                        className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary"
                        rows={3}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Manager Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Manager Name
                        </label>
                        <input
                            type="text"
                            name="managerName"
                            placeholder="Enter name"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Manager Phone
                        </label>
                        <input
                            type="text"
                            name="managerPhone"
                            placeholder="Enter phone"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Registration Fees and Sports Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Registration Fees (₹)
                        </label>
                        <input
                            type="number"
                            name="registrationFees"
                            placeholder="Fee"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <SportsTypeSelector
                        value={tournamentData.sportsType}
                        onChange={(value) =>
                            setTournamentData({ ...tournamentData, sportsType: value })
                        }
                    />
                </div>

                {/* Date and Timings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Tournament Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Timings
                        </label>
                        <input
                            type="text"
                            name="timings"
                            placeholder="e.g. 9 AM - 5 PM"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Last Registration Date */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Last Registration Date
                    </label>
                    <input
                        type="date"
                        name="lastRegistrationDate"
                        className="input input-bordered w-full"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Max Teams and Players */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Max Number of Teams
                        </label>
                        <input
                            type="number"
                            name="maxNumTeams"
                            placeholder="Total Teams"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Max Players in Team
                        </label>
                        <input
                            type="number"
                            name="maxPlayersInTeam"
                            placeholder="Players per Team"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Prize Money */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            1st Prize (₹)
                        </label>
                        <input
                            type="number"
                            name="prizeMoney.first"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            2nd Prize (₹)
                        </label>
                        <input
                            type="number"
                            name="prizeMoney.second"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            3rd Prize (₹)
                        </label>
                        <input
                            type="number"
                            name="prizeMoney.third"
                            className="input input-bordered w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Turf Selection */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Select Turf
                    </label>
                    <select
                        name="turf"
                        className="select select-bordered w-full"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Turf</option>
                        {!isLoading &&
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
                    className="btn btn-primary w-full shadow-lg"
                >
                    Create Tournament
                </button>
            </form>
        </div>
    );
};

export default CreateTournament;
