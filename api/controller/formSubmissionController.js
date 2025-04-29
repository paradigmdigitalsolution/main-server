import  FormModel  from "../model/formSubmission.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const formSubmission = async (req, res) => {
    try {
        const { name, email, phone, message, websiteName } = req.body;
    
        if (!name || !email || !phone || !websiteName) {
          return res.status(400).json({ error: "All fields are required." });
        }
    
        const newForm = new FormModel({ name, email, phone, message, websiteName });
        await newForm.save();
    
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
          text: `Website: ${websiteName}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || "no message"}`,
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Form submitted successfully." });
      } catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}
 
