import Tournament from "../../models/tournament.model.js";

// Controller to create a tournament
export const createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
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
export const approveRegistration = async (req, res) => {
  const { tournamentId, teamId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const registration = tournament.pendingRegistrations.find(
      (reg) => reg.teamId.toString() === teamId && reg.status === "pending"
    );

    if (!registration) {
      return res
        .status(404)
        .json({ message: "Registration request not found" });
    }

    // Check if the current number of teams is less than the maximum allowed
    if (tournament.currentNumTeams < tournament.maxNumTeams) {
      // Approve the registration
      registration.status = "approved";
      tournament.teams.push(teamId); // Add the team to the tournament
      tournament.currentNumTeams += 1; // Increment the current number of teams
      await tournament.save();
      res.status(200).json({ message: "Registration approved successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Maximum number of teams reached" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectRegistration = async (req, res) => {
  const { tournamentId, teamId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const registration = tournament.pendingRegistrations.find(
      (reg) => reg.teamId.toString() === teamId && reg.status === "pending"
    );

    if (!registration) {
      return res
        .status(404)
        .json({ message: "Registration request not found" });
    }

    // Reject the registration
    registration.status = "rejected";
    await tournament.save();
    res.status(200).json({ message: "Registration rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch pending registration requests for a tournament
export const getPendingRegistrations = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId)
      .populate({
        path: "pendingRegistrations.requestedBy", // Populate the requestedBy field
        select: "name phone", // Select only the name and phone fields
      })
      .populate({
        path: "pendingRegistrations.teamId", // Populate the teamId field to get team details
        select: "name", // Select only the name field from the Team model
      });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Map the pending registrations to include user and team details
    const pendingRegistrationsWithDetails = tournament.pendingRegistrations.map(
      (reg) => ({
        teamId: reg.teamId._id, // Get the team ID
        teamName: reg.teamId.name, // Get the team name
        status: reg.status,
        requestedBy: {
          name: reg.requestedBy.name,
          phone: reg.requestedBy.phone,
        },
      })
    );

    // Return the pending registrations with user and team details
    res
      .status(200)
      .json({ pendingRegistrations: pendingRegistrationsWithDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disableTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    tournament.status = "disabled"; // Assuming you have a status field
    await tournament.save();
    res.status(200).json({ message: "Tournament disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a tournament
export const deleteTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findByIdAndDelete(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
