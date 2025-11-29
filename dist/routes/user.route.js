import express from "express";
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile, } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const userRouter = express.Router();
// public route
userRouter.get("/profile/:username", getUserProfile);
// protected route
userRouter.post("/sync", protectedRoute, syncUser);
userRouter.get("/me", protectedRoute, getCurrentUser);
userRouter.put("/profile", protectedRoute, updateProfile);
userRouter.post("/follow/:targetUserId", protectedRoute, followUser);
export default userRouter;
