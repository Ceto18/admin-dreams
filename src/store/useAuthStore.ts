// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  token: string | null;

  setAuth: (data: { user: any; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: ({ user, token }) => {
        set({
          user,
          token,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");

          window.location.href = "/signin";
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);