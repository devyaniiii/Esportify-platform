import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container">
      <div className="empty">
        <div className="empty__icon" aria-hidden="true">404</div>
        <h3>We couldn't find that page</h3>
        <p className="muted">The tournament may have been removed or the link is wrong.</p>
        <Link to="/tournaments" className="btn btn--primary">Browse tournaments</Link>
      </div>
    </div>
  );
}
