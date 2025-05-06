import FormModel from "../model/formSubmission.js";
import nodemailer from "nodemailer";
import { connectToDB } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const formSubmission = async (req, res) => {
  try {
    // Ensure DB is connected
    await connectToDB();

    const { name, email, phone, message, websiteName } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !websiteName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save form data to the database
    const newForm = await FormModel.create({ name, email, phone, message, websiteName });

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `${websiteName} <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: process.env.EMAIL_USER,
      subject: `New Lead from ${websiteName}`,
      text: `Website: ${websiteName}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || "No message provided"}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(201).json({ success: true, message: "Form submitted successfully.", form: newForm });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};