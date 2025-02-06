import * as argon2 from "argon2";
import Booking from "../models/booking.model.js";
import Turf from "../models/turf.model.js";
import User from "../models/user.model.js";
import TimeSlot from "../models/timeSlot.model.js";
import generateQRCode from "../utils/generateQRCode.js";
import { format, parseISO } from "date-fns";
import generateEmail, { generateHTMLContent } from "../utils/generateEmail.js";
import bcrypt from "bcryptjs";
import Owner from "../models/owner.model.js";
import { startOfDay, endOfDay } from "date-fns";

// Authenticate user
export const authenticateUser = async (email, password) => {
  try {
    const user = await Owner.findOne({ email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    return {
      success: true,
      userId: user._id,
      message: "Authentication successful",
    };
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    return { success: false, message: "Authentication error" };
  }
};

// Fetch available turfs for the owner
export const getAvailableTurfs = async (ownerId) => {
  try {
    const turfs = await Turf.find({ owner: ownerId });

    if (!turfs.length) {
      return [];
    }

    return turfs.map((turf) => ({
      id: turf._id,
      name: turf.name,
      location: turf.location,
    }));
  } catch (error) {
    console.error("Error in getAvailableTurfs:", error);
    return [];
  }
};

// Fetch available time slots for a specific date and turf
export const getAvailableSlots = async (turfId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      turf: turfId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
    }).populate("timeSlot");

    const operatingHours = {
      start: new Date(date).setHours(8, 0, 0, 0), // 8 AM
      end: new Date(date).setHours(22, 0, 0, 0), // 10 PM
    };

    const allSlots = [];
    for (
      let time = operatingHours.start;
      time < operatingHours.end;
      time += 30 * 60 * 1000 // Increment by 30 minutes
    ) {
      allSlots.push({
        startTime: new Date(time),
        endTime: new Date(time + 30 * 60 * 1000), // 30-minute slots
      });
    }

    const availableSlots = allSlots.filter((slot) => {
      return !bookings.some((booking) => {
        const bookingStart = new Date(booking.timeSlot.startTime).getTime();
        const bookingEnd = new Date(booking.timeSlot.endTime).getTime();
        return (
          (slot.startTime.getTime() < bookingEnd &&
            slot.startTime.getTime() >= bookingStart) ||
          (slot.endTime.getTime() > bookingStart &&
            slot.endTime.getTime() <= bookingEnd)
        );
      });
    });

    // Mark slots as booked or available
    const formattedAvailableSlots = availableSlots.map((slot) => ({
      startTime: slot.startTime.toISOString(), // Format as needed
      endTime: slot.endTime.toISOString(),
      isBooked: false, // Mark as available
    }));

    const bookedSlots = bookings.map((booking) => ({
      startTime: new Date(booking.timeSlot.startTime).toISOString(),
      endTime: new Date(booking.timeSlot.endTime).toISOString(),
      isBooked: true, // Mark as booked
    }));

    // Combine available and booked slots
    return [...formattedAvailableSlots, ...bookedSlots];
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    return [];
  }
};

// Reserve a slot directly from the bot
export const reserveSlotFromBot = async (bookingData) => {
  const {
    userEmail,
    turfId,
    startTime,
    endTime,
    selectedTurfDate,
    totalPrice,
  } = bookingData;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const userId = user._id;

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return { success: false, message: "Turf not found" };
    }

    const isAvailable = await checkSlotAvailability(turfId, startTime, endTime);
    if (!isAvailable) {
      return {
        success: false,
        message: "The selected time slot is no longer available.",
      };
    }

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

    const timeSlot = await TimeSlot.create({
      turf: turfId,
      startTime,
      endTime,
    });

    const booking = await Booking.create({
      user: userId,
      turf: turfId,
      timeSlot: timeSlot._id,
      totalPrice,
      qrCode: QRcode,
      payment: { status: "offline_paid" },
    });

    await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });

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

    return {
      success: true,
      message: "Booking successful, Check your email for the receipt",
    };
  } catch (error) {
    console.error("Error in reserveSlotFromBot:", error);
    return {
      success: false,
      message: "An error occurred while processing the booking",
    };
  }
};

// Helper function to check slot availability
const checkSlotAvailability = async (turfId, startTime, endTime) => {
  const existingBookings = await Booking.find({ turf: turfId }).populate(
    "timeSlot"
  );
  const requestedStart = new Date(startTime).getTime();
  const requestedEnd = new Date(endTime).getTime();

  return !existingBookings.some((booking) => {
    const bookingStart = new Date(booking.timeSlot.startTime).getTime();
    const bookingEnd = new Date(booking.timeSlot.endTime).getTime();
    return (
      (requestedStart < bookingEnd && requestedStart >= bookingStart) ||
      (requestedEnd > bookingStart && requestedEnd <= bookingEnd)
    );
  });
};

// Fetch available dates for a specific turf
export const getAvailableDates = async (turfId) => {
  try {
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    // Find bookings for the specified turf
    const bookings = await Booking.find({ turf: turfId })
      .select("bookingDate") // Only select the bookingDate field
      .lean(); // Use lean to get plain JavaScript objects

    // Extract unique booking dates
    const bookedDates = [
      ...new Set(
        bookings.map(
          (booking) => booking.bookingDate.toISOString().split("T")[0]
        )
      ),
    ];

    // Generate a list of available dates (for example, the next 30 days)
    const availableDates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      // Check if the date is booked
      if (!bookedDates.includes(dateString)) {
        availableDates.push(dateString);
      }
    }

    return availableDates;
  } catch (error) {
    console.error("Error in getAvailableDates:", error);
    return [];
  }
};
export const getTimeSlotByTurfId = async (date, turfId) => {
  const selectedDate = new Date(date);
  const startOfSelectedDate = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfSelectedDate = new Date(selectedDate.setHours(23, 59, 59, 999));

  const query = {
    turf: turfId,
    startTime: { $gte: startOfSelectedDate, $lt: endOfSelectedDate },
  };

  try {
    const bookedTime = await TimeSlot.find(query);
    const timeSlots = await Turf.findById(turfId).select([
      "openTime",
      "closeTime",
      "pricePerHour",
      "priceAtMorning",
      "advancePayment",
    ]);

    return { timeSlots, bookedTime };
  } catch (error) {
    console.error("Error in getTimeSlotByTurfId:", error);
    return { message: error.message };
  }
};
