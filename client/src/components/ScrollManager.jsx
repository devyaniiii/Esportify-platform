import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router does not scroll for you. This makes links like "/#about" scroll
// to that section, and sends every other page change back to the top.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const frame = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}

export default ScrollManager;
