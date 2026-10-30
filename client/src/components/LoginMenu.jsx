import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  getAdminSession,
  getCurrentPlayer,
  logoutAdmin,
  logoutPlayer,
} from "../auth.js";
import "../styles/portal.css";

// The "Log in" button in the top-right corner.
// Logged out: opens a menu with two choices, Player or Admin.
// Logged in: shows the user's name with a dashboard / log out menu.
function LoginMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const location = useLocation(); // re-render after login / logout
  const navigate = useNavigate();

  const admin = getAdminSession();
  const player = getCurrentPlayer();

  // Close on route change, outside click and Escape
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (e) => {
    // The mobile nav closes when you click inside it; don't let that swallow this click.
    e.stopPropagation();
    setOpen((value) => !value);
  };

  const logout = () => {
    if (admin) logoutAdmin();
    else logoutPlayer();
    setOpen(false);
    navigate("/");
  };

  const label = admin ? "Admin" : player ? player.username : "Log in";

  return (
    <div className="lm" ref={wrapRef}>
      <button
        type="button"
        className="lm-trigger"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {admin ? <ShieldCheck size={16} /> : player ? <User size={16} /> : null}
        <span className="lm-label">{label}</span>
        <ChevronDown size={16} className={open ? "lm-chevron lm-chevron-open" : "lm-chevron"} />
      </button>

      {open && (
        <div className="lm-menu" role="menu">
          {admin || player ? (
            <>
              <Link
                role="menuitem"
                className="lm-item"
                to={admin ? "/admin/dashboard" : "/player/dashboard"}
                onClick={() => setOpen(false)}
              >
                <span className="lm-icon"><LayoutDashboard size={18} /></span>
                <span>
                  <strong>{admin ? "Admin dashboard" : "My dashboard"}</strong>
                  <small>{admin ? "Manage events and players" : "Bookings and profile"}</small>
                </span>
              </Link>
              <button type="button" role="menuitem" className="lm-item" onClick={logout}>
                <span className="lm-icon lm-icon-danger"><LogOut size={18} /></span>
                <span>
                  <strong>Log out</strong>
                  <small>End this session</small>
                </span>
              </button>
            </>
          ) : (
            <>
              <p className="lm-heading">Log in as</p>
              <Link
                role="menuitem"
                className="lm-item"
                to="/player/login"
                onClick={() => setOpen(false)}
              >
                <span className="lm-icon"><Gamepad2 size={18} /></span>
                <span>
                  <strong>Player</strong>
                  <small>Book scrims and join tournaments</small>
                </span>
              </Link>
              <Link
                role="menuitem"
                className="lm-item"
                to="/admin/login"
                onClick={() => setOpen(false)}
              >
                <span className="lm-icon lm-icon-admin"><ShieldCheck size={18} /></span>
                <span>
                  <strong>Admin</strong>
                  <small>Manage events and players</small>
                </span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginMenu;
