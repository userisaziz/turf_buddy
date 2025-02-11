import {
  createTournament,
  getTournaments,
} from "../../controllers/admin/tournment.controller.js";
import { Router } from "express";
const tournamentRouter = Router();

// Route for admin to create a tournament
tournamentRouter.post("/create", createTournament);
tournamentRouter.get("/all", getTournaments);

export default tournamentRouter;
