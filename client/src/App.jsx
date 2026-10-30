
import React from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  Gamepad2,
  Trophy,
  Swords,
  Menu,
  Zap,
  ArrowUpRight,
} from "lucide-react";

// Shared components
import LoginMenu from "./components/LoginMenu.jsx";
import Logo from "./components/Logo.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ScrollManager from "./components/ScrollManager.jsx";

// Player pages
import PlayerLogin from "./pages/player/PlayerLogin.jsx";
import PlayerRegister from "./pages/player/PlayerRegister.jsx";
import PlayerDashboard from "./pages/player/PlayerDashboard.jsx";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

// Teammate 1: Home, profile and bookings
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import TeamRegistration from "./pages/TeamRegistration.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

// Teammate 2: Scrims and tournaments
import Scrims from "./pages/Scrims.jsx";
import Tournaments from "./pages/Tournaments.jsx";
import TournamentDetails from "./pages/TournamentDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

function Header() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />

        <button
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>

        <nav className={`main-nav ${open ? "nav-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Gamepad2 size={16} />
            Home
          </NavLink>

          <NavLink
            to="/scrims"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Swords size={16} />
            Scrims
          </NavLink>

          <NavLink
            to="/tournaments"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Trophy size={16} />
            Tournaments
          </NavLink>
        </nav>

        <div className="header-actions">
          <LoginMenu />
          <NavLink className="nav-cta" to="/tournaments">
            Explore arena
            <ArrowUpRight size={16} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-mark small">
            <Zap size={16} fill="currentColor" />
          </span>
          ESPORTIFY
        </div>
        <p>
          Built for squads that play to win.{" "}
          <span>Competitive gaming platform</span>
        </p>
      </div>
    </footer>
  );
}

function SiteLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        {/* Public home page */}
        <Route path="/" element={<Home />} />

        {/* Old links keep working */}
        <Route path="/login" element={<Navigate to="/player/login" replace />} />
        <Route path="/register" element={<Navigate to="/player/register" replace />} />

        {/* Player portal */}
        <Route path="/player/login" element={<PlayerLogin />} />
        <Route path="/player/register" element={<PlayerRegister />} />
        <Route
          path="/player/dashboard"
          element={
            <RequireAuth role="player">
              <PlayerDashboard />
            </RequireAuth>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/team-registration" element={<TeamRegistration />} />
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        {/* Admin portal (separate pages from the player side) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth role="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Scrims and tournaments share the navigation and footer */}
        <Route element={<SiteLayout />}>
          <Route path="/scrims" element={<Scrims />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route
            path="/tournaments/:id"
            element={<TournamentDetails />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
