import { Router } from "express"
import { formSubmission } from "../controller/formSubmissionController.js"

const router = Router()

router.post("/submit-form", formSubmission)

export default router