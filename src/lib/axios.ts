import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Base URL for your Backend (Render URL in production, Localhost in dev)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial! Allows sending cookies (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    // Read token directly from the store
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new token
        const { data } = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true } // Send the cookie
        );

        // Update the store with the new token
        useAuthStore.getState().setAuth(
            useAuthStore.getState().user!, // Keep existing user info
            data.accessToken
        );

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, log the user out
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);