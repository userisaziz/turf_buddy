import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf" },
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSlot" },
    totalPrice: { type: Number, required: true },
    qrCode: { type: String, required: true },
    payment: {
      method: { type: String, enum: ["online", "cash"], required: true }, // New field for payment method
      orderId: { type: String }, // Optional for cash on delivery
      paymentId: { type: String }, // Optional for cash on delivery
    },
  },
  { timestamps: true }
);

// Ensure a user cannot book the same time slot for the same turf twice
bookingSchema.index({ user: 1, turf: 1, timeSlot: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
