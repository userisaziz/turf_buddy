import logger from "../../config/logging.js";
import FixedSchedule from "../../models/fixedSchedule.model.js";
import Turf from "../../models/turf.model.js";

import { getDay } from "date-fns";

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

    // Parse the date to get the day of week
    const dateObj = new Date(date);
    const dayOfWeek = getDay(dateObj); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

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
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all days in the range
    const datesInRange = [];
    const current = new Date(start);
    while (current <= end) {
      datesInRange.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Get fixed schedules for each day in the range
    const allSchedules = [];
    for (const date of datesInRange) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      const dailySchedules = await FixedSchedule.find({
        turf: turfId,
        dayOfWeek: dayOfWeek,
        isActive: true,
      });
      
      dailySchedules.forEach(schedule => {
        // Create a date-specific schedule with the actual date
        const scheduleWithDate = {
          ...schedule.toObject(),
          date: new Date(date),
          startTime: new Date(date.toDateString() + ' ' + schedule.startTime),
          endTime: new Date(date.toDateString() + ' ' + schedule.endTime),
        };
        allSchedules.push(scheduleWithDate);
      });
    }

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