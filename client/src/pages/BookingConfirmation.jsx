import { Link, useLocation } from "react-router-dom";
import "../styles/auth.css";

// Sample booking used when the page is opened directly, without coming from TeamRegistration.
const sampleBooking = {
  id: "ESP-1042",
  event: { title: "Esportify Weekly Cup", type: "Tournament", date: "2 Nov 2026", time: "8:00 PM", fee: "₹100" },
  teamName: "Shadow Squad",
  captainName: "ShadowStrike",
  slot: "#14",
};

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking || sampleBooking;
  const { event } = booking;

  const rows = [
    ["Booking ID", booking.id],
    ["Event", event.title],
    ["Date and time", `${event.date}, ${event.time}`],
    ["Slot", booking.slot],
    ["Mode", booking.mode || "Squad"],
    [booking.mode === "Solo" ? "Player" : "Team", booking.teamName],
    ...(booking.mode === "Solo" ? [] : [["Captain", booking.captainName]]),
    ["Total fee", booking.fee || event.fee],
  ];

  return (
    <div className="dash-page">
      <div className="dash-container dash-container-narrow">
        <div className="dash-card confirm-card">
          <div className="confirm-icon" aria-hidden="true">✓</div>
          <h1 className="dash-title confirm-title">Slot booked</h1>
          <p className="dash-subtitle">
            Your slot is reserved. Room ID and password will be shared before the match starts.
          </p>

          <dl className="dash-details confirm-details">
            {rows.map(([label, value]) => (
              <div className="dash-detail" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="dash-actions confirm-actions">
            <Link to="/my-bookings" className="dash-btn">View my bookings</Link>
            <Link to="/tournaments" className="dash-btn dash-btn-ghost">Browse more events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
