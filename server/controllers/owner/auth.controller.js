import * as argon2 from "argon2";
import chalk from "chalk";
import { generateOwnerToken } from "../../utils/generateJwtToken.js";
import Owner from "../../models/owner.model.js";
import { validationResult } from "express-validator";
import OwnerRequest from "../../models/ownerRequest.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

import PasswordResetToken from "../../models/passwordResetToken.model.js";


export const ownerRequest = async (req, res) => {
  const { name, email, phone } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }
  try {
    const ownerRequest = await OwnerRequest.findOne({ email });
    if (ownerRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Owner request already exists" });
    }
    const newOwnerRequest = new OwnerRequest({
      name,
      email,
      phone,
    });
    await newOwnerRequest.save();
    return res
      .status(201)
      .json({ success: true, message: "Owner request created successfully" });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const registerOwner = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  try {
    const ownerRequest = await OwnerRequest.findOne({ email });

    if (!ownerRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Owner request does not exist" });
    }

    if (ownerRequest.status === "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Owner request is not approved" });
    }

    if (ownerRequest.status === "rejected") {
      return res
        .status(400)
        .json({ success: false, message: "Owner request is rejected" });
    }

    const owner = await Owner.findOne({ email });
    if (owner) {
      return res
        .status(400)
        .json({ success: false, message: "Owner already exists" });
    }
    const hashedPassword = await argon2.hash(password);

    const newOwner = new Owner({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newOwner.save();
    const token = generateOwnerToken(newOwner);
    return res.status(201).json({
      success: true,
      message: "Owner created successfully",
      token,
      role: newOwner.role,
    });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const loginOwner = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res
        .status(400)
        .json({ success: false, message: "Owner does not exist" });
    }
    const isPasswordCorrect = await argon2.verify(owner.password, password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    const token = generateOwnerToken(owner);
    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        role: owner.role,
      });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(400).json({ success: false, message: err.message });
  }
};


export const forgotOwnerPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Owner with this email does not exist" });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");
    const resetToken = new PasswordResetToken({ id: owner._id, token });
    await resetToken.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/owner/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(500).json({ message: "Server error" });
  }
};


export const resetOwnerPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Find the reset token in the database
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the owner associated with the token
    const owner = await Owner.findById(resetToken.ownerId);
    if (!owner) {
      return res.status(400).json({ message: "Owner not found" });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the owner's password
    owner.password = hashedPassword;
    await owner.save();

    // Delete the reset token after successful password reset
    await PasswordResetToken.deleteOne({ token });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log(chalk.red(err.message));
    return res.status(500).json({ message: "Server error" });
  }
};