import Booking from "../../models/booking.model.js";
import Turf from "../../models/turf.model.js";
import crypto from "crypto";
import User from "../../models/user.model.js";
import TimeSlot from "../../models/timeSlot.model.js";
import razorpay from "../../config/razorpay.js";
import generateQRCode from "../../utils/generateQRCode.js";
import { startOfDay, endOfDay } from "date-fns";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { format, parseISO } from "date-fns";
import generateEmail, {
  generateHTMLContent,
} from "../../utils/generateEmail.js";
import adjustTime from "../../utils/adjustTime.js";
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.owner.id;

    // Find turfs owned by this owner
    const ownedTurfs = await Turf.find({ owner: ownerId }).select("_id");
    console.log(ownedTurfs.length, "ownedTurfs");

    if (ownedTurfs.length === 0) {
      console.log("No bookings found for this owner's turfs");
      return res.status(404).json({ message: "No turfs found for this owner" });
    }

    const turfIds = ownedTurfs.map((turf) => turf._id);

    const bookings = await Booking.aggregate([
      {
        $match: {
          turf: { $in: turfIds },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "turves",
          localField: "turf",
          foreignField: "_id",
          as: "turf",
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "timeSlot",
          foreignField: "_id",
          as: "timeSlot",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$turf" },
      { $unwind: "$timeSlot" },
      {
        $project: {
          id: "$_id",
          turfName: "$turf.name",
          userName: "$user.name",
          phone: "$user.phone",
          totalPrice: 1,
          bookingDate: "$createdAt",
          duration: {
            $divide: [
              { $subtract: ["$timeSlot.endTime", "$timeSlot.startTime"] },
              1000 * 60 * 60, // Convert milliseconds to hours
            ],
          },
          startTime: "$timeSlot.startTime",
          endTime: "$timeSlot.endTime",
        },
      },
      { $sort: { bookingDate: -1 } },
    ]);

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this owner's turfs" });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getOwnerBookings:", error);
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};




export const bookTurfForUser = async (req, res) => {
  const ownerId = req.owner.id;
  const { userEmail, turfId, startTime, endTime, selectedTurfDate, totalPrice } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;

    // Verify the turf belongs to the owner
    const turf = await Turf.findOne({ _id: turfId, owner: ownerId });
    if (!turf) {
      return res.status(404).json({ message: "Turf not found or not owned by you" });
    }

    // Check for existing bookings on the same date and time
    const existingBookings = await Booking.find({
      turf: turfId,
      bookingDate: selectedTurfDate,
    }).populate("timeSlot");

    const isOverlap = existingBookings.some((booking) => {
      const bookingStart = parseISO(booking.timeSlot.startTime);
      const bookingEnd = parseISO(booking.timeSlot.endTime);
      const requestedStart = parseISO(startTime);
      const requestedEnd = parseISO(endTime);

      return (
        (isBefore(requestedStart, bookingEnd) && isAfter(requestedStart, bookingStart)) ||
        (isBefore(requestedEnd, bookingEnd) && isAfter(requestedEnd, bookingStart)) ||
        (isBefore(bookingStart, requestedEnd) && isAfter(bookingStart, requestedStart))
      );
    });

    if (isOverlap) {
      return res.status(400).json({ message: "The selected time slot is already booked." });
    }

    // Generate QR code
    const formattedStartTime = format(parseISO(startTime), "hh:mm a");
    const formattedEndTime = format(parseISO(endTime), "hh:mm a");
    const formattedDate = format(parseISO(selectedTurfDate), "d MMM yyyy");
    const QRcode = await generateQRCode(
      totalPrice,
      startTime,
      endTime,
      selectedTurfDate,
      turf.name,
      turf.location
    );

    // Generate unique orderId and paymentId
    const dateStr = format(new Date(), 'yyyyMMdd');
    const orderId = `${dateStr}-${userId}-${turfId}-${uuidv4()}`;
    const paymentId = `${dateStr}-${userId}-${turfId}-${uuidv4()}`;

    // Create time slot and booking
    const [timeSlot, booking] = await Promise.all([
      TimeSlot.create({
        turf: turfId,
        startTime: startTime,
        endTime: endTime,
      }),
      Booking.create({
        user: userId,
        turf: turfId,
        timeSlot: null, // Will be updated after TimeSlot is created
        totalPrice,
        qrCode: QRcode,
        payment: {
          orderId: orderId,
          paymentId: paymentId,
        },
      }),
    ]);

    // Update the booking with time slot
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
    return res.status(200).json({
      success: true,
      message: "Booking successful, Check your email for the receipt",
    });
  } catch (error) {
    console.error("Error in bookTurfForUser:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the booking",
    });
  }
};

export const getBookingsByTurfAndDate = async (req, res) => {
  const { turfId, date } = req.body; // Changed to req.body for POST request

  try {
    const startDate = startOfDay(new Date(date));
    const endDate = endOfDay(new Date(date));

    const bookings = await Booking.find({
      turf: turfId,
      bookingDate: { $gte: startDate, $lte: endDate },
    }).populate("timeSlot");

    const bookedTimes = bookings.map((booking) => ({
      startTime: booking.timeSlot.startTime,
      endTime: booking.timeSlot.endTime,
    }));

    return res.status(200).json({ bookedTimes });
  } catch (error) {
    console.error("Error in getBookingsByTurfAndDate:", error);
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

export const createOrder = async (req, res) => {

  try {
    const { totalPrice, userEmail } = req.body;

    // select only name and contact and email
    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;

    // const user = await User.findById(userId).select("name  email");
    // if (!user) {
    //   return res.status(400).json({ message: "User not found" });
    // }
    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return res.status(200).json({ order, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  // const userId = req.user.user;
  const {
    id: turfId,
    userEmail,
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

    // verify the Razorpay signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== razorpay_signature) {
      console.log("Payment Verification Failed");
      return res
        .status(400)
        .json({ success: false, message: "Payment Verification Failed" });
    }

    // payment successful

    //  why format here?
    // This time is storing in DB for the time slot that is created
    const adjustedStartTime = adjustTime(startTime, selectedTurfDate);
    const adjustedEndTime = adjustTime(endTime, selectedTurfDate);

    const [user, turf] = await Promise.all([
      User.findOne({ email: userEmail }),
      Turf.findById(turfId),
    ]);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userId = user._id;
    if (!turf) {
      return res
        .status(404)
        .json({ success: false, message: "Turf not found" });
    }

    //  generate QR code
    const QRcode = await generateQRCode(
      totalPrice,
      formattedStartTime,
      formattedEndTime,
      formattedDate,
      turf.name,
      turf.location
    );

    // Create time slot and booking

    const [timeSlot, booking] = await Promise.all([
      TimeSlot.create({
        turf: turfId,
        startTime: adjustedStartTime,
        endTime: adjustedEndTime,
      }),
      Booking.create({
        user: userId,
        turf: turfId,
        timeSlot: null, // Will be updated after TimeSlot is created
        totalPrice,
        qrCode: QRcode,
        payment: { orderId, paymentId },
      }),
    ]);

    // Update the booking with time slot

    booking.timeSlot = timeSlot._id;

    await Promise.all([
      booking.save(),
      User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } }),
    ]);

    // Generate and send email
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
    return res.status(200).json({
      success: true,
      message: "Booking successful, Check your email for the receipt",
    });
  } catch (error) {
    console.error("Error in verifyPayment", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your booking",
    });
  }
};