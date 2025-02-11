import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    managerName: { type: String, required: true },
    managerPhone: { type: String, required: true },
    registrationFees: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "disabled", "num"],
      default: "available",
    },
    sportsType: { type: String, required: false },
    date: { type: Date, required: true },
    turf: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turf" }],
    maxNumTeams: { type: Number, required: true },
    currentNumTeams: { type: Number, default: 0, required: true },
    maxPlayersInTeam: { type: Number, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    // registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    lastRegistrationDate: {
      type: Date, // Field for the last date of registration
      required: true,
    },
    timings: {
      type: String, // You can change this to Date if you want to store specific times
      required: true,
    },
    prizeMoney: {
      first: { type: Number, required: true },
      second: { type: Number, required: true },
      third: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
