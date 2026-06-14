import { create } from "zustand";

export type AuthUser = { name: string; email: string; id: string };

type AuthStore = {
  user: AuthUser;
};

export const useAuth = create<AuthStore>(() => ({
  user: { name: "You", email: "", id: "local" },
}));
