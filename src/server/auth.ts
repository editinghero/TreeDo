import { createServerFn } from "@tanstack/react-start";
import { getBindings } from "../lib/db";
import { setCookie, getCookie, deleteCookie } from "@tanstack/react-start/server";

// Minimal hash function for demo purposes. In production, use bcrypt or WebCrypto
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const signupServerFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; pass: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { name, email, pass } = data;
      const normalizedEmail = email.trim().toLowerCase();

      if (!name.trim() || !normalizedEmail || pass.length < 4) {
        return { ok: false as const, error: "Fill all fields (password 4+)" };
      }

      const db = getBindings().DB;

      // Check if user exists
      const existing = await db
        .prepare("SELECT email FROM users WHERE email = ?")
        .bind(normalizedEmail)
        .first();
      if (existing) {
        return { ok: false as const, error: "Email already registered" };
      }

      const userId = crypto.randomUUID();
      const passHash = await hashPassword(pass);

      // Insert user
      await db
        .prepare(
          "INSERT INTO users (id, name, email, pass_hash, created_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(userId, name.trim(), normalizedEmail, passHash, Date.now())
        .run();

      // Init progress
      await db
        .prepare("INSERT INTO progress (user_id, updated_at) VALUES (?, ?)")
        .bind(userId, Date.now())
        .run();

      // Create session
      const token = crypto.randomUUID();
      await db
        .prepare(
          "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        )
        .bind(token, userId, Date.now(), Date.now() + 1000 * 60 * 60 * 24 * 30)
        .run();

      setCookie("session", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === "production",
      });

      return {
        ok: true as const,
        user: { name: name.trim(), email: normalizedEmail, id: userId },
      };
    } catch (e) {
      console.error("[signup] Error:", e);
      return {
        ok: false as const,
        error:
          e instanceof Error ? e.message : "Server error — please try again",
      };
    }
  });

export const loginServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; pass: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { email, pass } = data;
      const normalizedEmail = email.trim().toLowerCase();

      const db = getBindings().DB;
      const passHash = await hashPassword(pass);

      const user = (await db
        .prepare(
          "SELECT id, name, email FROM users WHERE email = ? AND pass_hash = ?",
        )
        .bind(normalizedEmail, passHash)
        .first()) as { id: string; name: string; email: string } | undefined;

      if (!user) {
        return { ok: false as const, error: "Invalid email or password" };
      }

      // Create session
      const token = crypto.randomUUID();
      await db
        .prepare(
          "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        )
        .bind(
          token,
          user.id,
          Date.now(),
          Date.now() + 1000 * 60 * 60 * 24 * 30,
        )
        .run();

      setCookie("session", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        secure: process.env.NODE_ENV === "production",
      });

      return {
        ok: true as const,
        user: { name: user.name, email: user.email, id: user.id },
      };
    } catch (e) {
      console.error("[login] Error:", e);
      return {
        ok: false as const,
        error:
          e instanceof Error ? e.message : "Server error — please try again",
      };
    }
  });

export const logoutServerFn = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const token = getCookie("session");
      if (token) {
        const db = getBindings().DB;
        await db
          .prepare("DELETE FROM sessions WHERE token = ?")
          .bind(token)
          .run();
      }
      deleteCookie("session");
    } catch (e) {
      console.error("[logout] Error:", e);
    }
    return { ok: true };
  },
);

export const getUserServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const token = getCookie("session");
      if (!token) return { user: null };

      const db = getBindings().DB;
      const session = (await db
        .prepare(
          "SELECT user_id FROM sessions WHERE token = ? AND expires_at > ?",
        )
        .bind(token, Date.now())
        .first()) as { user_id: string } | undefined;

      if (!session) {
        deleteCookie("session");
        return { user: null };
      }

      const user = (await db
        .prepare("SELECT id, name, email FROM users WHERE id = ?")
        .bind(session.user_id)
        .first()) as { id: string; name: string; email: string } | undefined;

      if (!user) return { user: null };

      return { user: { name: user.name, email: user.email, id: user.id } };
    } catch (e) {
      console.error("[getUser] Error:", e);
      return { user: null };
    }
  },
);
