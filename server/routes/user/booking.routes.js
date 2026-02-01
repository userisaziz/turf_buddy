import { Router } from "express";
import {
  verifyPayment,
  createOrder,
  getBookings,
  verifyTimeSlotAvailability,
} from "../../controllers/user/booking.controller.js";
import verifyUserToken from "../../middleware/jwt/user.middleware.js";

const bookingRouter = Router();

bookingRouter.post("/create-order", verifyUserToken, createOrder);
bookingRouter.post("/verify-payment", verifyUserToken, verifyPayment);
bookingRouter.get("/get-bookings", verifyUserToken, getBookings);
bookingRouter.post("/verify-timeslot", verifyUserToken, verifyTimeSlotAvailability);

// Fixed schedule routes
import { checkFixedScheduleConflict, getFixedSchedulesByDateRange } from "../../controllers/user/fixedSchedule.controller.js";
bookingRouter.post("/check-fixed-schedule-conflict", verifyUserToken, checkFixedScheduleConflict);
bookingRouter.post("/get-fixed-schedules-by-date-range", verifyUserToken, getFixedSchedulesByDateRange);


export default bookingRouter;
