import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminSession, logoutAdmin, readUsers, saveUsers } from "../../auth.js";
import { scrims, tournaments } from "../../data/events.js";
import "../../styles/auth.css";
import "../../styles/portal.css";

const tabs = ["Overview", "Scrims", "Tournaments", "Players"];

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const bookingCount = (email) =>
  JSON.parse(localStorage.getItem(`esportify_bookings_${email}`) || "[]").length;

function FillBar({ filled, slots }) {
  const pct = Math.min(100, Math.round((filled / slots) * 100));
  return (
    <div className="portal-fill" title={`${filled} of ${slots} slots filled`}>
      <div className="portal-fill-bar"><span style={{ width: `${pct}%` }} /></div>
      <small>{filled}/{slots}</small>
    </div>
  );
}

// Page for admins only. Protected by <RequireAuth role="admin"> in App.jsx.
function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getAdminSession();
  const [tab, setTab] = useState("Overview");
  const [players, setPlayers] = useState(() =>
    readUsers().filter((u) => u.accountType !== "admin")
  );
  const [query, setQuery] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const totalBookings = players.reduce((sum, p) => sum + bookingCount(p.email), 0);
  const slotsFilled = scrims.reduce((sum, s) => sum + s.filled, 0);

  const visiblePlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) =>
      [p.username, p.email, p.bgmiId].join(" ").toLowerCase().includes(q)
    );
  }, [players, query]);

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const removePlayer = (email) => {
    // TODO: call DELETE /api/admin/players/{id} once the backend is ready
    saveUsers(readUsers().filter((u) => u.email !== email));
    localStorage.removeItem(`esportify_bookings_${email}`);
    setPlayers((prev) => prev.filter((p) => p.email !== email));
    setConfirmEmail("");
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <header className="dash-header">
          <div>
            <span className="portal-badge portal-badge-admin">Admin dashboard</span>
            <h1 className="dash-title">Control room</h1>
            <p className="dash-subtitle">Signed in as {admin.email}</p>
          </div>
          <div className="dash-actions dash-actions-top">
            <Link to="/" className="dash-btn dash-btn-ghost">View site</Link>
            <button type="button" className="dash-btn dash-btn-danger" onClick={logout}>Log out</button>
          </div>
        </header>

        <div className="dash-filters" role="tablist" aria-label="Admin sections">
          {tabs.map((t) => (
            <button
              key={t} type="button" role="tab" aria-selected={tab === t}
              className={tab === t ? "dash-filter dash-filter-active" : "dash-filter"}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <>
            <div className="portal-stats">
              <div className="portal-stat"><strong>{players.length}</strong><span>Registered players</span></div>
              <div className="portal-stat"><strong>{scrims.length}</strong><span>Scrims</span></div>
              <div className="portal-stat"><strong>{tournaments.length}</strong><span>Tournaments</span></div>
              <div className="portal-stat"><strong>{totalBookings}</strong><span>Player bookings</span></div>
            </div>

            <div className="dash-card">
              <div className="dash-card-head">
                <h2 className="dash-card-title">Scrim slots</h2>
                <span className="dash-badge dash-badge-orange">{slotsFilled} filled</span>
              </div>
              <p className="dash-muted">
                Scrims and tournaments come from <code>src/data/events.js</code> for now. They will
                be editable here once the backend is connected.
              </p>
            </div>
          </>
        )}

        {tab === "Scrims" && (
          <div className="dash-card portal-table-card">
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr><th>Scrim</th><th>Organizer</th><th>Mode</th><th>Map</th><th>When</th><th>Fee</th><th>Slots</th></tr>
                </thead>
                <tbody>
                  {scrims.map((s) => (
                    <tr key={s.id}>
                      <td className="portal-strong">{s.title}</td>
                      <td>{s.organizer}</td>
                      <td>{s.mode} · {s.perspective}</td>
                      <td>{s.map}</td>
                      <td>{s.date} {s.time}</td>
                      <td>{money(s.fee)}</td>
                      <td><FillBar filled={s.filled} slots={s.slots} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Tournaments" && (
          <div className="dash-card portal-table-card">
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr><th>Tournament</th><th>Organizer</th><th>Format</th><th>Dates</th><th>Entry</th><th>Prize</th><th>Teams</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {tournaments.map((t) => (
                    <tr key={t.id}>
                      <td className="portal-strong">{t.title}</td>
                      <td>{t.organizer}</td>
                      <td>{t.format}</td>
                      <td>{t.startDate} → {t.endDate}</td>
                      <td>{money(t.entryFee)}</td>
                      <td>{money(t.prize)}</td>
                      <td><FillBar filled={t.filled} slots={t.slots} /></td>
                      <td><span className="dash-badge dash-badge-green">{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Players" && (
          <div className="dash-card portal-table-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Registered players ({players.length})</h2>
              <input
                className="portal-search" type="search" placeholder="Search name, email or BGMI ID"
                value={query} onChange={(e) => setQuery(e.target.value)}
                aria-label="Search players"
              />
            </div>

            {visiblePlayers.length === 0 ? (
              <p className="dash-muted">
                {players.length === 0
                  ? "No players have registered in this browser yet."
                  : "No players match your search."}
              </p>
            ) : (
              <div className="portal-table-wrap">
                <table className="portal-table">
                  <thead>
                    <tr><th>In-game name</th><th>BGMI ID</th><th>Email</th><th>Bookings</th><th></th></tr>
                  </thead>
                  <tbody>
                    {visiblePlayers.map((p) => (
                      <tr key={p.email}>
                        <td className="portal-strong">{p.username}</td>
                        <td>{p.bgmiId}</td>
                        <td>{p.email}</td>
                        <td>{bookingCount(p.email)}</td>
                        <td className="portal-actions">
                          {confirmEmail === p.email ? (
                            <>
                              <button type="button" className="dash-btn dash-btn-danger dash-btn-small" onClick={() => removePlayer(p.email)}>
                                Confirm
                              </button>
                              <button type="button" className="dash-btn dash-btn-ghost dash-btn-small" onClick={() => setConfirmEmail("")}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button type="button" className="dash-btn dash-btn-ghost dash-btn-small" onClick={() => setConfirmEmail(p.email)}>
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
