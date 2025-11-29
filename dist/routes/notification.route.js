import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { deleteNotification, getNotifications, } from "../controllers/notification.controller.js";
const notificationRouter = express.Router();
notificationRouter.get("/", protectedRoute, getNotifications);
notificationRouter.delete("/:notificationId", protectedRoute, deleteNotification);
export default notificationRouter;
