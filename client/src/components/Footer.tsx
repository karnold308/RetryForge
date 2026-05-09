import { Link } from "react-router-dom";


export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Left */}
                <div className="footer-brand">
                    <div className="footer-logo-row">
                        <Link to="/" className="signup-logo">
                            <img
                                loading="lazy"
                                src="/letter_mark_white_bg.png"
                                className="footer-logo"
                                alt="RetryForge logo"
                            />
                        </Link>

                        <span className="footer-brand-name">
                            RetryForge
                        </span>
                    </div>
                    <p className="footer-description">
                        Revenue recovery infrastructure for SaaS companies using Stripe.
                    </p>
                    <p className="footer-copyright">
                        © 2026 RetryForge. All rights reserved.
                    </p>
                </div>

                {/* Right */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Product</h4>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        {/* <a href="#">Dashboard</a> */}
                        {/* <a href="#">Stripe Integration</a> */}
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <a href="/demo">Book Demo</a>
                        <a href="#">Contact</a>
                        {/*  <a href="#">Support</a> */}
                    </div>

                    <div className="footer-column">
                        <h4>Legal</h4>
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                        <a href="/cookies">Cookies</a>
                    </div>

                </div>
            </div>
        </footer>
    )
}