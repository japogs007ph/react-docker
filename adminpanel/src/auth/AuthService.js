const BASE_URL = "http://10.2.2.100/DEV/Portfolio/Devs/mark.rabit/ReactAppApi/api/Users";

let refreshPromise = null;

/* ===========================
   LOGIN
=========================== */

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();

  // store both tokens
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data;
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
  console.log("Attempting to refresh token with refresh token:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token available. Cannot refresh access token.");
    return null;
  }

  refreshPromise = fetch(`${BASE_URL}/Refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  })
    .then(async (res) => {
      if (!res.ok) {
        console.log("Token refresh failed:", res.status, res.statusText);
        throw new Error("Refresh failed");
      }

      const data = await res.json();
      console.log("Token successfully refreshed at:", new Date().toLocaleTimeString());

      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    })
    .catch((err) => {
      console.log("Token refresh error:", err.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}


