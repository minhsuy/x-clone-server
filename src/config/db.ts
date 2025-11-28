import mongoose from "mongoose";
import { ENV } from "./evn";
export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
