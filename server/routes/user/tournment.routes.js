import { Router } from "express";
import {
  registerTeam,
  getTournaments,
  getTournamentById,
} from "../../controllers/user/tournment.controller.js";
import verifyUserToken from "../../middleware/jwt/user.middleware.js";

const tournamentRouter = Router();

// Route for admin to create a tournament

tournamentRouter.post("/register", verifyUserToken, registerTeam);
tournamentRouter.get("/all", getTournaments);
tournamentRouter.get("/:tournamentId", getTournamentById); // New route for getting tournament by ID

export default tournamentRouter;
