// db.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  if (isConnected) return;

  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
      });
      isConnected = true;
      console.log("✅ MongoDB Connected");
      break;
    } catch (error) {
      console.error("❌ MongoDB connection failed. Retrying...", error);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}
