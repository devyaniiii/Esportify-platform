import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getCurrentPlayer } from "../auth.js";
import "../styles/auth.css";

// Shown to a new user the first time they open this page, so the list isn't empty.
// Delete this array (and the seeding below) if you want new users to start with nothing.
const sampleBookings = [
  { id: "ESP-1042", type: "Tournament", title: "Esportify Weekly Cup", date: "2 Nov 2026", time: "8:00 PM", slot: "#14", fee: "₹100", team: "Shadow Squad", status: "Confirmed" },
  { id: "ESP-1038", type: "Scrim", title: "Evening Scrims, Erangel", date: "30 Oct 2026", time: "9:30 PM", slot: "#7", fee: "₹50", team: "Shadow Squad", status: "Confirmed" },
  { id: "ESP-1019", type: "Tournament", title: "Pune Clash Season 2", date: "18 Oct 2026", time: "7:00 PM", slot: "#3", fee: "₹200", team: "Shadow Squad", status: "Completed" },
];

const filters = ["All", "Tournament", "Scrim"];

function MyBookings() {
  const [user] = useState(getCurrentPlayer);
  const storageKey = user ? `esportify_bookings_${user.email}` : "";

  const [bookings, setBookings] = useState(() => {
    if (!user) return [];
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(storageKey, JSON.stringify(sampleBookings));
    return sampleBookings;
  });
  const [filter, setFilter] = useState("All");

  if (!user) return <Navigate to="/player/login" replace />;

  const visible = filter === "All" ? bookings : bookings.filter((b) => b.type === filter);

  const cancelBooking = (id) => {
    // TODO: call DELETE /api/bookings/{id} once the backend is ready
    const next = bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b));
    setBookings(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const badgeClass = (status) => {
    if (status === "Confirmed") return "dash-badge dash-badge-green";
    if (status === "Pending") return "dash-badge dash-badge-orange";
    if (status === "Cancelled") return "dash-badge dash-badge-red";
    return "dash-badge dash-badge-grey";
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">My bookings</h1>
            <p className="dash-subtitle">Tournaments and scrims booked by {user.username}.</p>
          </div>
          <div className="dash-actions dash-actions-top">
            <Link to="/player/dashboard" className="dash-btn dash-btn-ghost">Dashboard</Link>
            <Link to="/profile" className="dash-btn dash-btn-ghost">My profile</Link>
            <Link to="/team-registration" className="dash-btn">Book a slot</Link>
          </div>
        </header>

        <div className="dash-filters" role="tablist" aria-label="Filter bookings">
          {filters.map((f) => (
            <button
              key={f} type="button" role="tab" aria-selected={filter === f}
              className={filter === f ? "dash-filter dash-filter-active" : "dash-filter"}
              onClick={() => setFilter(f)}
            >
              {f === "All" ? "All" : f + "s"}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="dash-card dash-empty">
            <h2 className="dash-card-title">No bookings here yet</h2>
            <p className="dash-muted">Pick a scrim or tournament and book your first slot.</p>
            <Link to="/team-registration" className="dash-btn">Book a slot</Link>
          </div>
        ) : (
          <div className="dash-list">
            {visible.map((b) => (
              <article className="dash-card booking-card" key={b.id}>
                <div className="booking-main">
                  <div className="booking-top">
                    <span className="dash-badge dash-badge-purple">{b.type}</span>
                    <span className={badgeClass(b.status)}>{b.status}</span>
                  </div>
                  <h2 className="booking-title">{b.title}</h2>
                  <p className="dash-muted">Booking {b.id} · {b.mode === "Solo" ? "Player" : "Team"} {b.team}</p>
                </div>

                <dl className="booking-meta">
                  <div><dt>Date</dt><dd>{b.date}</dd></div>
                  <div><dt>Time</dt><dd>{b.time}</dd></div>
                  <div><dt>Slot</dt><dd>{b.slot}</dd></div>
                  <div><dt>Total fee</dt><dd>{b.fee}</dd></div>
                </dl>

                {(b.status === "Confirmed" || b.status === "Pending") && (
                  <button type="button" className="dash-btn dash-btn-danger dash-btn-small" onClick={() => cancelBooking(b.id)}>
                    Cancel booking
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
