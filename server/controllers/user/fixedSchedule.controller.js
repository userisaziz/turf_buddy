import logger from "../../config/logging.js";
import FixedSchedule from "../../models/fixedSchedule.model.js";
import Turf from "../../models/turf.model.js";

// Removed unused date-fns import as we'll use native Date UTC methods
// import { getDay } from "date-fns";

export const checkFixedScheduleConflict = async (req, res) => {
  const { turfId, date, startTime, endTime } = req.body;

  try {
    // Validate required fields
    if (!turfId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: turfId, date, startTime, endTime",
      });
    }

    // Parse the date to get the day of week (use UTC to match "YYYY-MM-DD" parsing)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if there's a fixed schedule for this day and time
    const conflictingSchedule = await FixedSchedule.findOne({
      turf: turfId,
      dayOfWeek: dayOfWeek,
      isActive: true,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    });

    if (conflictingSchedule) {
      return res.status(200).json({
        success: true,
        hasConflict: true,
        message: "This time slot is reserved by a fixed schedule",
        schedule: conflictingSchedule,
      });
    }

    return res.status(200).json({
      success: true,
      hasConflict: false,
      message: "No fixed schedule conflict",
    });
  } catch (error) {
    logger.error("Error in checkFixedScheduleConflict", {
      error: error.message,
      requestBody: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while checking fixed schedule conflicts",
      error: error.message,
    });
  }
};

// Get fixed schedules for a specific date range
export const getFixedSchedulesByDateRange = async (req, res) => {
  const { turfId, startDate, endDate } = req.body;

  try {
    // Parse dates (assumed "YYYY-MM-DD" -> UTC midnight)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all days in the range using UTC
    const datesInRange = [];
    const current = new Date(start);
    while (current <= end) {
      datesInRange.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    // Get fixed schedules for each day in the range
    const allSchedules = [];
    for (const date of datesInRange) {
      const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Normalize date for comparison (set to midnight UTC)
      const dateStart = new Date(date);
      dateStart.setUTCHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setUTCHours(23, 59, 59, 999);

      // Find recurring schedules for this day of week OR single-date blocks for this specific date
      const dailySchedules = await FixedSchedule.find({
        turf: turfId,
        isActive: true,
        $or: [
          { recurring: true, dayOfWeek: dayOfWeek },
          { recurring: false, date: { $gte: dateStart, $lte: dateEnd } }
        ]
      });

      dailySchedules.forEach(schedule => {
        // Create a date-specific schedule with the actual date
        // Keep startTime/endTime as HH:mm strings - the client will combine with date
        const scheduleWithDate = {
          ...schedule.toObject(),
          dateISO: date.toISOString().split('T')[0], // "yyyy-MM-dd" format
          // startTime and endTime remain as "HH:mm" strings from the model
        };
        allSchedules.push(scheduleWithDate);
      });
    }

    console.log('[DEBUG] Returning fixedSchedules:', allSchedules.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      dateISO: s.dateISO
    })));

    return res.status(200).json({
      success: true,
      fixedSchedules: allSchedules,
    });
  } catch (error) {
    logger.error("Error in getFixedSchedulesByDateRange", {
      error: error.message,
      requestBody: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching fixed schedules",
      error: error.message,
    });
  }
};