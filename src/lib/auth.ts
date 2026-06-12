// Tiny localStorage-only auth. No real security — local profile only.
import { create } from "zustand";

const KEY = "treedo-auth";
const USERS_KEY = "treedo-users";

export type AuthUser = { name: string; email: string };

type Stored = { users: Record<string, { name: string; pass: string }> };

function readUsers(): Stored {
  if (typeof window === "undefined") return { users: {} };
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{"users":{}}');
  } catch {
    return { users: {} };
  }
}
function writeUsers(s: Stored) {
  localStorage.setItem(USERS_KEY, JSON.stringify(s));
}

function readCurrent(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

type AuthStore = {
  user: AuthUser | null;
  hydrate: () => void;
  signup: (
    name: string,
    email: string,
    pass: string,
  ) => { ok: boolean; error?: string };
  login: (email: string, pass: string) => { ok: boolean; error?: string };
  logout: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  hydrate: () => set({ user: readCurrent() }),
  signup: (name, email, pass) => {
    email = email.trim().toLowerCase();
    if (!name.trim() || !email || pass.length < 4)
      return { ok: false, error: "Fill all fields (password 4+)" };
    const s = readUsers();
    if (s.users[email]) return { ok: false, error: "Email already registered" };
    s.users[email] = { name: name.trim(), pass };
    writeUsers(s);
    const user = { name: name.trim(), email };
    localStorage.setItem(KEY, JSON.stringify(user));
    set({ user });
    return { ok: true };
  },
  login: (email, pass) => {
    email = email.trim().toLowerCase();
    const s = readUsers();
    const u = s.users[email];
    if (!u || u.pass !== pass)
      return { ok: false, error: "Invalid email or password" };
    const user = { name: u.name, email };
    localStorage.setItem(KEY, JSON.stringify(user));
    set({ user });
    return { ok: true };
  },
  logout: () => {
    localStorage.removeItem(KEY);
    set({ user: null });
  },
}));
