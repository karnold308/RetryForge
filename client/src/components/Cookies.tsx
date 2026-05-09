import { useState } from "react";
import Footer from "./Footer";
import "../styles/Cookies.css"


export default function Cookies() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <>
            <title>Privacy Policy</title>
            <header>
                <title>RetryForge - Cookie Policy</title>
                <nav className="navbar">
                    <a href="/" className="logo">
                        <img className="headerLogo" loading="lazy" src="/letter_mark_white_bg.png" />
                    </a>

                    <div className="nav-links desktop-nav">
                        <a href="/demo" className="nav-btn-secondary">Book Demo</a>
                        {/* <a href="/login" className="nav-btn-secondary">Login</a> */}
                        <a href="/signup" className="nav-btn-primary">Get Started</a>
                    </div>


                    {/* Mobile Hamburger */}
                    <button
                        type="button"
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}>
                        ☰
                    </button>
                </nav>

                {/* Mobile Dropdown */}

                {mobileOpen && (
                    <div className="mobile-menu">
                        <a href="/demo">Book Demo</a>
                        <a href="/signup" className="nav-btn-primary">Get Started</a>
                    </div>
                )}
            </header>
            <main className="cookie-policy-page">
                <section className="cookie-policy-hero">
                    <div className="cookie-policy-container">
                        <p className="cookie-policy-label">Legal</p>
                        <h1>Cookie Policy</h1>
                        <p className="cookie-policy-updated">
                            Last updated: May 8, 2026
                        </p>
                    </div>
                </section>

                <section className="cookie-policy-content">
                    <div className="cookie-policy-container">
                        <div className="cookie-policy-card">

                            <h2>1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files stored on your device when you visit
                                a website. They help websites function properly, remember user
                                preferences, and provide analytics information.
                            </p>

                            <h2>2. How RetryForge Uses Cookies</h2>
                            <p>
                                RetryForge uses cookies and similar technologies to:
                            </p>

                            <ul>
                                <li>Keep users signed in securely</li>
                                <li>Maintain session and authentication state</li>
                                <li>Understand website usage and performance</li>
                                <li>Improve the functionality and reliability of the platform</li>
                                <li>Protect against fraud and abuse</li>
                            </ul>

                            <h2>3. Types of Cookies We Use</h2>

                            <h3>Essential Cookies</h3>
                            <p>
                                These cookies are necessary for the website and application to
                                function properly. They enable core functionality such as account
                                login, security, and billing workflows.
                            </p>

                            <h3>Analytics Cookies</h3>
                            <p>
                                Analytics cookies help us understand how visitors interact with
                                RetryForge so we can improve the product and user experience.
                            </p>

                            <h3>Performance Cookies</h3>
                            <p>
                                These cookies help monitor website speed, reliability, and error
                                reporting.
                            </p>

                            <h2>4. Third-Party Services</h2>
                            <p>
                                RetryForge may use third-party providers such as Stripe, analytics
                                platforms, hosting providers, and monitoring services that place
                                cookies or similar tracking technologies on your device.
                            </p>

                            <h2>5. Managing Cookies</h2>
                            <p>
                                Most browsers allow you to control or disable cookies through your
                                browser settings. Disabling certain cookies may impact website
                                functionality or prevent parts of the platform from working
                                correctly.
                            </p>

                            <h2>6. Do Not Track</h2>
                            <p>
                                Some browsers support “Do Not Track” signals. Because there is no
                                consistent industry standard for these signals, RetryForge may not
                                respond to them at this time.
                            </p>

                            <h2>7. Updates to This Policy</h2>
                            <p>
                                We may update this Cookie Policy periodically to reflect changes
                                to our services, technologies, or legal requirements. Updates will
                                be posted on this page with a revised effective date.
                            </p>

                            <h2>8. Contact</h2>
                            <p>
                                If you have questions about this Cookie Policy, you can contact us
                                at:
                            </p>

                            <p className="cookie-policy-contact">
                                support@retryforge.com
                            </p>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}