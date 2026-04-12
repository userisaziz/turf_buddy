import mongoose from "mongoose";

const fixedScheduleSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: { type: String, required: true }, // Format: "HH:MM" in 24-hour format
  endTime: { type: String, required: true },   // Format: "HH:MM" in 24-hour format
  isActive: { type: Boolean, default: true },
  recurring: { type: Boolean, default: true }, // Whether this schedule repeats weekly
  date: { type: Date }, // Optional: only used if recurring is false
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("FixedSchedule", fixedScheduleSchema);