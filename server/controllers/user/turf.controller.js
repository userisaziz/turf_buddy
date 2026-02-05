import chalk from "chalk";
import Turf from "../../models/turf.model.js";
import TimeSlot from "../../models/timeSlot.model.js";
import FixedSchedule from "../../models/fixedSchedule.model.js";
import { format, parseISO, startOfDay, getDay } from "date-fns";

// get all turfs
export const getAllTurfs = async (req, res) => {
  const { city } = req.params;
  try {
    const query = city ? { city: { $regex: new RegExp(`^${city}$`, "i") } } : {};
    const turfs = await Turf.find(query);
    return res.status(200).json({ turfs });
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

  const selectedDate = new Date(date);
  const startOfSelectedDate = startOfDay(selectedDate);
  const endOfSelectedDate = new Date(startOfSelectedDate);
  endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

  try {
    // 1. Get actual bookings from TimeSlot
    const bookedTime = await TimeSlot.find({
      turf: turfId,
      startTime: { $lt: endOfSelectedDate },
      endTime: { $gt: startOfSelectedDate },
    });

    // 2. Get Fixed Schedules (recurring or for this specific date)
    const dayOfWeek = getDay(selectedDate);
    const fixedSchedules = await FixedSchedule.find({
      turf: turfId,
      isActive: true,
      $or: [
        { recurring: true, dayOfWeek: dayOfWeek },
        { recurring: false, date: startOfSelectedDate },
      ],
    });

    // 3. Convert Fixed Schedules to "bookedTime" format
    const fixedBookedTimes = fixedSchedules.map((schedule) => {
      const [startH, startM] = schedule.startTime.split(":");
      const [endH, endM] = schedule.endTime.split(":");

      const startTime = new Date(startOfSelectedDate);
      startTime.setHours(parseInt(startH), parseInt(startM), 0, 0);

      const endTime = new Date(startOfSelectedDate);
      endTime.setHours(parseInt(endH), parseInt(endM), 0, 0);

      return {
        _id: schedule._id,
        turf: schedule.turf,
        startTime,
        endTime,
        isFixed: true, // Optional flag for frontend
      };
    });

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
