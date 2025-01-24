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
import logger from "../../utils/logger.js";

export const createOrder = async (req, res) => {
  const userId = req.user.user;
  try {
    const { totalPrice } = req.body;
    logger.info('createOrder request body', { body: req.body });

    const user = await User.findById(userId).select("name email");
    if (!user) {
      logger.warn('User not found', { userId });
      return res.status(400).json({ message: "User not found" });
    }

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    logger.info('Order created', { orderId: order.id, userId });

    return res.status(200).json({ order, user });
  } catch (error) {
    logger.error('Error in createOrder', { error: error.message });
    return res.status(400).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const userId = req.user.user;
  logger.info('verifyPayment request body', { body: req.body });

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

  try {
    const formattedStartTime = format(parseISO(startTime), "hh:mm a");
    const formattedEndTime = format(parseISO(endTime), "hh:mm a");
    const formattedDate = format(parseISO(selectedTurfDate), "d MMM yyyy");

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== razorpay_signature) {
      logger.error('Payment Verification Failed', { orderId, paymentId });
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
    });

    if (existingTimeSlot) {
      logger.warn('Time slot already booked', { turfId, adjustedStartTime, adjustedEndTime });
      return res.status(400).json({
        success: false,
        message: "Time slot already booked. Please choose a different slot.",
      });
    }

    const [user, turf] = await Promise.all([
      User.findById(userId),
      Turf.findById(turfId),
    ]);

    if (!user) {
      logger.warn('User not found', { userId });
      return res.status(400).json({ message: "User not found" });
    }

    if (!turf) {
      logger.warn('Turf not found', { turfId });
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
      TimeSlot.create({
        turf: turfId,
        startTime: adjustedStartTime,
        endTime: adjustedEndTime,
      }),
      Booking.create({
        user: userId,
        turf: turfId,
        timeSlot: null,
        totalPrice,
        qrCode: QRcode,
        payment: { orderId, paymentId },
      }),
    ]);

    booking.timeSlot = timeSlot._id;

    await Promise.all([
      booking.save(),
      User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } }),
    ]);

    const htmlContent = generateHTMLContent(
      turf.name,
      turf.location,
      formattedDate,
      formattedStartTime,
      formattedEndTime,
      totalPrice,
      QRcode
    );

    await generateEmail(user.email, "Booking Confirmation", htmlContent);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: turf.ownerEmail,
      subject: "Booking Confirmation",
      text: `Hi ,

 Booking for ${user.name} with ${user.phone} at ${turf.name} has been confirmed. Here are the details:

Date: ${formattedDate}
Time: ${formattedStartTime} to ${formattedEndTime}
Total Price: ${totalPrice}

Thank you !

Best regards,
The Support Team`,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Booking successful', { userId, turfId, bookingId: booking._id });
    return res.status(200).json({
      success: true,
      message: "Booking successful, Check your email for the receipt",
    });
  } catch (error) {
    logger.error('Error in verifyPayment', { error: error.message });
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
    logger.info('Fetched bookings', { userId, bookingsCount: bookings.length });
    return res.status(200).json(bookings);
  } catch (error) {
    logger.error('Error in getBookings', { error: error.message });
    return res.status(500).json({ message: error.message });
  }
};