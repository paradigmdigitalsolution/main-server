import { BookRequest } from "../model/bookRequest.js";

export const submitBookRequest = async (req, res) => {
  try {
    const data = req.body;

    // Basic validation (can improve later)
    if (!data.name || !data.email || !data.phone || !data.bookType || !data.pageCount) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    const newRequest = new BookRequest(data);
    await newRequest.save();

    res.status(200).json({ success: true, message: "Book request submitted successfully." });
  } catch (err) {
    console.error("❌ Error saving book request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
