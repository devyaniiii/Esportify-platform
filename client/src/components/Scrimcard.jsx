
import React from "react";
import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    MapPin,
    Trophy,
    Users,
} from "lucide-react";

export default function ScrimCard({ scrim }) {
    // Calculate available slots
    const available = Math.max(0, scrim.slots - scrim.filled);

    // Calculate slot occupancy percentage
    const progress =
        scrim.slots > 0
            ? Math.min(100, (scrim.filled / scrim.slots) * 100)
            : 0;

    // Format scrim date
    const date = new Date(
        `${scrim.date} T00:00:00`
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <article className="scrim-card">
            {/* Card header */}
            <div className="card-topline">
                <span className="game-chip">
                    BGMI / {scrim.mode}
                </span>

                <span
                    className={`status - pill ${available ? "status-open" : "status-full"
                        } `}
                >
                    <i />
                    {available ? "Slots open" : "Full"}
                </span>
            </div>

            {/* Scrim information */}
            <div>
                <p className="organizer-name">
                    {scrim.organizer}
                </p>

                <h3>{scrim.title}</h3>

                <p className="map-line">
                    <MapPin size={14} />

                    {scrim.maps?.join(" / ") || scrim.map}

                    <span>•</span>

                    {scrim.perspective || "TPP"}
                </p>
            </div>

            {/* Entry fee and prize pool */}
            <div className="scrim-metrics">
                <div className="metric">
                    <span>ENTRY FEE</span>

                    <strong>
                        {scrim.fee === 0
                            ? "FREE"
                            : `₹${scrim.fee} `}
                    </strong>
                </div>

                <div className="metric">
                    <span>PRIZE POOL</span>

                    <strong className="green-value">
                        ₹{scrim.prize.toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            {/* Date and time */}
            <div className="scrim-meta">
                <span>
                    <CalendarDays size={15} />
                    {date}
                </span>

                <span>
                    <Clock3 size={15} />
                    {scrim.time}
                </span>
            </div>

            {/* Slot availability and progress */}
            <div className="slots-area">
                <div className="slots-label">
                    <span>
                        <Users size={14} />
                        Slots filled
                    </span>

                    <strong>
                        {scrim.filled}
                        <small> / {scrim.slots}</small>
                    </strong>
                </div>

                <div className="progress-track">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}% ` }}
                    />
                </div>

                <p>{available} slots remaining</p>
            </div>

            {/* Demo booking button */}
            <button
                className="btn btn-primary card-action"
                disabled={!available}
                onClick={() =>
                    window.alert(
                        `Demo only: booking selected for ${scrim.title}.No payment or reservation has been made.`
                    )
                }
            >
                {available ? "Book now" : "Slots full"}

                {available > 0 && <ArrowUpRight size={16} />}
            </button>

            {/* Card footer */}
            <div className="card-footnote">
                <Trophy size={13} />
                Sample event · Demo booking
            </div>
        </article>
    );
}
