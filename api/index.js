// ✅ FIXED BACKEND FOR NUMBER-BASED `userId`

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from "./routes/formRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import FormModel from "./model/formSubmission.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.18.47:3000", "http://localhost/smtp-periodic/"],
  credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Schema & Model
// const FormSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, match: /.+\@.+\..+/ },
//   phone: { type: String, required: true, match: /^[0-9]{10,15}$/ },
//   message: { type: String },
//   websiteName: { type: String, required: true },
//   submittedAt: { type: Date, default: Date.now },

//   // 🔁 Make readBy accept numbers (userId from Prisma)
//   readBy: [{ type: Number }],
// });

// const FormModel = mongoose.model("FormSubmission", FormSchema);

// ➕ Submit new form

app.use("/api", formRoutes )
app.use("/api", bookRoutes )
// 🔍 Get all leads and mark if read by user
app.get("/get-leads/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const forms = await FormModel.find().sort({ submittedAt: -1 });

    const processedForms = forms.map((form) => ({
      ...form.toObject(),
      isRead: form.readBy.includes(userId),
    }));

    res.status(200).json(processedForms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔢 Unread count for this user
app.get("/unread-count/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const count = await FormModel.countDocuments({
      readBy: { $ne: userId },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Mark single lead as read
app.patch("/mark-read/:id", async (req, res) => {
  const { id } = req.params; // could be a form ID or "all"
  const { userId } = req.body;

  try {
    if (id === "all") {
      // Mark all forms as read for this user
      await FormModel.updateMany(
        { readBy: { $ne: userId } }, // only those that haven't been read
        { $push: { readBy: userId } }
      );

      return res.status(200).json({ success: true, message: "All marked as read" });
    }

    // Otherwise, mark single form as read
    const form = await FormModel.findById(id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    if (!form.readBy.includes(userId)) {
      form.readBy.push(userId);
      await form.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error marking as read:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;