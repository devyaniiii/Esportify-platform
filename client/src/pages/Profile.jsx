import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getCurrentPlayer, logoutPlayer, readUsers, saveUsers } from "../auth.js";
import "../styles/auth.css";

const rows = [
  ["In-game name", "username", "text"],
  ["BGMI ID", "bgmiId", "text"],
  ["Email", "email", "email"],
  ["Phone", "phone", "tel"],
  ["City", "city", "text"],
  ["Preferred role", "role", "text"],
];

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentPlayer);
  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Not logged in: send the visitor to the login page.
  if (!user) return <Navigate to="/player/login" replace />;

  const bookings = JSON.parse(localStorage.getItem(`esportify_bookings_${user.email}`) || "[]");
  const active = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const startEdit = () => {
    setDraft(user);
    setErrors({});
    setMessage("");
    setEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!draft.username.trim()) newErrors.username = "Enter your in-game name";
    if (!/^\d{8,12}$/.test(draft.bgmiId)) newErrors.bgmiId = "BGMI ID must be 8 to 12 digits";
    if (draft.phone && !/^\d{10}$/.test(draft.phone)) newErrors.phone = "Enter a 10-digit phone number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // TODO: send PUT /api/users/me to the backend here
    const updated = { ...user, ...draft, username: draft.username.trim() };
    saveUsers(readUsers().map((u) => (u.email === user.email ? updated : u)));
    setUser(updated);
    setEditing(false);
    setMessage("Profile saved.");
  };

  const logout = () => {
    logoutPlayer();
    navigate("/");
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">My profile</h1>
            <p className="dash-subtitle">Your player details used for scrims and tournament slots.</p>
          </div>
          <div className="dash-actions dash-actions-top">
            <Link to="/player/dashboard" className="dash-btn dash-btn-ghost">Dashboard</Link>
            <Link to="/my-bookings" className="dash-btn dash-btn-ghost">My bookings</Link>
            <button type="button" className="dash-btn dash-btn-danger" onClick={logout}>Log out</button>
          </div>
        </header>

        {message && <p className="auth-success dash-notice">{message}</p>}

        <div className="dash-grid dash-grid-profile">
          <aside className="dash-card dash-avatar-card">
            <div className="dash-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <h2 className="dash-name">{user.username}</h2>
            <p className="dash-muted">BGMI ID {user.bgmiId}</p>
            <span className="dash-badge dash-badge-orange">Player</span>

            <div className="dash-stats">
              <div className="dash-stat"><strong>{bookings.length}</strong><span>Bookings</span></div>
              <div className="dash-stat"><strong>{active}</strong><span>Upcoming</span></div>
            </div>
          </aside>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Account information</h2>
              {!editing && (
                <button type="button" className="dash-btn dash-btn-small" onClick={startEdit}>
                  Edit profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} noValidate>
                <div className="dash-form-grid">
                  {rows.map(([label, name, type]) => (
                    <div className="auth-field" key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        id={name} name={name} type={type}
                        value={draft[name] || ""} onChange={handleChange}
                        disabled={name === "email"}
                        aria-invalid={!!errors[name]}
                      />
                      {name === "email" && <span className="auth-hint">Email is your login and can't be changed.</span>}
                      {errors[name] && <span className="auth-error">{errors[name]}</span>}
                    </div>
                  ))}
                </div>
                <div className="dash-actions">
                  <button type="submit" className="dash-btn">Save changes</button>
                  <button type="button" className="dash-btn dash-btn-ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="dash-details">
                {rows.map(([label, name]) => (
                  <div className="dash-detail" key={name}>
                    <dt>{label}</dt>
                    <dd className={user[name] ? "" : "dash-empty-value"}>{user[name] || "Not added"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
