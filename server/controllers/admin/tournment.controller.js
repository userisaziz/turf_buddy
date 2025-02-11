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
