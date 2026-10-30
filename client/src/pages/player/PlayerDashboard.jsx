import { Link, useNavigate } from "react-router-dom";
import { getCurrentPlayer, logoutPlayer } from "../../auth.js";
import { scrims, tournaments } from "../../data/events.js";
import "../../styles/auth.css";
import "../../styles/portal.css";

const quickLinks = [
  { to: "/scrims", title: "Browse scrims", text: "Find a custom room and book a slot." },
  { to: "/tournaments", title: "Tournaments", text: "See prize pools and register your squad." },
  { to: "/team-registration", title: "Register a team", text: "Add your squad for a scrim or tournament." },
  { to: "/my-bookings", title: "My bookings", text: "Check or cancel your booked slots." },
  { to: "/profile", title: "My profile", text: "Update your BGMI ID, phone and city." },
];

const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Page for logged-in players. Protected by <RequireAuth role="player"> in App.jsx.
function PlayerDashboard() {
  const navigate = useNavigate();
  const user = getCurrentPlayer();

  const bookings = JSON.parse(localStorage.getItem(`esportify_bookings_${user.email}`) || "[]");
  const upcoming = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending");

  const logout = () => {
    logoutPlayer();
    navigate("/");
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <header className="dash-header">
          <div>
            <span className="portal-badge">Player dashboard</span>
            <h1 className="dash-title">Welcome back, {user.username}</h1>
            <p className="dash-subtitle">Your scrims, tournaments and squad in one place.</p>
          </div>
          <div className="dash-actions dash-actions-top">
            <Link to="/" className="dash-btn dash-btn-ghost">Home</Link>
            <button type="button" className="dash-btn dash-btn-danger" onClick={logout}>Log out</button>
          </div>
        </header>

        <div className="portal-stats">
          <div className="portal-stat"><strong>{bookings.length}</strong><span>Total bookings</span></div>
          <div className="portal-stat"><strong>{upcoming.length}</strong><span>Upcoming</span></div>
          <div className="portal-stat"><strong>{scrims.length}</strong><span>Scrims open</span></div>
          <div className="portal-stat"><strong>{tournaments.length}</strong><span>Tournaments</span></div>
        </div>

        <h2 className="portal-heading">Quick actions</h2>
        <div className="portal-links">
          {quickLinks.map((l) => (
            <Link to={l.to} key={l.to} className="portal-link-card">
              <strong>{l.title}</strong>
              <span>{l.text}</span>
            </Link>
          ))}
        </div>

        <h2 className="portal-heading">Upcoming scrims</h2>
        <div className="dash-list">
          {scrims.slice(0, 3).map((s) => (
            <article className="dash-card portal-row" key={s.id}>
              <div>
                <h3 className="booking-title">{s.title}</h3>
                <p className="dash-muted">
                  {s.mode} · {s.map} · {formatDate(s.date)}, {s.time} · ₹{s.fee}
                </p>
              </div>
              <span className="dash-badge dash-badge-orange">{s.slots - s.filled} slots left</span>
              <Link to="/scrims" className="dash-btn dash-btn-small">View</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerDashboard;
