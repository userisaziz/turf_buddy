import * as argon2 from "argon2";
import chalk from "chalk";
import User from "../../models/user.model.js";
import { generateUserToken } from "../../utils/generateJwtToken.js";
import { validationResult } from "express-validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

import PasswordResetToken from "../../models/passwordResetToken.model.js";

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  try {
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone number already exists",
      });
    }
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();
    const token = generateUserToken(newUser._id);
    return res
      .status(201)
      .json({ success: true, message: "User created successfully", token });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    const token = generateUserToken(user._id);
    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");
    const resetToken = new PasswordResetToken({ id: user._id, token });
    await resetToken.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Hi there,

You requested a password reset. Please click the link below to reset your password:

${resetUrl}

If you did not request this, please ignore this email.

Best regards,
The Support Team`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Find the reset token in the database
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the user associated with the token
    const user = await User.findById(resetToken.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset token after successful password reset
    await PasswordResetToken.deleteOne({ token });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(500).json({ message: "Server error" });
  }
};
