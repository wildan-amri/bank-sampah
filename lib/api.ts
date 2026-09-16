import axios from "axios";
import { getAppKey, getToken } from "./auth";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://learn.smktelkom-mlg.sch.id/bank_sampah";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const appKey = getAppKey();
    const token = getToken();

    if (appKey) {
      config.headers["x-app-key"] = appKey;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Do not override Content-Type if uploading FormData (let browser set multipart boundary)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Terjadi kesalahan pada server";
    
    // Attach friendly formatted message to error object
    error.friendlyMessage = errorMsg;
    return Promise.reject(error);
  }
);