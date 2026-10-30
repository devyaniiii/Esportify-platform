import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const getCurrentUser = () => {
  const email =
    sessionStorage.getItem("esportify_current") || localStorage.getItem("esportify_current");
  const users = JSON.parse(localStorage.getItem("esportify_users") || "[]");
  return users.find((u) => u.email === email) || null;
};

// Sample events. Replace with GET /api/events once the backend is ready.
const events = [
  { id: "e1", title: "Erangel Scrims", type: "Scrim", date: "30 Oct 2026", time: "9:00 PM", fee: "₹50", left: 7 },
  { id: "e2", title: "Miramar Scrims", type: "Scrim", date: "30 Oct 2026", time: "10:00 PM", fee: "₹50", left: 3 },
  { id: "e3", title: "Rondo", type: "Tournament", date: "1 Nov 2026", time: "8:00 PM", fee: "₹100", left: 60 },
  { id: "e4", title: "Pune Clash Season 3", type: "Tournament", date: "8 Nov 2026", time: "7:00 PM", fee: "₹200", left: 24 },
];

// teammates = how many players join the captain
const modes = {
  solo: { label: "Solo", teammates: 0, note: "1 player" },
  duo: { label: "Duo", teammates: 1, note: "2 players" },
  squad: { label: "Squad", teammates: 3, note: "4 players" },
};

const emptyPlayer = { name: "", bgmiId: "" };

function TeamRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  // The tournaments page can send the chosen event like this:
  // navigate("/team-registration", { state: { event: { title, type, date, time, fee } } })
  const passed = location.state?.event;
  const allEvents =
    passed && !events.some((e) => e.title === passed.title)
      ? [{ ...passed, id: "passed", left: passed.left ?? null }, ...events]
      : events;

  const [eventId, setEventId] = useState(
    () => allEvents.find((e) => passed && e.title === passed.title)?.id || allEvents[0].id
  );
  const [mode, setMode] = useState("squad");
  const [team, setTeam] = useState({
    teamName: "",
    captainName: user?.username || "",
    captainId: user?.bgmiId || "",
    phone: user?.phone || "",
  });
  const [players, setPlayers] = useState([emptyPlayer, emptyPlayer, emptyPlayer]);
  const [errors, setErrors] = useState({});

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/team-registration", event: passed }}
      />
    );
  }

  const event = allEvents.find((e) => e.id === eventId) || allEvents[0];
  const isSolo = mode === "solo";
  const teammates = modes[mode].teammates;
  const perPlayerFee = Number(String(event.fee).replace(/[^\d]/g, "")) || 0;
  const totalFee = "₹" + perPlayerFee * (teammates + 1);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePlayerChange = (index, key, value) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
    setErrors((prev) => ({ ...prev, [`p${index}${key}`]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!isSolo && !team.teamName.trim()) e.teamName = "Enter your team name";
    if (!team.captainName.trim()) e.captainName = isSolo ? "Enter your in-game name" : "Enter the captain's name";
    if (!/^\d{8,12}$/.test(team.captainId)) e.captainId = "BGMI ID must be 8 to 12 digits";
    if (!/^\d{10}$/.test(team.phone)) e.phone = "Enter a 10-digit phone number";
    players.slice(0, teammates).forEach((p, i) => {
      if (!p.name.trim()) e[`p${i}name`] = "Enter the player's name";
      if (!/^\d{8,12}$/.test(p.bgmiId)) e[`p${i}bgmiId`] = "BGMI ID must be 8 to 12 digits";
    });
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // TODO: send POST /api/bookings to the backend and use the booking returned by the API
    const id = "ESP-" + Math.floor(1000 + Math.random() * 9000);
    const slot = "#" + Math.floor(1 + Math.random() * 25);
    const teamLabel = isSolo ? team.captainName.trim() : team.teamName.trim();

    const key = `esportify_bookings_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const saved = {
      id,
      type: event.type || "Tournament",
      mode: modes[mode].label,
      title: event.title,
      date: event.date,
      time: event.time,
      slot,
      fee: totalFee,
      team: teamLabel,
      status: "Confirmed",
    };
    localStorage.setItem(key, JSON.stringify([saved, ...existing]));

    navigate("/booking-confirmation", {
      state: {
        booking: {
          id,
          event,
          mode: modes[mode].label,
          teamName: teamLabel,
          captainName: team.captainName,
          fee: totalFee,
          slot,
        },
      },
    });
  };

  const input = (id, label, value, onChange, placeholder, error) => (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={!!error} />
      {error && <span className="auth-error">{error}</span>}
    </div>
  );

  return (
    <div className="dash-page">
      <div className="dash-container dash-container-narrow">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Book your slot</h1>
            <p className="dash-subtitle">
              Choose a tournament or scrim, pick how you play, and add your details.
            </p>
          </div>
          <Link to="/my-bookings" className="dash-btn dash-btn-ghost">My bookings</Link>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <section className="dash-card dash-section">
            <h2 className="dash-card-title">Choose tournament or scrim</h2>
            <div className="event-grid">
              {allEvents.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  aria-pressed={eventId === ev.id}
                  className={eventId === ev.id ? "event-card event-card-active" : "event-card"}
                  onClick={() => setEventId(ev.id)}
                >
                  <span className="event-card-top">
                    <span className="dash-badge dash-badge-purple">{ev.type}</span>
                    {ev.left != null && <span className="event-left">{ev.left} slots left</span>}
                  </span>
                  <span className="event-title">{ev.title}</span>
                  <span className="event-meta">{ev.date} · {ev.time}</span>
                  <span className="event-fee">{ev.fee} per player</span>
                </button>
              ))}
            </div>
          </section>

          <section className="dash-card dash-section">
            <h2 className="dash-card-title">Choose how you play</h2>
            <div className="dash-filters" role="tablist" aria-label="Play mode" style={{ marginBottom: 0 }}>
              {Object.entries(modes).map(([key, m]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={mode === key}
                  className={mode === key ? "dash-filter dash-filter-active" : "dash-filter"}
                  onClick={() => { setMode(key); setErrors({}); }}
                >
                  {m.label} ({m.note}) · ₹{perPlayerFee * (m.teammates + 1)}
                </button>
              ))}
            </div>
          </section>

          <section className="dash-card dash-section">
            <h2 className="dash-card-title">{isSolo ? "Your details" : "Team details"}</h2>
            <div className="dash-form-grid">
              {!isSolo &&
                input("teamName", "Team name", team.teamName, handleTeamChange, "e.g. Shadow Squad", errors.teamName)}
              {input("phone", "Contact number", team.phone, handleTeamChange, "10-digit mobile number", errors.phone)}
              {input(
                "captainName",
                isSolo ? "In-game name" : "Captain name",
                team.captainName,
                handleTeamChange,
                isSolo ? "Your in-game name" : "Captain's in-game name",
                errors.captainName
              )}
              {input(
                "captainId",
                isSolo ? "BGMI ID" : "Captain BGMI ID",
                team.captainId,
                handleTeamChange,
                "e.g. 5123456789",
                errors.captainId
              )}
            </div>
          </section>

          {teammates > 0 && (
            <section className="dash-card dash-section">
              <h2 className="dash-card-title">Players</h2>
              <p className="dash-muted dash-section-note">
                The captain plus {teammates} {teammates === 1 ? "teammate" : "teammates"} make a{" "}
                {modes[mode].label.toLowerCase()} of {teammates + 1}.
              </p>
              {players.slice(0, teammates).map((p, i) => (
                <div className="dash-form-grid dash-player-row" key={i}>
                  {input(`player${i}name`, `Player ${i + 2} name`, p.name, (e) => handlePlayerChange(i, "name", e.target.value), "In-game name", errors[`p${i}name`])}
                  {input(`player${i}id`, `Player ${i + 2} BGMI ID`, p.bgmiId, (e) => handlePlayerChange(i, "bgmiId", e.target.value), "e.g. 5123456789", errors[`p${i}bgmiId`])}
                </div>
              ))}
            </section>
          )}

          <div className="dash-card dash-section dash-fee">
            <span>
              {event.title} · {modes[mode].label} · ₹{perPlayerFee} × {teammates + 1}{" "}
              {teammates === 0 ? "player" : "players"}
            </span>
            <strong>Total {totalFee}</strong>
          </div>

          <button type="submit" className="auth-button">
            Confirm {modes[mode].label.toLowerCase()} booking · {totalFee}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamRegistration;