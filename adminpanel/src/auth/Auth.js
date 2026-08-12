import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./AuthService";
import axios from "axios";

function getRolesFromToken(decoded) {
  const role =
    decoded.role ||
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!role) return [];
  return Array.isArray(role) ? role : [role];
}

/* ===========================
   AUTHENTICATION
=========================== */

export function isAuthenticated() {
  const token = getAccessToken();

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

/* ===========================
   USER
=========================== */

export function getUser() {
  const token = getAccessToken();

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

/* ===========================
   TOKEN EXPIRY
=========================== */

export function getTokenExpiry() {
  const user = getUser();

  if (!user?.exp) return null;

  return user.exp * 1000; //milliseconds
}

/* ===========================
   ROLES
=========================== */

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
