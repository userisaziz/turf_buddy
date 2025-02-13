import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner"], default: "owner" },
    deviceId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Owner", ownerSchema);
