
import React from "react";
import {
  NavLink,
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

import Scrims from "./pages/Scrims.jsx";
import Tournaments from "./pages/Tournaments.jsx";
import TournamentDetails from "./pages/TournamentDetails.jsx";

// ========================================
// HEADER / NAVIGATION
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
        <nav className={`main - nav ${open ? "nav-open" : ""} `}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav - link ${isActive ? "active" : ""} `
            }
          >
            <Swords size={16} />
            Scrims
          </NavLink>

          <NavLink
            to="/tournaments"
            className={({ isActive }) =>
              `nav - link ${isActive ||
                location.pathname.startsWith("/tournaments/")
                ? "active"
                : ""
              } `
            }
          >
            <Trophy size={16} />
            Tournaments
          </NavLink>

          <a
            className="nav-link"
            href="/#how-it-works"
          >
            <Gamepad2 size={16} />
            How it works
          </a>
        </nav>

        {/* Call-to-action button */}
        <NavLink
          className="nav-cta"
          to="/tournaments"
        >
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
// MAIN APP
// ========================================

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Header />

      <Routes>
        {/* Scrims page */}
        <Route
          path="/"
          element={<Scrims />}
        />

        {/* Tournaments listing page */}
        <Route
          path="/tournaments"
          element={<Tournaments />}
        />

        {/* Tournament details page */}
        <Route
          path="/tournaments/:id"
          element={<TournamentDetails />}
        />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <main className="content-wrap not-found">
              <span className="eyebrow">
                404 / LOST IN THE ARENA
              </span>

              <h1>
                That page isn't in the lobby.
              </h1>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/")}
              >
                Back to scrims
              </button>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
