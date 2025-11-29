import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";
import Notification, {
  NotificationType,
} from "../models/notification.model.js";

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

export const syncUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);

    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser)
      return res.status(200).json({
        user: existingUser,
        message: "User already exists",
      });
    const clerkUser = await clerkClient.users.getUser(userId as any);

    const userData = {
      clerkId: userId as string,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
      profilePicture: clerkUser.imageUrl || "",
    };

    const user = await User.create(userData);
    return res.status(200).json({ user, message: "User created" });
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);
    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
      new: true,
    });
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

export const followUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;
    if (userId === targetUserId)
      return res.status(400).json({ error: "You cannot follow yourself" });
    const currentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findById(targetUserId);
    if (!currentUser || !targetUser)
      return res.status(404).json({ error: "User not found" });
    const isFollowing = currentUser.following.includes(targetUserId as any);
    if (isFollowing) {
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: targetUserId },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUser._id },
      });
    } else {
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: targetUserId },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUser._id },
      });
      await Notification.create({
        from: currentUser._id,
        to: targetUserId,
        type: NotificationType.FOLLOW,
      });
    }
  }
);
