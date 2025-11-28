// src/config/arcjet.ts
import { ENV } from "./evn";

// cache 1 instance Arcjet (Promise) để không khởi tạo lại mỗi request
let ajPromise: Promise<any> | null = null;

export async function getArcjet() {
  if (!ajPromise) {
    ajPromise = (async () => {
      // ⬇️ ESM dynamic import – hợp lệ trong CommonJS
      const mod = await import("@arcjet/node");
      const arcjet = mod.default;
      const { detectBot, shield, tokenBucket } = mod;

      return arcjet({
        key: ENV.ARCJET_KEY as string,
        characteristics: ["ip.src"],
        rules: [
          shield({ mode: "LIVE" }),
          detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"],
          }),
          tokenBucket({
            mode: "LIVE",
            refillRate: 10,
            interval: 10,
            capacity: 15,
          }),
        ],
      });
    })();
  }

  return ajPromise;
}
