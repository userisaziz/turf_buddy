import React, { useState } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";

const CreateTournament = () => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    description: "",
    managerName: "",
    managerPhone: "",
    registrationFees: "",
    sportsType: "",
    date: "",
    timings: "", // New field for timings
    lastRegistrationDate: "", // New field for last registration date
    maxNumTeams: "",
    maxPlayersInTeam: "",
    prizeMoney: {
      first: "",
      second: "",
      third: "",
    },
  });

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
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Create Tournament</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="managerName"
          placeholder="Manager Name"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="managerPhone"
          placeholder="Manager Phone"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="registrationFees"
          placeholder="Registration Fees"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sportsType"
          placeholder="Sports Type"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="timings"
          placeholder="Timings"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="lastRegistrationDate"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="maxNumTeams"
          placeholder="Max Number of Teams"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="maxPlayersInTeam"
          placeholder="Max Players in Team"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="prizeMoney.first"
          placeholder="Prize Money for 1st Place"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="prizeMoney.second"
          placeholder="Prize Money for 2nd Place"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="prizeMoney.third"
          placeholder="Prize Money for 3rd Place"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;
