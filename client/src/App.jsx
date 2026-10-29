
import React from "react";
import {
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Gamepad2,
  Trophy,
  Swords,
  Menu,
  Zap,
  ArrowUpRight,
} from "lucide-react";

// Teammate 1: Home, authentication, profile and bookings
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
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
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <Zap size={21} fill="currentColor" />
          </span>
          <span>
            ESPORTI<span className="brand-accent">FY</span>
            <small>COMPETITIVE ARENA</small>
          </span>
        </NavLink>

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

          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Gamepad2 size={16} />
            Home
          </NavLink>
        </nav>

        <NavLink className="nav-cta" to="/tournaments">
          Explore arena
          <ArrowUpRight size={16} />
        </NavLink>
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
    <Routes>
      {/* Home and user account pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/team-registration" element={<TeamRegistration />} />
      <Route
        path="/booking-confirmation"
        element={<BookingConfirmation />}
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
  );
}

export default App;
