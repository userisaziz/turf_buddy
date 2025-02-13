import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import axiosInstance from "../../hooks/useAxiosInstance";

const TournamentRegistration = () => {
  const { tournamentId } = useParams();
  const [teamName, setTeamName] = useState("");
  const [phone, setPhone] = useState(""); // New state for phone
  const [maxPlayersInTeam, setMaxPlayersInTeam] = useState(0);
  const [members, setMembers] = useState([]);
  // const [userId, setUserId] = useState(""); // Assuming you have a way to get the current user's ID

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/user/tournaments/${tournamentId}`
        );
        setMaxPlayersInTeam(response.data.maxPlayersInTeam);
        // Initialize members array based on max players
        setMembers(Array(response.data.maxPlayersInTeam).fill(""));
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      }
    };

    fetchTournamentDetails();
  }, [tournamentId]);

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create a new team with all required fields
      const teamResponse = await axiosInstance.post(
        `/api/user/tournaments/register`,
        {
          name: teamName,
          phoneNumber: phone, // Include phone number
          members, // Send the array of member names
          tournamentId: tournamentId, // Reference to the tournament
          // createdBy: userId, // Reference to the user creating the team
        }
      );

      // Now register the team for the tournament using the newly created team ID
      await axiosInstance.post(
        `/api/user/tournaments/register/${tournamentId}`,
        {
          teamId: teamResponse.data._id, // Use the newly created team's ID
        }
      );

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
          placeholder="Team Name"
          className="input input-bordered w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input input-bordered w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <h3 className="text-lg font-semibold mt-4">Team Members:</h3>
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Member ${index + 1} Name`}
            className="input input-bordered w-full"
            value={member}
            onChange={(e) => handleMemberChange(index, e.target.value)}
            required
          />
        ))}
        <button type="submit" className="btn btn-primary w-full">
          Register Team
        </button>
      </form>
      <p className="mt-2 text-gray-600">
        Max Players Allowed: {maxPlayersInTeam}
      </p>
    </div>
  );
};

export default TournamentRegistration;
