import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    members: [{ type: String }],
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
