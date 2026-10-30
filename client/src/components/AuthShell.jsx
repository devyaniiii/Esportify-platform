import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import "../styles/auth.css";
import "../styles/portal.css";

const tabClass = ({ isActive }) => (isActive ? "auth-tab auth-tab-active" : "auth-tab");

// Two-column layout shared by the player login, player register and admin login pages.
// Props: headline (array of lines), accent (index of the highlighted line), text,
// hero (extra content under the text), switchText / switchLabel / switchTo (the
// "other portal" link), tabs (show Log in / Register tabs, player only),
// children (the form).
function AuthShell({ headline, accent = 0, text, hero, switchText, switchLabel, switchTo, tabs, children }) {
  const last = headline.length - 1;

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <Logo />

        <div>
          <h1 className="auth-headline">
            {headline.map((line, i) => (
              <span key={line}>
                {i === accent ? <span className="auth-headline-accent">{line}</span> : line}
                {i < last && <br />}
              </span>
            ))}
          </h1>
          <p className="auth-hero-text">{text}</p>
          {hero}
        </div>

        <p className="portal-switch">
          {switchText} <Link to={switchTo}>{switchLabel}</Link>
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          {tabs && (
            <nav className="auth-tabs" aria-label="Account">
              <NavLink to="/player/login" className={tabClass}>Log in</NavLink>
              <NavLink to="/player/register" className={tabClass}>Register</NavLink>
            </nav>
          )}
          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthShell;
