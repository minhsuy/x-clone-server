// src/middleware/arcjet.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { getArcjet } from "../config/arcjet";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy instance Arcjet (khởi tạo 1 lần, dùng lại nhiều lần)
    const aj = await getArcjet();

    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed.",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy.",
        });
      }
    }

    if (
      decision.results.some(
        (result: any) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next();
  }
};
