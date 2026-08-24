import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/Users`; 

let accessToken = null;
let refreshPromise = null;

/* ===========================
   LOGIN
=========================== */

export async function login(username, password) {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      userName: username,
      Password: password,
    }, 
    {
      withCredentials: true,
    });

    const data = res.data;

    // Access token exists only in memory.
    accessToken = data.accessToken;

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
  return accessToken;
}

/* ===========================
   REFRESH TOKEN
=========================== */

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post(
      `${BASE_URL}/refresh`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      const data = res.data;

      accessToken = data.accessToken;

      return accessToken;
    })
    .catch((err) => {
      accessToken = null;

      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/* ===========================
   CLEAR AUTH
=========================== */

export function clearAccessToken() {
  accessToken = null;
}

/* ===========================
   LOGOUT
=========================== */

export async function logout() {
  try {
    await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    accessToken = null;

    window.location.href = "/login";
  }
}