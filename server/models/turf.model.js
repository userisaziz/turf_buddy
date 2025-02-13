import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    sportTypes: [{ type: String, required: true }],
    pricePerHour: { type: Number, required: true },
    priceAtMorning: { type: Number,  },
    advancePayment: { type: Number,  },
    region: { 
      type: String, 
      required: true, 
      enum: ["Hagarga", "Saidapuri", "Nagnahalli", "Kbn", "Other"] 
  },
    openTime: { type: String, required: true },
    ownerEmail: { type: String, },
    ownerPhoneNumber: { type: Number, },
    closeTime: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true }
);

const Turf = mongoose.model("Turf", turfSchema);

export default Turf;
