// src/api/axios.js
import axios from "axios";
import { isAuthenticated, getToken, logout as clearToken } from "@/utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response interceptor – auto‑logout on 401 (token revoked)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
