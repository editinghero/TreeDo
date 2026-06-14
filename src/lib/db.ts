import type { D1Database } from "@cloudflare/workers-types";
import { getEvent } from "vinxi/http";

export interface Env {
  DB: D1Database;
}

let devBindings: Env | null = null;

// Initialize wrangler local platform proxy for development bindings
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  // Dynamically load wrangler so it's not bundled in production builds
  import("wrangler").then(async ({ getPlatformProxy }) => {
    try {
      const proxy = await getPlatformProxy();
      devBindings = proxy.env as unknown as Env;
      console.log("[TreeDo] Local D1 wrangler proxy initialized successfully!");
    } catch (e) {
      console.error("[TreeDo] Failed to initialize local D1 wrangler proxy:", e);
    }
  }).catch((e) => {
    console.error("[TreeDo] Wrangler not found or failed to load dynamically:", e);
  });
}

export function getBindings(): Env {
  // 1. Try Cloudflare event context (production Cloudflare Pages/Workers)
  try {
    const event = getEvent();
    if (event?.context?.cloudflare?.env?.DB) {
      return event.context.cloudflare.env as Env;
    }
  } catch {
    // Ignore outside request context
  }

  // 2. Try cached development bindings from Wrangler proxy
  if (devBindings && devBindings.DB) {
    return devBindings;
  }

  // 3. Try process.env (fallback)
  if (
    typeof process !== "undefined" &&
    process.env &&
    (process.env as unknown as Env).DB
  ) {
    return process.env as unknown as Env;
  }

  throw new Error(
    "[TreeDo] D1 database binding not found. " +
      "Please wait 1-2 seconds for local D1 proxy to initialize and try again."
  );
}
