import { Router } from "express"
import { formSubmission } from "../controller/formSubmissionController.js"
import { connectToDB } from "../db.js";
import FormModel from "../model/formSubmission.js";
const router = Router()

router.post("/submit-form", async (req, res) => {
    try {
      await connectToDB(); // 👈 Ensure connection before insert
  
      const form = await FormModel.create(req.body);
      res.status(201).json({ success: true, form });
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      res.status(500).json({ error: "Form submission failed" });
    }
  })

export default router