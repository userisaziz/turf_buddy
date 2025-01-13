import Message from "../../models/message.model.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
   const { name, email, message } = req.body;

   try {
      // Optionally save the message to the database
      const newMessage = new Message({ name, email, message });
      await newMessage.save();

      // Send an email notification
      const transporter = nodemailer.createTransport({
         service: "Gmail",
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

      const mailOptions = {
         from: process.env.EMAIL_USER,
         to: process.env.CONTACT_EMAIL,
         subject: "New Contact Us Message",
         text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Message sent successfully" });
   } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
   }
};