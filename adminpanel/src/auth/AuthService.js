import axios from "axios";
import { logout } from "./Auth";

const BASE_URL = "http://194.15.36.109/api/Users"; 

let refreshPromise = null;

/* ===========================
   LOGIN
=========================== */

export async function login(username, password) {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      userName: username,
      Password: password,
    });

    const data = res.data;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw new Error("Invalid credentials");
  }
}

/* ===========================
   TOKEN HELPERS
=========================== */

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

/* ===========================
   REFRESH TOKEN
=========================== */

export async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logout();
    return null;
  }

  refreshPromise = axios
    .post(`${BASE_URL}/refresh`, {
      refreshToken,
    })
    .then((res) => {
      const data = res.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return data.accessToken;
    })
    .catch(() => {
      logout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}