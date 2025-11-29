import express from "express";
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
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);
app.get("/", (req, res) => res.send("Hello from server!"));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
app.use(errorHandler);
const startServer = async () => {
    try {
        await connectDB();
        // start the server in local mode
        if (ENV.NODE_ENV !== "development") {
            app.listen(ENV.PORT, () => {
                console.log(`Server is running on port ${ENV.PORT}`);
            });
        }
    }
    catch (error) {
        console.log("Failed to connect to database", error.message);
        process.exit(1);
    }
};
startServer();
export default app;
