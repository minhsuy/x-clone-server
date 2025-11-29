import mongoose from "mongoose";
import { ENV } from "./evn.js";

export const connectDB = async () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    // đã kết nối rồi
    return;
  }

  if (!ENV.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in ENV");
  }

  try {
    await mongoose.connect(ENV.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect MongoDB:", error);
    // QUAN TRỌNG: ném lỗi ra ngoài để server/handler biết là fail
    throw error;
  }
};
