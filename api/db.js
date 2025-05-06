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
        serverSelectionTimeoutMS: 30000,  // Timeout after 30 seconds if DB isn't available
      });
      isConnected = true;
      console.log("✅ MongoDB Connected");
      break;
    } catch (error) {
      console.error("❌ MongoDB connection failed. Retrying...", error);
      retries -= 1;
      if (retries === 0) {
        console.error("❌ All connection attempts failed.");
        throw new Error("MongoDB connection failed after multiple attempts");
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retry
    }
  }
}
