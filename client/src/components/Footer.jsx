import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div>
                    <h4>Esportify</h4>
                    <p>
                        Find BGMI scrims, join tournaments and track your squad's rank in
                        one place.
                    </p>
                </div>

                <div>
                    <h4>Quick links</h4>
                    <Link to="/scrims">Scrims</Link>
                    <Link to="/tournaments">Tournaments</Link>
                    <Link to="/#leaderboard">Leaderboard</Link>
                    <Link to="/#about">About us</Link>
                </div>

                <div>
                    <h4>Contact</h4>
                    <p>support@esportify.com</p>
                    <p>+91 00000 00000</p>
                    <Link to="/#contact">Send a message</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © 2026 Esportify. Unofficial BGMI community platform, not affiliated
                    with Krafton.
                </p>
            </div>
        </footer>
    );
}

export default Footer;