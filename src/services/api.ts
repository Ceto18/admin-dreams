import axios, { AxiosHeaders } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

const isAuthUrl = (url: string) => {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password")
  );
};

api.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthRequest = isAuthUrl(url);

  const headers = AxiosHeaders.from(config.headers);
  config.headers = headers;

  headers.set("Accept", "application/json");

  if (isAuthRequest) {
    headers.delete("Authorization");
    headers.set("Content-Type", "application/json");
    return config;
  }

  let token = useAuthStore.getState().token;

  if (!token && typeof window !== "undefined") {
    const persisted = localStorage.getItem("auth-storage");

    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        token = parsed?.state?.token ?? null;
      } catch {
        localStorage.removeItem("auth-storage");
        token = null;
      }
    }
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  } else {
    headers.set("Content-Type", "application/json");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthRequest = isAuthUrl(url);

    if (error.response?.status === 401 && !isAuthRequest) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);