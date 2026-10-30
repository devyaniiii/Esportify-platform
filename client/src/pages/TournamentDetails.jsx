import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { tournaments } from "../data/events.js";

export default function TournamentDetails() {
  const { id } = useParams();

  const t = tournaments.find((x) => x.id === id);

  // Handle invalid tournament IDs
  if (!t) {
    return (
      <main className="content-wrap not-found">
        <span className="eyebrow">EVENT NOT FOUND</span>

        <h1>This tournament isn't in the bracket.</h1>

        <Link className="btn btn-primary" to="/tournaments">
          Browse tournaments
        </Link>
      </main>
    );
  }

  // Calculate available slots
  const available = Math.max(0, t.slots - t.filled);

  // Format tournament date
  const date = new Date(
    `${t.startDate} T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="content-wrap details-page">
      {/* Back navigation */}
      <Link to="/tournaments" className="back-link">
        <ArrowLeft size={16} />
        Back to tournaments
      </Link>

      {/* Tournament hero section */}
      <section className="details-hero">
        <div className="details-art">
          <Trophy size={76} />
          <span>ESPORTIFY ORIGINAL</span>
        </div>

        <div className="details-copy">
          <span className="eyebrow">
            <i className="live-dot" />
            {t.status}
          </span>

          <p className="organizer-name">
            {t.organizer} · {t.game}
          </p>

          <h1>{t.title}</h1>

          <p>{t.description}</p>

          <div className="details-tags">
            <span>{t.format}</span>
            <span>{t.maps.join(" / ")}</span>
            <span>{available} slots available</span>
          </div>
        </div>
      </section>

      {/* Tournament details and booking layout */}
      <div className="details-layout">
        <div className="details-main">
          {/* Event overview */}
          <section className="detail-panel">
            <span className="section-eyebrow">
              EVENT OVERVIEW
            </span>

            <h2>Tournament details</h2>

            <p>{t.description}</p>

            <div className="overview-grid">
              <div>
                <CalendarDays />
                <span>DATE</span>
                <strong>{date}</strong>
              </div>

              <div>
                <Clock3 />
                <span>START TIME</span>
                <strong>{t.time}</strong>
              </div>

              <div>
                <MapPin />
                <span>MAP</span>
                <strong>{t.maps.join(", ")}</strong>
              </div>

              <div>
                <Users />
                <span>FORMAT</span>
                <strong>{t.format}</strong>
              </div>
            </div>
          </section>

          {/* Tournament rules */}
          <section className="detail-panel">
            <span className="section-eyebrow">
              PLAY FAIR
            </span>

            <h2>Rules &amp; guidelines</h2>

            <ul className="rules-list">
              {t.rules.map((rule, i) => (
                <li key={i}>
                  <CheckCircle2 size={17} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Booking panel */}
        <aside className="booking-panel" id="register">
          <span className="section-eyebrow">
            YOUR NEXT CHALLENGE
          </span>

          <h2>Event entry</h2>

          <div className="booking-prize">
            <span>PRIZE POOL</span>

            <strong>
              ₹{t.prize.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="booking-row">
            <span>Entry fee</span>

            <strong>
              {t.entryFee ? `₹${t.entryFee} ` : "FREE"}
            </strong>
          </div>

          <div className="booking-row">
            <span>Team slots</span>

            <strong>
              {available} / {t.slots} open
            </strong>
          </div>

          <div className="booking-row">
            <span>Registration</span>

            <strong className="green-value">
              Open (demo)
            </strong>
          </div>

          <Link
            className="btn btn-primary booking-button"
            aria-disabled={!available}
            onClick={(event) => {
              if (!available) event.preventDefault();
            }}
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
            {available ? "Book now" : "Slots full"}
          </Link>

          <p className="booking-disclaimer">
            <ShieldCheck size={14} />
            Demo only. No payment is collected.
          </p>
        </aside>
      </div>
    </main>
  );
}