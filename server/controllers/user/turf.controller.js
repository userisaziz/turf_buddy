import chalk from "chalk";
import Turf from "../../models/turf.model.js";
import TimeSlot from "../../models/timeSlot.model.js";
import FixedSchedule from "../../models/fixedSchedule.model.js";
import { format, parseISO, startOfDay, getDay } from "date-fns";

import Tournament from "../../models/tournament.model.js";
import Coaching from "../../models/coaching.model.js";

// get all turfs
export const getAllTurfs = async (req, res) => {
  const { city } = req.params;
  try {
    const baseQuery = { $or: [{ isActive: true }, { isActive: { $exists: false } }] };
    const query = city ? { ...baseQuery, city: { $regex: new RegExp(`^${city}$`, "i") } } : baseQuery;
    const turfs = await Turf.find(query);

    // Get IDs of all turfs in the city
    const turfIds = turfs.map((turf) => turf._id);

    // Find tournaments associated with these turfs
    // Tournament 'turf' field is an array of ObjectIds
    const tournaments = await Tournament.find({
      turf: { $in: turfIds },
    });

    // Find coachings associated with these turfs
    // Coaching 'turf' field is a single ObjectId
    const coachings = await Coaching.find({
      turf: { $in: turfIds },
    });

    return res.status(200).json({ turfs, tournaments, coachings });
  } catch (err) {
    console.log(chalk.red("Error in getAllTurfs"), err);
    return res.status(500).json({ message: err.message });
  }
};

// get single turf by id

export const getTurfById = async (req, res) => {
  const { id } = req.params;
  try {
    const turf = await Turf.findById(id);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    return res.status(200).json({ turf });
  } catch (error) {
    console.log(chalk.red("Error in getTurfById"), error);
    return res.status(500).json({ message: error.message });
  }
};

// get time slots by turf id

export const getTimeSlotByTurfId = async (req, res) => {
  const { date, turfId } = req.query;

  if (!date || !turfId) {
    return res.status(400).json({ message: "Date and turfId are required" });
  }

  try {
    // Use UTC date handling throughout to avoid timezone shifts
    // Assuming date comes in YYYY-MM-DD
    const selectedDate = new Date(date);

    // Create start of day in UTC (00:00:00.000)
    const startOfSelectedDate = new Date(selectedDate);
    startOfSelectedDate.setUTCHours(0, 0, 0, 0);

    // Create end of day in UTC (23:59:59.999)
    const endOfSelectedDate = new Date(selectedDate);
    endOfSelectedDate.setUTCHours(23, 59, 59, 999);

    // 1. Get actual bookings from TimeSlot
    // Note: TimeSlot stores dates in UTC. We query based on overlaps with our day range.
    const bookedTime = await TimeSlot.find({
      turf: turfId,
      startTime: { $lt: endOfSelectedDate },
      endTime: { $gt: startOfSelectedDate },
    }).lean();

    // 2. Get Fixed Schedules (recurring or for this specific date)
    const dayOfWeek = startOfSelectedDate.getUTCDay(); // 0-6

    const fixedSchedules = await FixedSchedule.find({
      turf: turfId,
      isActive: true,
      $or: [
        { recurring: true, dayOfWeek: dayOfWeek },
        { recurring: false, date: { $gte: startOfSelectedDate, $lte: endOfSelectedDate } }
      ],
    }).lean();

    // 3. Convert Fixed Schedules to "bookedTime" format
    const fixedBookedTimes = fixedSchedules.map((schedule) => ({
      _id: schedule._id,
      turf: schedule.turf,
      // startTime and endTime are stored as "HH:mm" strings, which is what we want to return
      // The frontend handles parsing these strings
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dateISO: startOfSelectedDate.toISOString().split('T')[0],
      isFixed: true,
      description: schedule.description
    }));

    // Merge both
    const allBookedTimes = [...bookedTime, ...fixedBookedTimes];

    const timeSlots = await Turf.findById(turfId).select([
      "openTime",
      "closeTime",
      "pricePerHour",
      "priceAtMorning",
      "advancePayment",
    ]);

    return res.status(200).json({ timeSlots, bookedTime: allBookedTimes });
  } catch (error) {
    console.log(chalk.red("Error in getTimeSlotByTurfId"), error);
    return res.status(500).json({ message: error.message });
  }
};
