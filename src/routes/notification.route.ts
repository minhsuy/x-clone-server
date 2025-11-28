import express from "express";

import { protectedRoute } from "../middleware/auth.middleware";
import {
  deleteNotification,
  getNotifications,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get("/", protectedRoute, getNotifications);
notificationRouter.delete(
  "/:notificationId",
  protectedRoute,
  deleteNotification
);
export default notificationRouter;
