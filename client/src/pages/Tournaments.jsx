
import React, { useMemo, useState } from "react";
import { CalendarDays, Search, Trophy } from "lucide-react";

import { tournaments } from "../data/events.js";
import TournamentCard from "../components/TournamentCard.jsx";

export default function Tournaments() {
    const [search, setSearch] = useState("");
    const [format, setFormat] = useState("All");
    const [sort, setSort] = useState("date");

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();

        return tournaments
            .filter((t) => {
                const matchesSearch = [t.title, t.organizer, t.map, t.format]
                    .join(" ")
                    .toLowerCase()
                    .includes(q);

                const matchesFormat =
                    format === "All" || t.format.startsWith(format);

                return matchesSearch && matchesFormat;
            })
            .sort((a, b) => {
                if (sort === "prize") return b.prize - a.prize;
                if (sort === "fee") return a.entryFee - b.entryFee;

                return new Date(a.startDate) - new Date(b.startDate);
            });
    }, [search, format, sort]);

    return (
        <main>
            {/* Tournament hero section */}
            <section className="hero hero-tournaments">
                <div className="hero-inner">
                    <span className="eyebrow">
                        <Trophy size={14} />
                        THE TOURNAMENT CIRCUIT
                    </span>

                    <h1>
                        PLAY BIG. <span>WIN BIGGER.</span>
                    </h1>

                    <p>
                        Discover upcoming tournaments, explore the rules, and
                        find your next shot at the podium.
                    </p>

                    <div className="hero-stats">
                        <div>
                            <strong>04</strong>
                            <span>Sample tournaments</span>
                        </div>

                        <div>
                            <strong>₹25K</strong>
                            <span>Top prize pool</span>
                        </div>

                        <div>
                            <strong>OPEN</strong>
                            <span>Registration demo</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tournament listing section */}
            <div className="content-wrap">
                <section className="section-block">
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">
                                UPCOMING COMPETITIONS
                            </span>

                            <h2>
                                Tournaments{" "}
                                <span className="heading-muted">
                                    / All events
                                </span>
                            </h2>

                            <p>
                                Explore competition details before opening a
                                tournament page.
                            </p>
                        </div>

                        <span className="sample-badge">
                            REGISTRATION DEMO
                        </span>
                    </div>

                    {/* Search, format, and sorting filters */}
                    <div className="tournament-filters">
                        <label className="tournament-search">
                            <Search size={17} />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tournaments or organizers"
                            />
                        </label>

                        <label className="select-filter">
                            <span>Format</span>

                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                            >
                                <option>All</option>
                                <option>Squad</option>
                                <option>Duo</option>
                                <option>Solo</option>
                            </select>
                        </label>

                        <label className="select-filter">
                            <span>Sort by</span>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="date">Upcoming date</option>
                                <option value="prize">Highest prize</option>
                                <option value="fee">Lowest entry fee</option>
                            </select>
                        </label>
                    </div>

                    {/* Search results information */}
                    <div className="results-line">
                        <span>
                            <strong>{filtered.length}</strong> tournaments
                            found
                        </span>

                        <span>
                            <CalendarDays size={14} />
                            Event dates
                        </span>
                    </div>

                    {/* Tournament cards */}
                    <div className="tournament-grid">
                        {filtered.length > 0 ? (
                            filtered.map((t) => (
                                <TournamentCard
                                    key={t.id}
                                    tournament={t}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Trophy size={28} />

                                <h3>No tournaments found</h3>

                                <p>
                                    Try another search or format.
                                </p>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSearch("");
                                        setFormat("All");
                                        setSort("date");
                                    }}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
