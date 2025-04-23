// src/api/axios.js
import axios from "axios";
import { isAuthenticated } from "@/utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && isAuthenticated()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
