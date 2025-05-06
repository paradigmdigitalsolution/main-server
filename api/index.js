import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from "./routes/formRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import FormModel from "./model/formSubmission.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection (inline and cached)
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 60000,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.18.47:3000",
      "http://localhost/smtp-periodic/",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api", formRoutes);
app.use("/api", bookRoutes);

// 🔍 Get all leads and mark if read by user
app.get("/get-leads/:userId", async (req, res) => {
  await connectToDB();

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
  await connectToDB();

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

// ✅ Mark single or all leads as read
app.patch("/mark-read/:id", async (req, res) => {
  await connectToDB();

  const { id } = req.params;
  const { userId } = req.body;

  try {
    if (id === "all") {
      await FormModel.updateMany(
        { readBy: { $ne: userId } },
        { $push: { readBy: userId } }
      );

      return res
        .status(200)
        .json({ success: true, message: "All marked as read" });
    }

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
