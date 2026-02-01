import express from "express";
import {
  createFixedSchedule,
  getFixedSchedulesByTurf,
  getAllFixedSchedules,
  updateFixedSchedule,
  deleteFixedSchedule,
  checkFixedScheduleConflict,
  getFixedSchedulesByDateRange,
} from "../../controllers/owner/fixedSchedule.controller.js";
import verifyOwnerToken from "../../middleware/jwt/owner.middleware.js";

const fixedScheduleRouter = express.Router();

// Create a new fixed schedule
fixedScheduleRouter.post("/", verifyOwnerToken, createFixedSchedule);

// Get all fixed schedules for a specific turf
fixedScheduleRouter.get("/turf/:turfId", verifyOwnerToken, getFixedSchedulesByTurf);

// Get all fixed schedules for the owner
fixedScheduleRouter.get("/", verifyOwnerToken, getAllFixedSchedules);

// Update a fixed schedule
fixedScheduleRouter.put("/:scheduleId", verifyOwnerToken, updateFixedSchedule);

// Delete a fixed schedule
fixedScheduleRouter.delete("/:scheduleId", verifyOwnerToken, deleteFixedSchedule);

// Check if a time slot conflicts with fixed schedules
fixedScheduleRouter.post("/check-conflict", verifyOwnerToken, checkFixedScheduleConflict);

// Get fixed schedules for a date range
fixedScheduleRouter.post("/by-date-range", verifyOwnerToken, getFixedSchedulesByDateRange);

export default fixedScheduleRouter;