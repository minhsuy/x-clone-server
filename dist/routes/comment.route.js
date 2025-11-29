import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getComments, } from "../controllers/comment.controller.js";
const commentRouter = express.Router();
// public routes
commentRouter.get("/post/:postId", getComments);
// protected routes
commentRouter.post("/post/:postId", protectedRoute, createComment);
commentRouter.delete("/:commentId", protectedRoute, deleteComment);
export default commentRouter;
