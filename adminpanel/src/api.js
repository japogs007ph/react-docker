import axios from "axios";
import { getAccessToken, refreshAccessToken } from "./auth/AuthService";
import { logout } from "./auth/Auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // better if same origin --- IGNORE ---
});


// ✅ REQUEST INTERCEPTOR (attach token)
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ✅ RESPONSE INTERCEPTOR (handle 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (!newToken) {
        logout();
        return Promise.reject(error);
      }

      // attach new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest); // 🔁 retry request
    }

    return Promise.reject(error);
  }
);

export default api;