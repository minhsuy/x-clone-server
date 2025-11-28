import express from "express";
import { ENV } from "./config/evn";
import { connectDB } from "./config/db";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import userRouter from "./routes/user.route";
import { errorHandler } from "./middleware/errorHandler";
import postRouter from "./routes/post.route";
import commentRouter from "./routes/comment.route";
import notificationRouter from "./routes/notification.route";
const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
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
