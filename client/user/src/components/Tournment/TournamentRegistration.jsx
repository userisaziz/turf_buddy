import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TournamentRegistration = () => {
  const { tournamentId } = useParams();
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/tournaments/register/${tournamentId}`, {
        teamId,
        teamName,
      });
      alert("Successfully registered for the tournament!");
    } catch (error) {
      alert(
        "Error registering for the tournament: " + error.response.data.message
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Register for Tournament
      </h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Team ID"
          className="input input-bordered w-full"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Team Name"
          className="input input-bordered w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Register Team
        </button>
      </form>
    </div>
  );
};

export default TournamentRegistration;
