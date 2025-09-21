// src/http/index.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

export const API = axios.create({
  baseURL: BASE_URL,
});

export const APIAuthenticated = axios.create({
  baseURL: BASE_URL,
});

APIAuthenticated.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { BASE_URL };
