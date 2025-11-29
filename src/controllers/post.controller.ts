import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import { Request, Response } from "express";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import { uploadImageToCloudinary } from "../utils/handleUpload.js";
import Notification, {
  NotificationType,
} from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
export const getPosts = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
      });

    res.status(200).json({ posts });
  }
);

export const getPost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
      });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ post });
  }
);

export const getUserPosts = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id as any })
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
      });

    res.status(200).json({ posts });
  }
);

export const createPost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) {
      return res
        .status(400)
        .json({ error: "Post must contain either text or image" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let imageUrl = "";

    if (imageFile) {
      try {
        const uploadResponse = await uploadImageToCloudinary(imageFile);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    const post = await Post.create({
      user: user._id as any,
      content: content || "",
      image: imageUrl,
    });

    res.status(201).json({ post });
  }
);

export const likePost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    const { userId } = getAuth(req);

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isLiked = post.likes.includes(user._id as any);
    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
    }
    // create notification if user is not the post owner
    if (user._id.toString() !== post.user.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: NotificationType.LIKE,
        post: post._id,
      } as any);
    }
    res.status(200).json({ post });
  }
);

export const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post)
      return res.status(404).json({ error: "User or post not found" });

    if (post.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts" });
    }

    await Comment.deleteMany({ post: postId } as any);

    // delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  }
);
