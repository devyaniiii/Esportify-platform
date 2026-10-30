import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="navbar">
            <Link to="/" className="logo" onClick={() => setOpen(false)}>
                <span className="logo-box">E</span>
                <span className="logo-text">ESPORTIFY</span>
            </Link>

            <button
                className="menu-btn"
                onClick={() => setOpen((value) => !value)}
                aria-label="Toggle menu"
                aria-expanded={open}
            >
                {open ? "✕" : "☰"}
            </button>

            <div className={open ? "nav-menu open" : "nav-menu"} onClick={() => setOpen(false)}>
                <nav className="nav-links">
                    <Link to="/scrims">Scrims</Link>
                    <Link to="/tournaments">Tournaments</Link>
                    <Link to="/#leaderboard">Leaderboard</Link>
                    <Link to="/#about">About</Link>
                    <Link to="/#contact">Contact</Link>
                </nav>

                <div className="nav-buttons">
                    <Link to="/login" className="btn btn-outline">Log in</Link>
                    <Link to="/register" className="btn btn-orange">Register</Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;