import adjustTime from "../../utils/adjustTime.js";
import razorpay from "../../config/razorpay.js";
import crypto from "crypto";
import Booking from "../../models/booking.model.js";
import TimeSlot from "../../models/timeSlot.model.js";
import generateQRCode from "../../utils/generateQRCode.js";
import Turf from "../../models/turf.model.js";
import generateEmail, {
  generateHTMLContent,
} from "../../utils/generateEmail.js";
import User from "../../models/user.model.js";
import { format, parseISO } from "date-fns";
import nodemailer from "nodemailer";
import logger from "../../config/logging.js";
import mongoose from "mongoose";

export const verifyTimeSlotAvailability = async (req, res) => {
  const userId = req.user.user;
  const { turfId, startTime, endTime, selectedTurfDate } = req.body;

  try {
    // Adjust the start and end times as per the selected turf date
    const adjustedStartTime = adjustTime(startTime, selectedTurfDate);
    const adjustedEndTime = adjustTime(endTime, selectedTurfDate);

    // Check if the time slot is already booked
    const existingTimeSlot = await TimeSlot.findOne({
      turf: turfId,
      startTime: adjustedStartTime,
      endTime: adjustedEndTime,
    });

    if (existingTimeSlot) {
      logger.info("Time slot unavailable", {
        turfId,
        adjustedStartTime,
        adjustedEndTime,
      });
      return res.status(400).json({
        success: false,
        message: "Time slot already booked. Please choose another time.",
      });
    }

    logger.info("Time slot available", {
      turfId,
      adjustedStartTime,
      adjustedEndTime,
    });
    return res.status(200).json({
      success: true,
      message: "Time slot is available for booking.",
    });
  } catch (error) {
    logger.error("Error in verifyTimeSlotAvailability", {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking the time slot.",
    });
  }
};

export const createOrder = async (req, res) => {
  const userId = req.user.user;
  try {
    const { totalPrice } = req.body;
    logger.info("createOrder request body", { body: req.body });

    const user = await User.findById(userId).select("name email");
    if (!user) {
      logger.error("User not found", { userId });
      return res.status(400).json({ message: "User not found" });
    }

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    logger.info("Order created", { orderId: order.id, userId });

    return res.status(200).json({ order, user });
  } catch (error) {
    logger.error("Error in createOrder", { error: error.message });
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const userId = req.user.user;
  logger.info("verifyPayment request body", { body: req.body });

  const {
    id: turfId,
    duration,
    startTime,
    endTime,
    selectedTurfDate,
    totalPrice,
    paymentId,
    orderId,
    razorpay_signature,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const formattedStartTime = format(parseISO(startTime), "hh:mm a");
    const formattedEndTime = format(parseISO(endTime), "hh:mm a");
    const formattedDate = format(parseISO(selectedTurfDate), "d MMM yyyy");

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== razorpay_signature) {
      logger.error("Payment Verification Failed", { orderId, paymentId });
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Payment Verification Failed" });
    }

    const adjustedStartTime = adjustTime(startTime, selectedTurfDate);
    const adjustedEndTime = adjustTime(endTime, selectedTurfDate);

    const existingTimeSlot = await TimeSlot.findOne({
      turf: turfId,
      startTime: adjustedStartTime,
      endTime: adjustedEndTime,
    }).session(session);

    if (existingTimeSlot) {
      logger.error("Time slot already booked", {
        turfId,
        adjustedStartTime,
        adjustedEndTime,
      });

      // Initiating refund
      await razorpay.payments.refund(paymentId, {
        amount: totalPrice * 100,
      });
      logger.info("Refund initiated", { paymentId, amount: totalPrice });

      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Time slot already booked. Payment has been refunded.",
      });
    }

    const [user, turf] = await Promise.all([
      User.findById(userId).session(session),
      Turf.findById(turfId).session(session),
    ]);

    if (!user) {
      logger.error("User not found", { userId });
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "User not found" });
    }

    if (!turf) {
      logger.error("Turf not found", { turfId });
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Turf not found" });
    }

    const QRcode = await generateQRCode(
      totalPrice,
      formattedStartTime,
      formattedEndTime,
      formattedDate,
      turf.name,
      turf.location
    );

    const [timeSlot, booking] = await Promise.all([
      TimeSlot.create(
        [
          {
            turf: turfId,
            startTime: adjustedStartTime,
            endTime: adjustedEndTime,
          },
        ],
        { session }
      ),
      Booking.create(
        [
          {
            user: userId,
            turf: turfId,
            timeSlot: null,
            totalPrice,
            qrCode: QRcode,
            payment: { method: "online", orderId, paymentId },
          },
        ],
        { session }
      ),
    ]);

    booking[0].timeSlot = timeSlot[0]._id;

    await Promise.all([
      booking[0].save({ session }),
      User.findByIdAndUpdate(
        userId,
        { $push: { bookings: booking[0]._id } },
        { session }
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    const htmlContent = generateHTMLContent(
      turf.name,
      turf.location,
      formattedDate,
      formattedStartTime,
      formattedEndTime,
      totalPrice,
      QRcode,
      turf.ownerPhoneNumber,
      user.phone
    );

    await generateEmail(user.email, "Booking Confirmation User", htmlContent);
    await generateEmail(
      turf.ownerEmail,
      "Booking Confirmation Owner",
      htmlContent
    );

    logger.info("Booking successful", {
      userId,
      turfId,
      bookingId: booking[0]._id,
    });
    return res.status(200).json({
      success: true,
      message: "Booking successful, Check your email for the receipt",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Error in verifyPayment", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your booking",
    });
  }
};

export const getBookings = async (req, res) => {
  const userId = req.user.user;
  try {
    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("qrCode totalPrice")
      .populate("timeSlot", "startTime endTime")
      .populate("turf", "name location");
    logger.info("Fetched bookings", { userId, bookingsCount: bookings.length });
    return res.status(200).json(bookings);
  } catch (error) {
    logger.error("Error in getBookings", { error: error.message });
    return res.status(500).json({ message: error.message });
  }
};
