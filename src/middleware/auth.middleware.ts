import { NextFunction, Request, Response } from "express";

export const protectedRoute = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const isAuthenticated = req.auth().isAuthenticated;
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
};
