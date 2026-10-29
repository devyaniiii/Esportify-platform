import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

// Strict rule: 8+ characters with small letter, capital letter, number and symbol
const passwordError = (pw) => {
  if (!pw) return "Enter a new password";
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(pw)) return "Add at least one small letter (a-z)";
  if (!/[A-Z]/.test(pw)) return "Add at least one capital letter (A-Z)";
  if (!/\d/.test(pw)) return "Add at least one number (0-9)";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add at least one symbol, like @ # $ !";
  return "";
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = email, 2 = code + new password, 3 = done
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [form, setForm] = useState({ code: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setExpiresAt(Date.now() + 5 * 60 * 1000); // valid for 5 minutes
    setForm({ code: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  // ---------- Step 1: check the email ----------
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return setErrors({ email: "Enter your email" });
    if (!/^\S+@\S+\.\S+$/.test(clean))
      return setErrors({ email: "Enter a valid email, like you@example.com" });

    setLoading(true);
    // TODO: replace with POST /api/auth/forgot-password once the Spring Boot backend is ready.
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("esportify_users") || "[]");
      if (!users.some((u) => u.email === clean)) {
        setErrors({ email: "No account found with this email. Register first." });
        setLoading(false);
        return;
      }
      setEmail(clean);
      makeCode();
      setStep(2);
      setLoading(false);
    }, 600);
  };

  // ---------- Step 2: check the code and save the new password ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.code.trim()) newErrors.code = "Enter the 6-digit code";
    else if (Date.now() > expiresAt) newErrors.code = "This code has expired. Send a new code.";
    else if (form.code.trim() !== sentCode) newErrors.code = "Wrong code. Check and try again.";

    if (passwordError(form.password)) newErrors.password = passwordError(form.password);
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // TODO: replace with POST /api/auth/reset-password once the Spring Boot backend is ready.
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("esportify_users") || "[]");
      const updated = users.map((u) => (u.email === email ? { ...u, password: form.password } : u));
      localStorage.setItem("esportify_users", JSON.stringify(updated));
      setLoading(false);
      setStep(3);
    }, 600);
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
            LOCKED OUT?<br />
            <span className="auth-headline-accent">GET BACK</span><br />
            IN THE GAME.
          </h1>
          <p className="auth-hero-text">
            Enter your email, confirm the code and choose a new password. It takes less than a minute.
          </p>
        </div>

        <div />
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          {/* ---------- STEP 1 ---------- */}
          {step === 1 && (
            <>
              <h2 className="dash-card-title">Forgot your password?</h2>
              <p className="dash-muted" style={{ marginBottom: 24 }}>
                Enter the email you registered with. We will send you a 6-digit code.
              </p>

              <form onSubmit={handleEmailSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email" autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <span className="auth-error">{errors.email}</span>}
                  {errors.email && errors.email.startsWith("No account found") && (
                    <Link to="/register" className="auth-register-btn">
                      Register a new account
                    </Link>
                  )}
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading && <span className="auth-spinner" aria-hidden="true" />}
                  {loading ? "Checking..." : "Send reset code"}
                </button>
              </form>
            </>
          )}

          {/* ---------- STEP 2 ---------- */}
          {step === 2 && (
            <>
              <h2 className="dash-card-title">Create a new password</h2>
              <p className="dash-muted">Code sent for {email}</p>

              {/* DEMO ONLY: remove this box when the backend emails the code */}
              <p className="auth-success" style={{ textAlign: "left", marginBottom: 24 }}>
                Demo mode: your code is <strong>{sentCode}</strong>. In the real app this code is
                sent to your email.
              </p>

              <form onSubmit={handleResetSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="code">6-digit code</label>
                  <input
                    id="code" name="code" inputMode="numeric" maxLength={6}
                    placeholder="Enter the code"
                    value={form.code} onChange={handleChange}
                    aria-invalid={!!errors.code}
                  />
                  {errors.code && <span className="auth-error">{errors.code}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="password">New password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="password" name="password" autoComplete="new-password"
                      type={showPw ? "text" : "password"}
                      placeholder="Example: Esport@2026"
                      value={form.password} onChange={handleChange}
                      aria-invalid={!!errors.password}
                    />
                    <button type="button" className="auth-toggle" onClick={() => setShowPw((s) => !s)}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password ? (
                    <span className="auth-error">{errors.password}</span>
                  ) : (
                    <span className="auth-hint">
                      Use 8+ characters with a capital letter, small letter, number and symbol.
                    </span>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword" name="confirmPassword" autoComplete="new-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={form.confirmPassword} onChange={handleChange}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading && <span className="auth-spinner" aria-hidden="true" />}
                  {loading ? "Saving..." : "Reset password"}
                </button>
              </form>

              <p className="auth-switch">
                Didn't get a code?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); makeCode(); }}>Send a new code</a>
              </p>
            </>
          )}

          {/* ---------- STEP 3 ---------- */}
          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <div className="confirm-icon" aria-hidden="true">✓</div>
              <h2 className="dash-card-title">Password changed</h2>
              <p className="dash-muted" style={{ marginBottom: 24 }}>
                Your password was updated. Log in with your new password.
              </p>
              <button type="button" className="auth-button" onClick={() => navigate("/login")}>
                Go to log in
              </button>
            </div>
          )}

          {step !== 3 && (
            <p className="auth-switch">
              Remember your password? <Link to="/login">Back to log in</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;