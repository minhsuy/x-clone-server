import express from "express";
import "dotenv/config";
import { ENV } from "./config/evn.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import notificationRouter from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
import { GoogleGenAI } from "@google/genai";

const app = express();

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDPNXjVYe-C8Gwu-SaH0AVeXSqkss6VWDc",
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);
app.get("/", (req, res) => res.send("Hello from server!"));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.json({ text: response.text ?? "" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "gemini_error",
      message: err?.message ?? String(err),
    });
  }
});
app.use(errorHandler);
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    // start the server in local mode
    if (ENV.NODE_ENV !== "development") {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
    }
  } catch (error: any) {
    console.log("Failed to connect to database", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
