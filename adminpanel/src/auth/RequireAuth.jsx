import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, hasAnyRole } from "./Auth";
import { refreshAccessToken } from "./AuthService";

export default function RequireAuth({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      // Always read the latest token from localStorage
      if (!isAuthenticated()) {

        //Note: If the user is not authenticated, we attempt to refresh the access token. 
        // But we can also implement auto logoout if isAuthenticated() returns false. 
        // This is a design choice based on your application's requirements.
        
        const newToken = await refreshAccessToken();
        if (!newToken) {
          setRedirectTo("/login");
          setLoading(false);
          return;
        }
      }

      // Role check
      if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        setRedirectTo("/unauthorized");
      }

      setLoading(false);
    }

    checkAuth();
  }, [allowedRoles]);

  if (loading) return <div>Loading...</div>;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return children;
}
