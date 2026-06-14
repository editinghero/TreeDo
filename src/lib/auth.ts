import { create } from "zustand";
import {
  signupServerFn,
  loginServerFn,
  logoutServerFn,
  getUserServerFn,
} from "../server/auth";

export type AuthUser = { name: string; email: string; id: string };

type AuthStore = {
  user: AuthUser | null;
  hydrate: () => Promise<void>;
  signup: (
    name: string,
    email: string,
    pass: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  login: (
    email: string,
    pass: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  hydrate: async () => {
    try {
      const res = await getUserServerFn();
      if (res.user) {
        set({ user: res.user as AuthUser });
      } else {
        set({ user: null });
      }
    } catch (e) {
      console.error("Failed to hydrate user", e);
      set({ user: null });
    }
  },
  signup: async (name, email, pass) => {
    try {
      const res = await signupServerFn({ data: { name, email, pass } });
      if (res.ok && res.user) {
        set({ user: res.user as AuthUser });
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Signup failed";
      return { ok: false, error: errorMsg };
    }
  },
  login: async (email, pass) => {
    try {
      const res = await loginServerFn({ data: { email, pass } });
      if (res.ok && res.user) {
        set({ user: res.user as AuthUser });
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Login failed";
      return { ok: false, error: errorMsg };
    }
  },
  logout: async () => {
    try {
      await logoutServerFn();
    } finally {
      set({ user: null });
    }
  },
}));
