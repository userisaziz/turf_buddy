import {
  createTournament,
  getTournaments,
  approveRegistration,
  rejectRegistration,
  getPendingRegistrations,
  deleteTournament,
  disableTournament,
} from "../../controllers/admin/tournment.controller.js";
import { Router } from "express";
const tournamentRouter = Router();

// Route for admin to create a tournament
tournamentRouter.post("/create", createTournament);
tournamentRouter.get("/all", getTournaments);
tournamentRouter.get("/:tournamentId", getPendingRegistrations);

// Route to approve a registration request
tournamentRouter.post("/:tournamentId/approve/:teamId", approveRegistration);

// Route to reject a registration request
tournamentRouter.post("/:tournamentId/reject/:teamId", rejectRegistration);
tournamentRouter.patch(
  "/:tournamentId/disable",

  disableTournament
);

// New route for deleting a tournament
tournamentRouter.delete("/:tournamentId", deleteTournament);

export default tournamentRouter;
