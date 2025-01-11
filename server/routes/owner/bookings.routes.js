import express from "express";
import { getOwnerBookings, bookTurfForUser, getBookingsByTurfAndDate, createOrder, verifyPayment } from "../../controllers/owner/booking.controller.js";
import verifyOwnerToken from "../../middleware/jwt/owner.middleware.js";

const bookingsRouter = express.Router();
bookingsRouter.get("/", verifyOwnerToken, getOwnerBookings);
bookingsRouter.post("/create-order", verifyOwnerToken, createOrder);
bookingsRouter.post("/verify-payment", verifyOwnerToken, verifyPayment);

bookingsRouter.post('/get-booking-by-date', verifyOwnerToken, getBookingsByTurfAndDate)
export default bookingsRouter;