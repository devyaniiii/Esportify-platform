
import React, { useMemo, useState } from "react";
import {
    ArrowDownRight,
    Crosshair,
    ShieldCheck,
    Swords,
} from "lucide-react";

import { Scrims } from "../data/events.js";
import EventFilters from "../components/EventFilters.jsx";
import ScrimCard from "../components/ScrimCard.jsx";

export default function Scrims() {
    // =========================
    // STATE
    // =========================

    const [search, setSearch] = useState("");
    const [mode, setMode] = useState("All");
    const [map, setMap] = useState("All");
    const [maxFee, setMaxFee] = useState("All");
    const [sort, setSort] = useState("date");

    // =========================
    // FILTER AND SORT SCRIMS
    // =========================

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();

        return scrims
            .filter((scrim) => {
                const matchesSearch = [
                    scrim.title,
                    scrim.organizer,
                    scrim.map,
                    scrim.mode,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(q);

                const matchesMode =
                    mode === "All" || scrim.mode === mode;

                const matchesMap =
                    map === "All" ||
                    scrim.map === map ||
                    scrim.maps?.includes(map);

                const matchesFee =
                    maxFee === "All" ||
                    (maxFee === "0"
                        ? scrim.fee === 0
                        : scrim.fee <= Number(maxFee));

                return (
                    matchesSearch &&
                    matchesMode &&
                    matchesMap &&
                    matchesFee
                );
            })
            .sort((a, b) => {
                if (sort === "feeLow") return a.fee - b.fee;
                if (sort === "feeHigh") return b.fee - a.fee;
                if (sort === "slots") {
                    return (b.slots - b.filled) - (a.slots - a.filled);
                }
                if (sort === "prize") return b.prize - a.prize;

                return new Date(a.date) - new Date(b.date);
            });
    }, [search, mode, map, maxFee, sort]);

    // =========================
    // RESET FILTERS
    // =========================

    const reset = () => {
        setSearch("");
        setMode("All");
        setMap("All");
        setMaxFee("All");
        setSort("date");
    };

    // =========================
    // PAGE UI
    // =========================

    return (
        <main>
            {/* Hero Section */}
            <section className="hero hero-scrims">
                <div className="hero-inner">
                    <span className="eyebrow">
                        <i className="live-dot" />
                        COMPETITIVE BGMI ARENA
                    </span>

                    <h1>
                        FIND YOUR NEXT{" "}
                        <span>SCRIM.</span>
                    </h1>

                    <p>
                        Find your lobby. Lock in your squad.
                        Make every drop count.
                    </p>

                    <div className="hero-stats">
                        <div>
                            <strong>
                                {String(scrims.length).padStart(2, "0")}
                            </strong>
                            <span>Sample scrims</span>
                        </div>

                        <div>
                            <strong>
                                ₹
                                {scrims.length
                                    ? Math.max(
                                        ...scrims.map(
                                            (scrim) => scrim.prize
                                        )
                                    ).toLocaleString("en-IN")
                                    : "0"}
                            </strong>
                            <span>Top prize pool</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Squad energy</span>
                        </div>
                    </div>

                    <a className="hero-scroll" href="#scrims">
                        Explore scrims
                        <ArrowDownRight size={15} />
                    </a>
                </div>
            </section>

            {/* Scrim Listing Section */}
            <div className="content-wrap">
                <section
                    className="section-block"
                    id="scrims"
                >
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">
                                FIND YOUR MATCH
                            </span>

                            <h2>
                                Scrims{" "}
                                <span className="heading-muted">
                                    / All events
                                </span>
                            </h2>

                            <p>
                                Compare fees, maps, prizes and
                                available slots before choosing
                                your next lobby.
                            </p>
                        </div>

                        <span className="sample-badge">
                            SAMPLE EVENTS
                        </span>
                    </div>

                    {/* Search, Filters and Sorting */}
                    <EventFilters
                        search={search}
                        setSearch={setSearch}
                        mode={mode}
                        setMode={setMode}
                        map={map}
                        setMap={setMap}
                        maxFee={maxFee}
                        setMaxFee={setMaxFee}
                        sort={sort}
                        setSort={setSort}
                        onReset={reset}
                    />

                    {/* Results Summary */}
                    <div className="results-line">
                        <span>
                            Showing{" "}
                            <strong>{filtered.length}</strong>{" "}
                            of {scrims.length} scrims
                        </span>

                        <span>All prices in INR (₹)</span>
                    </div>

                    {/* Scrim Cards */}
                    <div className="scrim-grid">
                        {filtered.length > 0 ? (
                            filtered.map((scrim) => (
                                <ScrimCard
                                    key={scrim.id}
                                    scrim={scrim}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Crosshair size={28} />

                                <h3>No scrims found</h3>

                                <p>
                                    Try changing your search
                                    or filters.
                                </p>

                                <button
                                    className="btn btn-secondary"
                                    onClick={reset}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Feature Banner */}
                <section className="feature-strip">
                    <div className="feature-icon">
                        <ShieldCheck size={22} />
                    </div>

                    <div>
                        <h3>
                            Choose your lobby with confidence
                        </h3>

                        <p>
                            Review event details and slot
                            availability before selecting
                            a sample booking.
                        </p>
                    </div>

                    <Swords
                        className="feature-watermark"
                        size={90}
                    />
                </section>

                {/* How It Works */}
                <section
                    className="section-block how-section"
                    id="how-it-works"
                >
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">
                                YOUR NEXT MATCH STARTS HERE
                            </span>

                            <h2>How it works</h2>
                        </div>
                    </div>

                    <div className="how-grid">
                        {[
                            [
                                "01",
                                "Find a scrim",
                                "Pick a lobby that matches your squad and play style.",
                            ],
                            [
                                "02",
                                "Check the details",
                                "Review maps, entry fees, timings and open slots.",
                            ],
                            [
                                "03",
                                "Book your slot",
                                "Try the sample booking action from an event card.",
                            ],
                            [
                                "04",
                                "Play and compete",
                                "Show up on time and bring your best game.",
                            ],
                        ].map(([number, title, description]) => (
                            <article
                                className="how-card"
                                key={number}
                            >
                                <span>{number}</span>

                                <h3>{title}</h3>

                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
