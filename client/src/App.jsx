import React from "react";
import {
  BrowserRouter,
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

// Person 1 pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import TeamRegistration from "./pages/TeamRegistration";
import BookingConfirmation from "./pages/BookingConfirmation";
import ForgotPassword from "./pages/ForgotPassword";

// Person 2 pages
import Scrims from "./pages/Scrims.jsx";
import Tournaments from "./pages/Tournaments.jsx";
import TournamentDetails from "./pages/TournamentDetails.jsx";

// ========================================
// HEADER / NAVIGATION (Scrims & Tournaments pages)
// ========================================

function Header() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  // Close the mobile menu after navigation
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        {/* Brand logo */}
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <Zap size={21} fill="currentColor" />
          </span>

          <span>
            ESPORTI
            <span className="brand-accent">FY</span>
            <small>COMPETITIVE ARENA</small>
          </span>
        </NavLink>

        {/* Mobile navigation toggle */}
        <button
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>

        {/* Navigation links */}
        <nav className={`main-nav ${open ? "nav-open" : ""}`}>
          <NavLink
            to="/scrims"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Swords size={16} />
            Scrims
          </NavLink>

          <NavLink
            to="/tournaments"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Trophy size={16} />
            Tournaments
          </NavLink>

          <a className="nav-link" href="/#how-it-works">
            <Gamepad2 size={16} />
            How it works
          </a>
        </nav>

        {/* Call-to-action button */}
        <NavLink className="nav-cta" to="/tournaments">
          Explore arena
          <ArrowUpRight size={16} />
        </NavLink>
      </div>
    </header>
  );
}

// ========================================
// FOOTER
// ========================================

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
          <span>Sample events · Frontend demo</span>
        </p>
      </div>
    </footer>
  );
}

// ========================================
// LAYOUT + 404
// ========================================

function SiteLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="content-wrap not-found">
      <span className="eyebrow">404 / LOST IN THE ARENA</span>
      <h1>That page isn't in the lobby.</h1>
      <button className="btn btn-primary" onClick={() => navigate("/scrims")}>
        Back to scrims
      </button>
    </main>
  );
}

// ========================================
// MAIN APP
// ========================================

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Person 1: auth, profile and bookings */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/team-registration" element={<TeamRegistration />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        {/* Person 2: scrims and tournaments (shared header/footer) */}
        <Route element={<SiteLayout />}>
          <Route path="/scrims" element={<Scrims />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}