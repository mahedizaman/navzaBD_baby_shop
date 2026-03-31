import axios, { type AxiosInstance } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://intelligent-upliftment-production.up.railway.app";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

export function getBaseURL(): string {
  return baseURL;
}
