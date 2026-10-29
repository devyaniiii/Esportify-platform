import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

const scrims = [
    { id: 1, mode: "Squad", type: "SQUAD · TPP", time: "Today 8:00 PM", title: "[Organizer] Daily Scrim", info: "5 matches · 22 / 25 slots", button: "Join now", primary: true },
    { id: 2, mode: "Duo", type: "DUO · FPP", time: "Today 10:00 PM", title: "[Organizer] Duo Rush", info: "4 matches · 30 / 50 slots", button: "Join now", primary: true },
    { id: 3, mode: "Squad", type: "SQUAD · TPP", time: "Tomorrow 7:00 PM", title: "[Organizer] Weekend Cup Qualifier", info: "6 matches · 12 / 25 slots", button: "Request a slot", primary: false },
];

const tournaments = [
    { id: 1, name: "Esportify Weekend Cup", prize: "₹10,000", date: "15 Nov, 6:00 PM", teams: "32 teams", status: "Registrations open" },
    { id: 2, name: "Campus Clash Season 1", prize: "₹5,000", date: "22 Nov, 5:00 PM", teams: "64 teams", status: "Registrations open" },
    { id: 3, name: "Night Owl Invitational", prize: "₹7,500", date: "29 Nov, 9:00 PM", teams: "16 teams", status: "Few slots left" },
];

const leaderboard = [
    { rank: 1, team: "[Team Alpha]", matches: 18, kills: 96, points: 214 },
    { rank: 2, team: "[Team Bravo]", matches: 18, kills: 88, points: 201 },
    { rank: 3, team: "[Team Charlie]", matches: 17, kills: 79, points: 187 },
];

const steps = [
    { num: "01", title: "Create your team", text: "Add players by invite or open applications." },
    { num: "02", title: "Join a scrim", text: "Pick a slot or send a request to the organizer." },
    { num: "03", title: "Get room details", text: "Room ID and password unlock before each match." },
    { num: "04", title: "Track results", text: "Points and ranks update after every match." },
];

const aboutPoints = [
    { title: "Built for BGMI players", text: "Scrims, custom rooms and tournaments for solo, duo and squad players." },
    { title: "Fair and transparent", text: "Points update after every match and organizers can set their own scoring." },
    { title: "Easy for organizers", text: "Create a scrim, approve slot requests and share room details on time." },
];

const filters = ["All", "Solo", "Duo", "Squad"];

function Home() {
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    const visibleScrims =
        filter === "All" ? scrims : scrims.filter((s) => s.mode === filter);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSent(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // No backend yet: just show a confirmation and clear the form
        setSent(true);
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div className="home">
            <Navbar />

            {/* HERO */}
            <section className="hero">
                <div className="hero-left">
                    <span className="live-pill">● 24 BGMI scrims live today</span>
                    <h1>
                        PLAY SCRIMS. <br />
                        WIN TOURNAMENTS. <br />
                        <span className="orange">CLIMB THE RANKS.</span>
                    </h1>
                    <p className="hero-text">
                        Find BGMI custom rooms, register your squad of 4, get the Room ID
                        and password on time, and see live standings after every match.
                    </p>
                    <div className="hero-buttons">
                        <a href="#scrims" className="btn btn-orange big">Book Scrims</a>
                        <a href="/signup" className="btn btn-outline big">Create your team</a>
                    </div>
                    <div className="stats">
                        <div><strong>1,200+</strong><span>Players</span></div>
                        <div><strong>320</strong><span>Teams</span></div>
                        <div><strong>85</strong><span>Scrims / week</span></div>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="featured-card">
                        <div className="scrim-top">
                            <span className="featured-tag">FEATURED</span>
                            <span className="scrim-time">Starts 9:00 PM</span>
                        </div>
                        <h2>Night Squad Scrim #42</h2>
                        <div className="tags">
                            <span>Squad</span>
                            <span>TPP</span>
                            <span>6 matches</span>
                            <span>Erangel, Miramar, Sanhok</span>
                        </div>
                        <div className="slots-row">
                            <span>Slots filled</span>
                            <span>18 / 25</span>
                        </div>
                        <div className="progress">
                            <div className="progress-fill" style={{ width: "72%" }}></div>
                        </div>
                        <button className="btn btn-light full">Request a slot</button>
                    </div>
                </div>
            </section>

            {/* UPCOMING SCRIMS */}
            <section className="section" id="scrims">
                <div className="section-head">
                    <h2 className="section-title">UPCOMING BGMI SCRIMS</h2>
                    <div className="filters">
                        {filters.map((f) => (
                            <button
                                key={f}
                                className={filter === f ? "chip active" : "chip"}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="scrim-grid">
                    {visibleScrims.map((s) => (
                        <div key={s.id} className="scrim-card">
                            <div className="scrim-top">
                                <span className="scrim-type">{s.type}</span>
                                <span className="scrim-time">{s.time}</span>
                            </div>
                            <h3 className="scrim-title">{s.title}</h3>
                            <p className="scrim-info">{s.info}</p>
                            <button
                                className={s.primary ? "btn btn-orange full" : "btn btn-dark full"}
                            >
                                {s.button}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED TOURNAMENTS */}
            <section className="section" id="tournaments">
                <h2 className="section-title">FEATURED TOURNAMENTS</h2>
                <div className="tournament-grid">
                    {tournaments.map((t) => (
                        <div key={t.id} className="scrim-card">
                            <div className="scrim-top">
                                <span className="scrim-type">TOURNAMENT</span>
                                <span className="scrim-time">{t.status}</span>
                            </div>
                            <h3 className="scrim-title">{t.name}</h3>
                            <div className="prize">{t.prize}</div>
                            <div className="t-meta">
                                <span>{t.date}</span>
                                <span>{t.teams}</span>
                            </div>
                            <button className="btn btn-orange full">Register team</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* LEADERBOARD */}
            <section className="section" id="leaderboard">
                <h2 className="section-title">WEEKLY LEADERBOARD</h2>
                <div className="table-box">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Team</th>
                                <th>Matches</th>
                                <th>Kills</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((row) => (
                                <tr key={row.rank}>
                                    <td className="orange rank">{row.rank}</td>
                                    <td className="bold">{row.team}</td>
                                    <td>{row.matches}</td>
                                    <td>{row.kills}</td>
                                    <td className="bold">{row.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="note">
                    Example scoring (organizers can change it): placement points 1st 10,
                    2nd 6, 3rd 5, 4th 4, 5th 3, 6th 2, 7th–8th 1, plus 1 point per kill.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="how" id="how-it-works">
                <h2 className="section-title">HOW IT WORKS</h2>
                <div className="steps">
                    {steps.map((s) => (
                        <div key={s.num} className="step">
                            <div className="step-num">{s.num}</div>
                            <h3>{s.title}</h3>
                            <p>{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ABOUT US */}
            <section className="about" id="about">
                <div>
                    <h2 className="section-title">ABOUT US</h2>
                    <p>
                        Esportify is a community platform where BGMI players find scrims,
                        join tournaments and see how their squad ranks. It started as a
                        final year project by a team of three students who wanted an easier
                        way to run and join custom rooms.
                    </p>
                    <p>
                        Players get one place to manage their team and registrations.
                        Organizers get tools to approve slots, share room details and
                        publish results.
                    </p>
                </div>
                <div className="about-points">
                    {aboutPoints.map((p) => (
                        <div key={p.title} className="about-point">
                            <h3>{p.title}</h3>
                            <p>{p.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section className="contact" id="contact">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2 className="section-title">CONTACT US</h2>
                        <p>
                            Have a question about a scrim, a tournament or your account?
                            Send us a message and we will reply as soon as we can.
                        </p>
                        <p className="contact-line">support@esportify.com</p>
                        <p className="contact-line">+91 00000 00000</p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your message"
                            rows="5"
                            value={form.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" className="btn btn-orange big">
                            Send message
                        </button>
                        {sent && (
                            <p className="form-success">
                                Message sent. We will get back to you soon.
                            </p>
                        )}
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
