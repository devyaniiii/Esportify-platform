import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";

// Sample lobbies for the hero card. Replace with GET /api/scrims later.
const lobbies = [
  { name: "Erangel Scrims, 9:00 PM", filled: 18, total: 25 },
  { name: "Miramar Scrims, 10:00 PM", filled: 22, total: 25 },
  { name: "Rondo, Sunday 8:00 PM", filled: 40, total: 100 },
];

// Strict rule: 8+ characters with small letter, capital letter, number and symbol
const passwordError = (pw) => {
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(pw)) return "Password needs a small letter (a-z)";
  if (!/[A-Z]/.test(pw)) return "Password needs a capital letter (A-Z)";
  if (!/\d/.test(pw)) return "Password needs a number (0-9)";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password needs a symbol, like @ # $ !";
  return "";
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("player");
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleLabel = role === "admin" ? "Admin" : "Player";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email, like you@example.com";
    if (!form.password) newErrors.password = "Enter your password";
    else if (passwordError(form.password))
      newErrors.password = passwordError(form.password);
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // Demo login against accounts saved in this browser.
    // TODO: replace with POST /api/auth/login once the Spring Boot backend is ready.
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("esportify_users") || "[]");
      const found = users.find((u) => u.email === form.email.trim().toLowerCase());
      const accountType = found ? found.accountType || "player" : role;

      if (!found) {
        setErrors({ email: "No account found with this email. Register first." });
        setLoading(false);
      } else if (found.password !== form.password) {
        setErrors({ password: "Incorrect password" });
        setLoading(false);
      } else if (accountType !== role) {
        const actual = accountType === "admin" ? "Admin" : "Player";
        setErrors({ email: `This account is a ${actual}. Select ${actual} and try again.` });
        setLoading(false);
      } else {
        localStorage.removeItem("esportify_current");
        sessionStorage.removeItem("esportify_current");
        (form.remember ? localStorage : sessionStorage).setItem("esportify_current", found.email);
        // Return users to the booking flow they requested before login.
        const returnTo = location.state?.from;
        const event = location.state?.event;
        if (returnTo) {
          navigate(returnTo, { replace: true, state: event ? { event } : undefined });
        } else {
          navigate(accountType === "admin" ? "/profile" : "/my-bookings");
        }
      }
    }, 700);
  };

  const tabClass = ({ isActive }) => (isActive ? "auth-tab auth-tab-active" : "auth-tab");

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand">
          <span className="auth-logo">E</span>
          <span className="auth-brand-name">ESPORTIFY</span>
        </div>

        <div>
          <h1 className="auth-headline">
            YOUR NEXT<br />
            <span className="auth-headline-accent">BGMI SCRIM</span><br />
            STARTS HERE.
          </h1>
          <p className="auth-hero-text">
            Log in to manage your squad, join custom rooms and track your BGMI rank.
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
          <span className="auth-chips-label">Continue as</span>
          {["player", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              className={`auth-chip auth-chip-${r}` + (role === r ? " auth-chip-active" : "")}
              onClick={() => { setRole(r); setErrors({}); }}
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
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password" name="password" autoComplete="current-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange}
                  aria-invalid={!!errors.password}
                />
                <button type="button" className="auth-toggle" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-link-underline">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? "Logging in..." : `Log in as ${roleLabel}`}
            </button>
          </form>

          <p className="auth-switch">
            New BGMI player? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;