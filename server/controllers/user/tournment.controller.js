import Team from "../../models/team.model.js";
import Tournament from "../../models/tournament.model.js";

// Controller to register a team in a tournament

export const registerTeam = async (req, res) => {
  const { tournamentId } = req.params;
  const { teamId } = req.body;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.teams.length >= tournament.maxNumTeams) {
      return res
        .status(400)
        .json({ message: "Maximum number of teams reached" });
    }

    tournament.teams.push(teamId);
    await tournament.save();
    res.status(200).json(tournament);
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
export const disableTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    tournament.status = "disabled"; // Set the status to disabled
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
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    await tournament.remove(); // Remove the tournament from the database
    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
