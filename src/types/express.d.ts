// src/types/express.d.ts
import type { AuthObject } from "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthObject;
    }
  }
}

export {};
