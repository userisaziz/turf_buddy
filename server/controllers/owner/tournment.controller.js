import Tournament from "../../models/tournament.model.js";
import Turf from "../../models/turf.model.js";

// Create a new tournament
export const createTournament = async (req, res) => {
    try {
        const ownerId = req.owner.id;

        // Verify the turf belongs to this owner
        if (req.body.turf) {
            const turf = await Turf.findOne({ _id: req.body.turf, owner: ownerId });
            if (!turf) {
                return res.status(404).json({ message: "Turf not found or doesn't belong to you" });
            }
        }

        const tournament = new Tournament({
            ...req.body,
            owner: ownerId,
            createdBy: "owner"
        });

        await tournament.save();
        res.status(201).json({ success: true, message: "Tournament created successfully", tournament });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tournaments for the owner
export const getOwnerTournaments = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const tournaments = await Tournament.find({ owner: ownerId })
            .populate("turf", "name image city")
            .populate("teams")
            .sort({ createdAt: -1 });

        res.status(200).json(tournaments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get single tournament details
export const getTournamentById = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const ownerId = req.owner.id;

        const tournament = await Tournament.findOne({ _id: tournamentId, owner: ownerId })
            .populate("turf", "name image city")
            .populate("teams");

        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        res.status(200).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Approve registration
export const approveRegistration = async (req, res) => {
    const { tournamentId, teamId } = req.params;
    const ownerId = req.owner.id;

    try {
        const tournament = await Tournament.findOne({ _id: tournamentId, owner: ownerId });
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        const registration = tournament.pendingRegistrations.find(
            (reg) => reg.teamId.toString() === teamId && reg.status === "pending"
        );

        if (!registration) {
            return res.status(404).json({ message: "Registration request not found" });
        }

        if (tournament.currentNumTeams < tournament.maxNumTeams) {
            registration.status = "approved";
            tournament.teams.push(teamId);
            tournament.currentNumTeams += 1;
            await tournament.save();
            res.status(200).json({ message: "Registration approved successfully" });
        } else {
            return res.status(400).json({ message: "Maximum number of teams reached" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject registration
export const rejectRegistration = async (req, res) => {
    const { tournamentId, teamId } = req.params;
    const ownerId = req.owner.id;

    try {
        const tournament = await Tournament.findOne({ _id: tournamentId, owner: ownerId });
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        const registration = tournament.pendingRegistrations.find(
            (reg) => reg.teamId.toString() === teamId && reg.status === "pending"
        );

        if (!registration) {
            return res.status(404).json({ message: "Registration request not found" });
        }

        registration.status = "rejected";
        await tournament.save();
        res.status(200).json({ message: "Registration rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Disable tournament
export const disableTournament = async (req, res) => {
    const { tournamentId } = req.params;
    const ownerId = req.owner.id;

    try {
        const tournament = await Tournament.findOneAndUpdate(
            { _id: tournamentId, owner: ownerId },
            { status: "disabled" },
            { new: true }
        );
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json({ message: "Tournament disabled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete tournament
export const deleteTournament = async (req, res) => {
    const { tournamentId } = req.params;
    const ownerId = req.owner.id;

    try {
        const tournament = await Tournament.findOneAndDelete({ _id: tournamentId, owner: ownerId });
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
