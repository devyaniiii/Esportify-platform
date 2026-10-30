import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell.jsx";
import LobbyList from "../../components/LobbyList.jsx";
import { readUsers, startPlayerSession } from "../../auth.js";

// Strict rule: 8+ characters with small letter, capital letter, number and symbol
const passwordError = (pw) => {
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(pw)) return "Password needs a small letter (a-z)";
  if (!/[A-Z]/.test(pw)) return "Password needs a capital letter (A-Z)";
  if (!/\d/.test(pw)) return "Password needs a number (0-9)";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password needs a symbol, like @ # $ !";
  return "";
};

function PlayerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

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
    else if (passwordError(form.password)) newErrors.password = passwordError(form.password);
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
      const found = readUsers().find((u) => u.email === form.email.trim().toLowerCase());

      if (!found || found.accountType === "admin") {
        setErrors({ email: "No player account found with this email. Register first." });
        setLoading(false);
      } else if (found.password !== form.password) {
        setErrors({ password: "Incorrect password" });
        setLoading(false);
      } else {
        startPlayerSession(found.email, form.remember);
        // Return players to the booking flow they requested before logging in.
        const returnTo = location.state?.from;
        const event = location.state?.event;
        if (returnTo) {
          navigate(returnTo, { replace: true, state: event ? { event } : undefined });
        } else {
          navigate("/player/dashboard");
        }
      }
    }, 700);
  };

  return (
    <AuthShell
      tabs
      headline={["YOUR NEXT", "BGMI SCRIM", "STARTS HERE."]}
      accent={1}
      text="Log in to manage your squad, join custom rooms and track your BGMI rank."
      hero={<LobbyList />}
      switchText="Running events?"
      switchLabel="Admin login"
      switchTo="/admin/login"
    >
      <span className="portal-badge">Player login</span>

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
          {loading ? "Logging in..." : "Log in as Player"}
        </button>
      </form>

      <p className="auth-switch">
        New BGMI player? <Link to="/player/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export default PlayerLogin;
