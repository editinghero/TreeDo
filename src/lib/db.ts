import type { D1Database } from "@cloudflare/workers-types";
import { getEvent } from "vinxi/http";

export interface Env {
  DB: D1Database;
}

export function getBindings(): Env {
  // 1. Try Cloudflare event context (production Workers + cloudflare vite plugin in dev)
  try {
    const event = getEvent();
    if (event?.context?.cloudflare?.env?.DB) {
      return event.context.cloudflare.env as Env;
    }
  } catch {
    // getEvent() throws outside of request context — ignore
  }

  // 2. Try process.env (wrangler pages dev injects bindings here)
  if (
    typeof process !== "undefined" &&
    process.env &&
    (process.env as unknown as Env).DB
  ) {
    return process.env as unknown as Env;
  }

  throw new Error(
    "[TreeDo] D1 database binding not found. " +
      "Make sure the cloudflare() vite plugin is in vite.config.ts " +
      "and wrangler.toml has the [[d1_databases]] binding.",
  );
}
