import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell.jsx";
import { DEMO_ADMIN, loginAdmin } from "../../auth.js";

const adminPoints = [
  "Create and manage scrims and tournaments",
  "Approve slot requests and share room details",
  "View registered players and bookings",
];

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Enter your admin email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Enter your password";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // TODO: replace with POST /api/admin/login once the Spring Boot backend is ready.
    setTimeout(() => {
      if (loginAdmin(form.email, form.password)) {
        navigate(location.state?.from || "/admin/dashboard", { replace: true });
      } else {
        setErrors({ password: "Wrong admin email or password" });
        setLoading(false);
      }
    }, 600);
  };

  return (
    <AuthShell
      headline={["ESPORTIFY", "ADMIN", "CONTROL ROOM"]}
      accent={1}
      text="Sign in to run scrims, manage tournaments and keep an eye on your players."
      hero={
        <div className="auth-lobbies">
          <div className="auth-lobbies-head">
            <span className="auth-live-dot" aria-hidden="true" />
            What you can do
          </div>
          {adminPoints.map((p) => (
            <div className="auth-lobby" key={p}>
              <span className="auth-lobby-name">{p}</span>
            </div>
          ))}
        </div>
      }
      switchText="Just here to play?"
      switchLabel="Player login"
      switchTo="/player/login"
    >
      <span className="portal-badge portal-badge-admin">Admin login</span>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="admin-email">Admin email</label>
          <input
            id="admin-email" name="email" type="email" autoComplete="username"
            placeholder="admin@example.com"
            value={form.email} onChange={handleChange}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="auth-error">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="admin-password">Password</label>
          <div className="auth-input-wrap">
            <input
              id="admin-password" name="password" autoComplete="current-password"
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

        <button type="submit" className="auth-button" disabled={loading}>
          {loading && <span className="auth-spinner" aria-hidden="true" />}
          {loading ? "Checking..." : "Log in as Admin"}
        </button>
      </form>

      {/* Demo only. Remove this box once real admin accounts come from the backend. */}
      <p className="portal-demo">
        Demo admin: <strong>{DEMO_ADMIN.email}</strong> / <strong>{DEMO_ADMIN.password}</strong>
      </p>
      <p className="auth-switch">Admin accounts are created by the platform owner, not by sign up.</p>
    </AuthShell>
  );
}

export default AdminLogin;
