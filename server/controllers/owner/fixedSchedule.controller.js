import FixedSchedule from "../../models/fixedSchedule.model.js";
import Turf from "../../models/turf.model.js";
import logger from "../../config/logging.js";

// Create a new fixed schedule
export const createFixedSchedule = async (req, res) => {
  const ownerId = req.owner.id;
  const { turfId, dayOfWeek, startTime, endTime, description, recurring, date } = req.body;

  try {
    // Validate required fields
    if (!turfId || dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: turfId, dayOfWeek, startTime, endTime",
      });
    }

    // Verify that the turf belongs to the owner
    const turf = await Turf.findOne({ _id: turfId, owner: ownerId });
    if (!turf) {
      return res.status(403).json({
        success: false,
        message: "Turf not found or not owned by you",
      });
    }

    // Check for overlapping schedules on the same day
    const query = {
      turf: turfId,
      isActive: true,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    };

    if (recurring === false && date) {
      // For single date blocks, check if there's a recurring block on that day OR a specific block for that date
      const specificDate = new Date(date);
      specificDate.setHours(0, 0, 0, 0);

      query.$and = [
        {
          $or: [
            { recurring: true, dayOfWeek: dayOfWeek },
            { recurring: false, date: specificDate }
          ]
        }
      ];
    } else {
      // For recurring blocks, check if there's any recurring block on that day OR any specific date block on that day
      query.dayOfWeek = dayOfWeek;
    }

    const existingSchedule = await FixedSchedule.findOne(query);

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "There is already a fixed schedule overlapping with the given time period",
      });
    }

    // Create the fixed schedule
    const scheduleData = {
      turf: turfId,
      dayOfWeek,
      startTime,
      endTime,
      description: description || "",
      recurring: recurring !== undefined ? recurring : true,
    };

    if (recurring === false && date) {
      const specificDate = new Date(date);
      specificDate.setHours(0, 0, 0, 0);
      scheduleData.date = specificDate;
    }

    const fixedSchedule = await FixedSchedule.create(scheduleData);

    logger.info("Fixed schedule created", {
      ownerId,
      turfId,
      fixedScheduleId: fixedSchedule._id,
    });

    return res.status(201).json({
      success: true,
      message: "Fixed schedule created successfully",
      fixedSchedule,
    });
  } catch (error) {
    logger.error("Error in createFixedSchedule", {
      error: error.message,
      requestBody: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the fixed schedule",
      error: error.message,
    });
  }
};

// Get all fixed schedules for a specific turf
export const getFixedSchedulesByTurf = async (req, res) => {
  const ownerId = req.owner.id;
  const { turfId } = req.params;

  try {
    // Verify that the turf belongs to the owner
    const turf = await Turf.findOne({ _id: turfId, owner: ownerId });
    if (!turf) {
      return res.status(403).json({
        success: false,
        message: "Turf not found or not owned by you",
      });
    }

    const fixedSchedules = await FixedSchedule.find({
      turf: turfId,
      isActive: true,
    }).sort({ dayOfWeek: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      fixedSchedules,
    });
  } catch (error) {
    logger.error("Error in getFixedSchedulesByTurf", {
      error: error.message,
      turfId,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching fixed schedules",
      error: error.message,
    });
  }
};

// Get all fixed schedules for owner
export const getAllFixedSchedules = async (req, res) => {
  const ownerId = req.owner.id;

  try {
    const turfs = await Turf.find({ owner: ownerId }).select("_id");
    const turfIds = turfs.map(turf => turf._id);

    const fixedSchedules = await FixedSchedule.find({
      turf: { $in: turfIds },
      isActive: true,
    }).populate("turf", "name");

    return res.status(200).json({
      success: true,
      fixedSchedules,
    });
  } catch (error) {
    logger.error("Error in getAllFixedSchedules", {
      error: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching fixed schedules",
      error: error.message,
    });
  }
};

// Update a fixed schedule
export const updateFixedSchedule = async (req, res) => {
  const ownerId = req.owner.id;
  const { scheduleId } = req.params;
  const { dayOfWeek, startTime, endTime, description, recurring, isActive, date } = req.body;

  try {
    // Find the fixed schedule and verify ownership
    const fixedSchedule = await FixedSchedule.findById(scheduleId).populate("turf");

    if (!fixedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Fixed schedule not found",
      });
    }

    // Check if the turf belongs to the owner
    if (fixedSchedule.turf.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this fixed schedule",
      });
    }

    // Check for overlapping schedules if times are changing
    if ((startTime && endTime) && (startTime !== fixedSchedule.startTime || endTime !== fixedSchedule.endTime)) {
      const existingSchedule = await FixedSchedule.findOne({
        _id: { $ne: scheduleId },
        turf: fixedSchedule.turf._id,
        dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : fixedSchedule.dayOfWeek,
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

      if (existingSchedule) {
        return res.status(400).json({
          success: false,
          message: "There is already a fixed schedule overlapping with the given time period",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (description !== undefined) updateData.description = description;
    if (recurring !== undefined) updateData.recurring = recurring;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (date !== undefined) updateData.date = date;

    const updatedSchedule = await FixedSchedule.findByIdAndUpdate(
      scheduleId,
      updateData,
      { new: true }
    );

    logger.info("Fixed schedule updated", {
      ownerId,
      scheduleId,
      updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Fixed schedule updated successfully",
      fixedSchedule: updatedSchedule,
    });
  } catch (error) {
    logger.error("Error in updateFixedSchedule", {
      error: error.message,
      scheduleId,
      requestBody: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the fixed schedule",
      error: error.message,
    });
  }
};

// Delete a fixed schedule
export const deleteFixedSchedule = async (req, res) => {
  const ownerId = req.owner.id;
  const { scheduleId } = req.params;

  try {
    // Find the fixed schedule and verify ownership
    const fixedSchedule = await FixedSchedule.findById(scheduleId).populate("turf");

    if (!fixedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Fixed schedule not found",
      });
    }

    // Check if the turf belongs to the owner
    if (fixedSchedule.turf.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this fixed schedule",
      });
    }

    await FixedSchedule.findByIdAndDelete(scheduleId);

    logger.info("Fixed schedule deleted", {
      ownerId,
      scheduleId,
    });

    return res.status(200).json({
      success: true,
      message: "Fixed schedule deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deleteFixedSchedule", {
      error: error.message,
      scheduleId,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the fixed schedule",
      error: error.message,
    });
  }
};

// Get fixed schedules for a specific date range
export const getFixedSchedulesByDateRange = async (req, res) => {
  const ownerId = req.owner.id;
  const { turfId, startDate, endDate } = req.body;

  try {
    // Verify that the turf belongs to the owner
    const turf = await Turf.findOne({ _id: turfId, owner: ownerId });
    if (!turf) {
      return res.status(403).json({
        success: false,
        message: "Turf not found or not owned by you",
      });
    }

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

// Check if a time slot is blocked by fixed schedule
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
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

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