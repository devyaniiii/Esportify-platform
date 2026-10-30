import React from "react";
import {
    ArrowUpRight,
    CalendarDays,
    MapPin,
    Trophy,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TournamentCard({ tournament: t }) {
    // Calculate available slots
    const available = Math.max(0, t.slots - t.filled);

    // Format tournament date
    const date = new Date(
        `${t.startDate} T00:00:00`
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });

    return (
        <article className="tournament-card">
            {/* Tournament artwork */}
            <div className="tournament-art">
                <div className="art-grid" />

                <span className="tournament-kicker">
                    ESPORTIFY ORIGINAL
                </span>

                <Trophy
                    className="tournament-trophy"
                    size={58}
                />

                <span className="art-game">
                    {t.game}
                </span>

                <span className="art-index">
                    {t.id.toUpperCase()}
                </span>
            </div>

            {/* Tournament information */}
            <div className="tournament-card-body">
                <div className="card-topline">
                    <span className="game-chip">
                        {t.format}
                    </span>

                    <span className="status-pill status-open">
                        <i />
                        {t.status}
                    </span>
                </div>

                <p className="organizer-name">
                    {t.organizer}
                </p>

                <h3>{t.title}</h3>

                <p className="tournament-description">
                    {t.description}
                </p>

                {/* Tournament date, map, and available slots */}
                <div className="tournament-mini-meta">
                    <span>
                        <CalendarDays size={14} />
                        {date}
                    </span>

                    <span>
                        <MapPin size={14} />
                        {t.map}
                    </span>

                    <span>
                        <Users size={14} />
                        {available} slots
                    </span>
                </div>

                {/* Prize pool and entry fee */}
                <div className="tournament-prize-row">
                    <div>
                        <span>PRIZE POOL</span>

                        <strong>
                            ₹{t.prize.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>ENTRY</span>

                        <strong>
                            {t.entryFee
                                ? `₹${t.entryFee} `
                                : "FREE"}
                        </strong>
                    </div>
                </div>

                {/* Tournament actions */}
                <div className="tournament-actions">
                    <Link
                        className="btn btn-secondary"
                        to={`/tournaments/${t.id}`}
                    >
                        View details
                        <ArrowUpRight size={15} />
                    </Link>

                    <Link
                        className="btn btn-primary"
                        to="/team-registration"
                        state={{
                            event: {
                                title: t.title,
                                type: "Tournament",
                                date: t.startDate,
                                time: t.time,
                                fee: `₹${t.entryFee}`,
                                left: available,
                            },
                        }}
                    >
                        Book now
                    </Link>
                </div>
            </div>
        </article>
    );
}