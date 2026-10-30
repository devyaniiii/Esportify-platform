import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

// The one Esportify logo (lightning bolt + name). Use this everywhere
// so the logo can never go out of sync between pages.
// Props: tagline (show "COMPETITIVE ARENA"), onClick (e.g. to close a menu).
function Logo({ tagline = false, onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label="Esportify home">
      <span className="brand-mark">
        <Zap size={21} fill="currentColor" />
      </span>
      <span>
        ESPORTI<span className="brand-accent">FY</span>
        {tagline && <small>COMPETITIVE ARENA</small>}
      </span>
    </Link>
  );
}

export default Logo;
