import { useState } from "react";
import { Link } from "react-router-dom";
import LoginMenu from "./LoginMenu.jsx";
import Logo from "./Logo.jsx";
import { getAdminSession, getCurrentPlayer } from "../auth.js";

function Navbar() {
    const [open, setOpen] = useState(false);
    const loggedIn = Boolean(getAdminSession() || getCurrentPlayer());

    return (
        <header className="navbar">
            <Logo onClick={() => setOpen(false)} />

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
                    <LoginMenu />
                    {!loggedIn && (
                        <Link to="/player/register" className="btn btn-orange">Register</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
