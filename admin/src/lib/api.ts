import axios from "axios";
import { clearAdminSession, getAdminUser, isAdminUser } from "./auth";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://intelligent-upliftment-production.up.railway.app";

export const api = axios.create({
  baseURL,
  timeout: 60_000,
});

const TOKEN_KEY = "admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = String(err.config?.url || "");
    if (
      err.response?.status === 401 &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/register")
    ) {
      const hadSession = Boolean(getAdminToken()) && isAdminUser(getAdminUser());
      if (hadSession) {
        clearAdminSession();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  },
);
