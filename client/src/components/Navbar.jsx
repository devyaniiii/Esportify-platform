import { useState } from "react";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="navbar">
            <a href="/" className="logo">
                <span className="logo-box">E</span>
                <span className="logo-text">ESPORTIFY</span>
            </a>

            <button
                className="menu-btn"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
            >
                {open ? "✕" : "☰"}
            </button>

            <div
                className={open ? "nav-menu open" : "nav-menu"}
                onClick={() => setOpen(false)}
            >
                <nav className="nav-links">
                    <a href="#scrims">Scrims</a>
                    <a href="#tournaments">Tournaments</a>
                    <a href="#leaderboard">Leaderboard</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </nav>

                <div className="nav-buttons">
                    <a href="/login" className="btn btn-outline">Log in</a>
                    <a href="/register" className="btn btn-orange">Register</a>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
