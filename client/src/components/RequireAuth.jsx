import { Navigate, useLocation } from "react-router-dom";
import { getAdminSession, getCurrentPlayer } from "../auth.js";

// Wrap a page with <RequireAuth role="player"> or <RequireAuth role="admin">.
// Visitors who aren't logged in as that role are sent to the matching login page.
function RequireAuth({ role, children }) {
  const location = useLocation();
  const allowed = role === "admin" ? getAdminSession() : getCurrentPlayer();

  if (!allowed) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/login" : "/player/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  return children;
}

export default RequireAuth;
