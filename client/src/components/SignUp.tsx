import { Link } from "react-router-dom";
import '../styles/SignUp.css'

import Footer from "./Footer";

export default function SignUp() {
    return (
        <>
            <main className="signup-page">
                <header className="signup-header">
                    <Link to="/" className="signup-logo">
                        <Link to="/" className="demo-logo">
                        <img className="signup-header-logo" loading="lazy" src="/letter_mark_white_bg.png"/>
                    </Link>
                    </Link>

                    {/* 
                    <div className="signup-header-links">
                        <span>Already have an account?</span>

                        <Link to="/login" className="signup-login-link">
                            Sign in
                        </Link>
                    </div>
                    */}
                </header>

                <section className="signup-layout">
                    {/* LEFT SIDE */}
                    <div className="signup-card">
                        <div className="signup-card-header">
                            <span className="signup-badge">
                                Start recovering failed payments
                            </span>

                            <h1>Create your account</h1>

                            <p>
                                Connect Stripe and start tracking recoverable revenue in
                                minutes.
                            </p>
                        </div>

                        <form className="signup-form">
                            <div className="signup-field">
                                <label htmlFor="company">Company name</label>

                                <input
                                    id="company"
                                    type="text"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            <div className="signup-field">
                                <label htmlFor="email">Work email</label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                />
                            </div>

                            <div className="signup-field">
                                <label htmlFor="password">Password</label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                />
                            </div>

                            <button type="submit" className="signup-btn">
                                Create Account
                            </button>
                        </form>

                        <p className="signup-footer-text">
                            By creating an account, you agree to our{" "}
                            <Link to="/terms">Terms</Link> and{" "}
                            <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="signup-info-panel">
                        <div className="signup-info-card">
                            <h2>What happens next</h2>

                            <ul className="signup-checklist">
                                <li>Connect Stripe securely</li>

                                <li>
                                    RetryForge analyzes failed subscription payments
                                </li>

                                <li>
                                    Configure retry timing and recovery workflows
                                </li>

                                <li>
                                    Start recovering revenue automatically
                                </li>
                            </ul>
                        </div>

                        <div className="signup-mini-card">
                            <span className="signup-mini-label">
                                Typical setup time
                            </span>

                            <strong>5–10 minutes</strong>

                            <p>
                                No billing migration or major code changes required.
                            </p>
                        </div>

                        <div className="signup-mini-card">
                            <span className="signup-mini-label">
                                Built for Stripe Billing
                            </span>

                            <p>
                                Works alongside your existing subscription setup and
                                payment workflows.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}