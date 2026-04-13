import { jwtDecode } from "jwt-decode";

function getRolesFromToken(decoded) {
  const role =
    decoded.role ||
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!role) return [];
  return Array.isArray(role) ? role : [role];
}

export function isAuthenticated() {
  const token = localStorage.getItem("accessToken");

  if (!token) return false;

  try{
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return false;

    const now = Date.now() / 1000; //seconds
    return decoded.exp > now;
  }
  catch {
    return false;
  }
}

export function getTokenExpiry() {
  const user = getUser();
  if (!user?.exp) return null;

  return user.exp * 1000; //milliseconds
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export function getUser() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function hasRole(role) {
  const user = getUser();
  if (!user) return false;

  const roles = getRolesFromToken(user);
  return roles.includes(role);
}

export function hasAnyRole(roles = []) {
  const user = getUser();
  if (!user) return false;

  const userRoles = getRolesFromToken(user);
  return roles.some(r => userRoles.includes(r));
}
