import express from "express";

import { protectedRoute } from "../middleware/auth.middleware";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likePost,
} from "../controllers/post.controller";
import upload from "../middleware/upload.middleware";

const postRouter = express.Router();

// public routes
postRouter.get("/", getPosts);
postRouter.get("/:postId", getPost);
postRouter.get("/user/:username", getUserPosts);

// protected proteced
postRouter.post("/", protectedRoute, upload.single("image"), createPost);
postRouter.post("/:postId/like", protectedRoute, likePost);
postRouter.delete("/:postId", protectedRoute, deletePost);

export default postRouter;
