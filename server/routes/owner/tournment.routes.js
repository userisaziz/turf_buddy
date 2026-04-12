import { Router } from "express";
import {
    createTournament,
    getOwnerTournaments,
    getTournamentById,
    approveRegistration,
    rejectRegistration,
    disableTournament,
    deleteTournament,
} from "../../controllers/owner/tournment.controller.js";
import verifyOwnerToken from "../../middleware/jwt/owner.middleware.js";

const tournamentRouter = Router();

// All routes are protected and require owner authentication
tournamentRouter.use(verifyOwnerToken);

tournamentRouter.post("/create", createTournament);
tournamentRouter.get("/all", getOwnerTournaments);
tournamentRouter.get("/details/:tournamentId", getTournamentById);
tournamentRouter.post("/:tournamentId/approve/:teamId", approveRegistration);
tournamentRouter.post("/:tournamentId/reject/:teamId", rejectRegistration);
tournamentRouter.patch("/disable/:tournamentId", disableTournament);
tournamentRouter.delete("/:tournamentId", deleteTournament);

export default tournamentRouter;
