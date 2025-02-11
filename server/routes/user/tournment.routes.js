import { Router } from "express";
import {
  registerTeam,
  getTournaments,
} from "../../controllers/user/tournment.controller.js";

const tournamentRouter = Router();

// Route for admin to create a tournament

tournamentRouter.post("/register/:tournamentId", registerTeam);
tournamentRouter.get("/all", getTournaments);

export default tournamentRouter;
