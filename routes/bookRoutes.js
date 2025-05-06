import { Router } from "express"
import { submitBookRequest } from "../controller/bookRequestController.js"

const router = Router()

router.post("/book-request", submitBookRequest)

export default router