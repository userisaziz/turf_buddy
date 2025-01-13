import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
   id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
   token: { type: String, required: true },
   createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expires in 1 hour
});

const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;