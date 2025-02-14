import React, { useState, useEffect } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";
import useTurfData from "@hooks/admin/useTurf";

const CreateTournament = () => {
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

  const { turfData, loading } = useTurfData();

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
        "/api/admin/tournaments/create",
        tournamentData
      );
      alert("Tournament created successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Error creating tournament: " + error.response.data.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Create Tournament
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
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
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>

        {/* Description (Rich Text) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter tournament description"
            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-500"
            rows={4} // Adjust the number of rows as needed
            onChange={handleChange}
            required
          />
        </div>

        {/* Manager Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Manager Name
            </label>
            <input
              type="text"
              name="managerName"
              placeholder="Enter manager name"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter manager phone"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Registration Fees and Sports Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Registration Fees
            </label>
            <input
              type="number"
              name="registrationFees"
              placeholder="Enter registration fees"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Sports Type
            </label>
            <input
              type="text"
              name="sportsType"
              placeholder="Enter sports type"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Date and Timings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tournament Date
            </label>
            <input
              type="date"
              name="date"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter timings"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
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
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>

        {/* Max Teams and Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Max Number of Teams
            </label>
            <input
              type="number"
              name="maxNumTeams"
              placeholder="Enter max number of teams"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter max players in team"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Prize Money */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              1st Place Prize
            </label>
            <input
              type="number"
              name="prizeMoney.first"
              placeholder="Enter prize for 1st place"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              2nd Place Prize
            </label>
            <input
              type="number"
              name="prizeMoney.second"
              placeholder="Enter prize for 2nd place"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              3rd Place Prize
            </label>
            <input
              type="number"
              name="prizeMoney.third"
              placeholder="Enter prize for 3rd place"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
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
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          >
            <option value="">Select Turf</option>
            {!loading &&
              turfData?.map((turf) => (
                <option key={turf._id} value={turf._id}>
                  {turf.name}
                </option>
              ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;
