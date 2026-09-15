import axios from "axios";
import { getAppKey, getToken } from "./auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const appKey = getAppKey();
  const token = getToken();

  if (appKey) {
    config.headers["x-app-key"] = appKey;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});