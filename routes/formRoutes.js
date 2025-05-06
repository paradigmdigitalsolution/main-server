import { Router } from "express"
import { formSubmission } from "../controller/formSubmissionController.js"
import { connectToDB } from "../db.js";
import FormModel from "../model/formSubmission.js";
const router = Router()

router.post("/submit-form", formSubmission);
export default router