// src/store/useAuthStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  uuid: string;
  name: string;
  last_name?: string;
  email: string;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hasHydrated: boolean;

  setAuth: (data: { user: AuthUser; token: string }) => void;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,

      setAuth: ({ user, token }) => {
        set({
          user,
          token,
        });
      },

      setHasHydrated: (value) => {
        set({
          hasHydrated: value,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          window.location.replace("/signin");
        }
      },
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);