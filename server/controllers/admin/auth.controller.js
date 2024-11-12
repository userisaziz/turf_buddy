import { validationResult } from "express-validator";
import Owner from "../../models/owner.model.js";
import argon2 from "argon2";
import chalk from "chalk";
import { generateOwnerToken } from "../../utils/generateJwtToken.js";


export const registerAdmin = async (req, res) => {
   const { name, email, phone, password, confirmPassword } = req.body; // Include confirmPassword
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
   }

   // Check if password and confirmPassword match
   if (password !== confirmPassword) {
      return res.status(400).json({
         success: false,
         message: [{ type: "field", msg: "Passwords do not match", path: "confirmPassword", location: "body" }]
      });
   }

   try {
      const existingAdmin = await Owner.findOne({ email });
      if (existingAdmin) {
         return res
            .status(400)
            .json({ success: false, message: "Admin already exists" });
      }

      const hashedPassword = await argon2.hash(password);

      const newAdmin = new Owner({
         name,
         phone,
         email,
         password: hashedPassword,
      });
      await newAdmin.save();
      const token = generateOwnerToken(newAdmin); // You might want to create a separate token function for admins
      return res.status(201).json({
         success: true,
         message: "Admin created successfully",
         token,
         role: newAdmin.role,
      });
   } catch (err) {
      console.log('err: ', err);
      console.log(chalk.red(err.message));
      return res.status(500).json({ success: false, message: err.message });
   }
};