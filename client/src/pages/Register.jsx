import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const lobbies = [
  { name: "Erangel Scrims, 9:00 PM", filled: 18, total: 25 },
  { name: "Miramar Scrims, 10:00 PM", filled: 22, total: 25 },
  { name: "Rondo, Sunday 8:00 PM", filled: 40, total: 100 },
];

const initialForm = { username: "", bgmiId: "", email: "", password: "", confirmPassword: "" };

// 0 to 4 based on length, mixed case, numbers and symbols
const passwordScore = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabels = ["", "Weak", "Okay", "Good", "Strong"];

// Strict rule: 8+ characters with small letter, capital letter, number and symbol
const passwordError = (pw) => {
  if (!pw) return "Enter a password";
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(pw)) return "Add at least one small letter (a-z)";
  if (!/[A-Z]/.test(pw)) return "Add at least one capital letter (A-Z)";
  if (!/\d/.test(pw)) return "Add at least one number (0-9)";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add at least one symbol, like @ # $ !";
  return "";
};

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("player");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Enter your in-game name";
    if (!/^\d{8,12}$/.test(form.bgmiId)) newErrors.bgmiId = "Enter your BGMI ID (8 to 12 digits)";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email, like you@example.com";
    if (passwordError(form.password)) newErrors.password = passwordError(form.password);
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Demo account saved in this browser. Passwords are stored in plain text here
    // ONLY because there is no backend yet.
    // TODO: replace with POST /api/auth/register once the Spring Boot backend is ready.
    // TODO: in the real app, admin accounts must be created by the backend, not by public sign up.
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("esportify_users") || "[]");
      const email = form.email.trim().toLowerCase();

      if (users.some((u) => u.email === email)) {
        setErrors({ email: "An account with this email already exists. Log in instead." });
        setLoading(false);
        return;
      }

      const newUser = {
        username: form.username.trim(),
        bgmiId: form.bgmiId,
        email,
        password: form.password,
        accountType: role,
        phone: "",
        city: "",
        role: "",
      };
      localStorage.setItem("esportify_users", JSON.stringify([...users, newUser]));
      localStorage.removeItem("esportify_current");
      sessionStorage.removeItem("esportify_current");
      localStorage.setItem("esportify_current", email);
      // Return users to the booking flow they requested before registering.
      const returnTo = location.state?.from;
      const event = location.state?.event;
      if (returnTo) {
        navigate(returnTo, { replace: true, state: event ? { event } : undefined });
      } else {
        navigate(role === "admin" ? "/profile" : "/my-bookings");
      }
    }, 700);
  };

  const tabClass = ({ isActive }) => (isActive ? "auth-tab auth-tab-active" : "auth-tab");
  const score = passwordScore(form.password);

  const field = (id, label, type, placeholder, autoComplete) => {
    const isPassword = type === "password";
    return (
      <div className="auth-field">
        <label htmlFor={id}>{label}</label>
        <div className="auth-input-wrap">
          <input
            id={id} name={id} placeholder={placeholder} autoComplete={autoComplete}
            type={isPassword && showPw ? "text" : type}
            value={form[id]} onChange={handleChange} aria-invalid={!!errors[id]}
          />
          {id === "password" && (
            <button type="button" className="auth-toggle" onClick={() => setShowPw((s) => !s)}>
              {showPw ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {errors[id] && <span className="auth-error">{errors[id]}</span>}
        {id === "password" && !errors[id] && (
          <span className="auth-hint">Use 8+ characters with a capital letter, small letter, number and symbol.</span>
        )}
        {id === "password" && form.password && (
          <div className={`auth-strength auth-strength-${score}`}>
            {[0, 1, 2, 3].map((i) => <i key={i} className={i < score ? "on" : ""} />)}
            <span className="auth-strength-label">{strengthLabels[score] || "Too short"}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand">
          <span className="auth-logo">E</span>
          <span className="auth-brand-name">ESPORTIFY</span>
        </div>

        <div>
          <h1 className="auth-headline">
            BUILD YOUR<br />
            <span className="auth-headline-accent">SQUAD</span><br />
            AND JOIN IN.
          </h1>
          <p className="auth-hero-text">
            Create a free account to book scrims, register your team for tournaments
            and track your bookings.
          </p>

          <div className="auth-lobbies">
            <div className="auth-lobbies-head">
              <span className="auth-live-dot" aria-hidden="true" />
              Open for booking
            </div>
            {lobbies.map((l) => (
              <div className="auth-lobby" key={l.name}>
                <span className="auth-lobby-name">{l.name}</span>
                <span className="auth-lobby-slots">{l.total - l.filled} slots left</span>
                <div className="auth-lobby-bar">
                  <span style={{ width: `${(l.filled / l.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-chips" role="group" aria-label="Account type">
          <span className="auth-chips-label">Register as</span>
          {["player", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              className={`auth-chip auth-chip-${r}` + (role === r ? " auth-chip-active" : "")}
              onClick={() => setRole(r)}
            >
              {r === "player" ? "Player" : "Admin"}
            </button>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <nav className="auth-tabs" aria-label="Account">
            <NavLink to="/login" className={tabClass}>Log in</NavLink>
            <NavLink to="/register" className={tabClass}>Register</NavLink>
          </nav>

          <form onSubmit={handleSubmit} noValidate>
            {field("username", "In-game name", "text", "Your BGMI name", "nickname")}
            {field("bgmiId", "BGMI ID", "text", "e.g. 5123456789", "off")}
            {field("email", "Email", "email", "you@example.com", "email")}
            {field("password", "Password", "password", "Example: Esport@2026", "new-password")}
            {field("confirmPassword", "Confirm password", "password", "Re-enter your password", "new-password")}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? "Creating account..." : `Create ${role} account`}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;