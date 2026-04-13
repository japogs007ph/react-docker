import { getAccessToken, refreshAccessToken } from "./auth/AuthService";
import { logout } from "./auth/Auth";

export async function apiFetch(url, options = {}) {
  let token = getAccessToken();

  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      logout();
      return;
    }

    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      },
    });
  }

  return response.json();
}
