import express from "express";
import { getOwnerBookings, bookTurfForUser,verifyTimeSlotAvailability, getBookingsByTurfAndDate, createOrder, verifyPayment, deleteBooking } from "../../controllers/owner/booking.controller.js";
import verifyOwnerToken from "../../middleware/jwt/owner.middleware.js";

const bookingsRouter = express.Router();
bookingsRouter.get("/", verifyOwnerToken, getOwnerBookings);
bookingsRouter.get("/verify-timeSlots", verifyOwnerToken, verifyTimeSlotAvailability);
bookingsRouter.post("/create-order", verifyOwnerToken, createOrder);
bookingsRouter.post("/verify-payment", verifyOwnerToken, verifyPayment);

bookingsRouter.post('/get-booking-by-date', verifyOwnerToken, getBookingsByTurfAndDate)
bookingsRouter.post('/delete', verifyOwnerToken, deleteBooking);

export default bookingsRouter;