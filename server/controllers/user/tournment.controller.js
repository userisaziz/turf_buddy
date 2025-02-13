import Team from "../../models/team.model.js";
import Tournament from "../../models/tournament.model.js";

// Controller to register a team in a tournament
export const registerTeam = async (req, res) => {
  const userId = req.user.user;
  const createdBy = userId;
  //   const { tournamentId } = req.params;
  const { name, phoneNumber, members, tournamentId } = req.body; // Include all necessary fields

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Check if the team is already registered or pending
    const existingTeam = await Team.findOne({ name, phoneNumber });
    if (existingTeam) {
      const isAlreadyRegistered = tournament.teams.includes(existingTeam._id);
      const isPending = tournament.pendingRegistrations.some(
        (registration) =>
          registration.teamId.toString() === existingTeam._id.toString() &&
          registration.status === "pending"
      );

      if (isAlreadyRegistered || isPending) {
        return res
          .status(400)
          .json({ message: "Team is already registered or pending approval" });
      }
    }

    // Create a new team
    const newTeam = new Team({
      name,
      phoneNumber,
      members,
      tournament: tournamentId, // Reference to the tournament
      createdBy, // Reference to the user creating the team
    });

    const savedTeam = await newTeam.save();

    // Add the registration request to pending registrations
    tournament.pendingRegistrations.push({
      teamId: savedTeam._id,
      requestedBy: createdBy,
    });
    await tournament.save();

    res.status(200).json({
      message: "Registration request submitted successfully",
      teamId: savedTeam._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate("teams");
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTournamentById = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId).populate(
      "teams"
    );
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
