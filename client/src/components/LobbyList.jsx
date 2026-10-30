// Sample lobbies shown on the player login/register pages.
// Replace with GET /api/scrims later.
const lobbies = [
  { name: "Erangel Scrims, 9:00 PM", filled: 18, total: 25 },
  { name: "Miramar Scrims, 10:00 PM", filled: 22, total: 25 },
  { name: "Rondo, Sunday 8:00 PM", filled: 40, total: 100 },
];

function LobbyList() {
  return (
    <div className="auth-lobbies">
      <div className="auth-lobbies-head">
        <span className="auth-live-dot" aria-hidden="true" />
        Open for booking
      </div>
      {lobbies.map((l) => (
        <div className="auth-lobby" key={l.name}>
          <span className="auth-lobby-name">{l.name}</span>
          <span className="auth-lobby-slots">{l.total - l.filled} slots left</span>
          <div className="auth-lobby-bar">
            <span style={{ width: `${(l.filled / l.total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LobbyList;
