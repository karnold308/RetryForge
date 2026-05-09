import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import { useState } from "react";
import Footer from "./Footer";


export default function TermsAndConditions() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);


    return (
        <>
            <header>
                <title>RetryForge - Terms and Conditions</title>
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
            <main className="terms-page">
                <div className="terms-container">
                    <div className="terms-card">
                        <h1 className="terms-title">Terms & Conditions</h1>

                        <p className="terms-updated">
                            Last updated: May 8, 2026
                        </p>

                        <div className="terms-content">
                            <section>
                                <p>
                                    These Terms & Conditions (“Terms”) govern your access to and
                                    use of RetryForge (“RetryForge”, “we”, “our”, or “us”),
                                    including our website, platform, and related services.
                                </p>

                                <p>
                                    By accessing or using RetryForge, you agree to be bound by
                                    these Terms. If you do not agree to these Terms, you may not
                                    use the service.
                                </p>
                            </section>

                            <section>
                                <h2>1. Eligibility</h2>

                                <p>
                                    You must be at least 18 years old and legally capable of
                                    entering into binding agreements to use RetryForge.
                                </p>

                                <p>
                                    By using the service, you represent and warrant that you meet
                                    these requirements.
                                </p>
                            </section>

                            <section>
                                <h2>2. Services</h2>

                                <p>
                                    RetryForge provides subscription payment recovery tools and
                                    related analytics for businesses using Stripe Billing.
                                </p>

                                <p>
                                    Features may include:
                                </p>

                                <ul>
                                    <li>Failed payment recovery automation</li>
                                    <li>Retry scheduling</li>
                                    <li>Email recovery workflows</li>
                                    <li>Revenue recovery analytics</li>
                                    <li>Subscription payment monitoring</li>
                                </ul>

                                <p>
                                    We may modify, improve, suspend, or discontinue parts of the
                                    service at any time.
                                </p>
                            </section>

                            <section>
                                <h2>3. Account Responsibilities</h2>

                                <p>
                                    You are responsible for maintaining the confidentiality of your
                                    account credentials and for all activity occurring under your
                                    account.
                                </p>

                                <p>
                                    You agree to:
                                </p>

                                <ul>
                                    <li>Provide accurate account information</li>
                                    <li>Maintain the security of your account</li>
                                    <li>Notify us of unauthorized access</li>
                                    <li>Use the service in compliance with applicable laws</li>
                                </ul>
                            </section>

                            <section>
                                <h2>4. Stripe Integration</h2>

                                <p>
                                    RetryForge integrates with Stripe to provide payment recovery
                                    functionality.
                                </p>

                                <p>
                                    By connecting your Stripe account, you authorize RetryForge to
                                    access and process billing and subscription information
                                    necessary to provide the service.
                                </p>

                                <p>
                                    Your use of Stripe remains subject to Stripe’s own terms and
                                    policies.
                                </p>
                            </section>

                            <section>
                                <h2>5. Fees and Billing</h2>

                                <p>
                                    Certain RetryForge features may require paid subscriptions or
                                    usage-based fees.
                                </p>

                                <p>
                                    Pricing may include:
                                </p>

                                <ul>
                                    <li>Monthly subscription fees</li>
                                    <li>Performance-based recovery fees</li>
                                    <li>Additional service fees where applicable</li>
                                </ul>

                                <p>
                                    By subscribing to a paid plan, you authorize RetryForge to
                                    charge applicable fees using your selected payment method.
                                </p>

                                <p>
                                    Fees are non-refundable unless otherwise required by law.
                                </p>
                            </section>

                            <section>
                                <h2>6. Acceptable Use</h2>

                                <p>
                                    You agree not to:
                                </p>

                                <ul>
                                    <li>Use RetryForge for unlawful purposes</li>
                                    <li>Attempt to gain unauthorized access to the platform</li>
                                    <li>Interfere with service operation or security</li>
                                    <li>Reverse engineer or copy the service</li>
                                    <li>Use the service to violate third-party rights</li>
                                </ul>

                                <p>
                                    We reserve the right to suspend or terminate accounts violating
                                    these Terms.
                                </p>
                            </section>

                            <section>
                                <h2>7. Intellectual Property</h2>

                                <p>
                                    RetryForge and all related software, branding, content, and
                                    materials are owned by RetryForge and protected under
                                    applicable intellectual property laws.
                                </p>

                                <p>
                                    These Terms do not grant you ownership of any RetryForge
                                    intellectual property.
                                </p>
                            </section>

                            <section>
                                <h2>8. Data and Privacy</h2>

                                <p>
                                    Your use of RetryForge is also governed by our Privacy Policy.
                                </p>

                                <p>
                                    By using the service, you consent to the collection and use of
                                    information as described in the Privacy Policy.
                                </p>
                            </section>

                            <section>
                                <h2>9. Disclaimer of Warranties</h2>

                                <p>
                                    RetryForge is provided “as is” and “as available” without
                                    warranties of any kind, express or implied.
                                </p>

                                <p>
                                    We do not guarantee uninterrupted service, error-free
                                    operation, or specific recovery outcomes.
                                </p>
                            </section>

                            <section>
                                <h2>10. Limitation of Liability</h2>

                                <p>
                                    To the maximum extent permitted by law, RetryForge shall not be
                                    liable for indirect, incidental, special, consequential, or
                                    punitive damages arising from your use of the service.
                                </p>

                                <p>
                                    Our total liability for any claim relating to RetryForge shall
                                    not exceed the amount paid by you to RetryForge during the
                                    twelve months preceding the claim.
                                </p>
                            </section>

                            <section>
                                <h2>11. Termination</h2>

                                <p>
                                    You may stop using RetryForge at any time.
                                </p>

                                <p>
                                    We may suspend or terminate access to the service if:
                                </p>

                                <ul>
                                    <li>You violate these Terms</li>
                                    <li>Your account creates security or legal risks</li>
                                    <li>Required by law or regulation</li>
                                </ul>

                                <p>
                                    Upon termination, your right to use RetryForge immediately
                                    ends.
                                </p>
                            </section>

                            <section>
                                <h2>12. Changes to These Terms</h2>

                                <p>
                                    We may update these Terms from time to time.
                                </p>

                                <p>
                                    Continued use of RetryForge after updated Terms become
                                    effective constitutes acceptance of the revised Terms.
                                </p>
                            </section>

                            <section>
                                <h2>13. Governing Law</h2>

                                <p>
                                    These Terms shall be governed by and construed in accordance
                                    with the laws of the United States and the applicable state
                                    jurisdiction, without regard to conflict of law principles.
                                </p>
                            </section>

                            <section>
                                <h2>14. Contact</h2>

                                <p>
                                    If you have questions regarding these Terms, contact:
                                </p>

                                <div className="terms-contact">
                                    <p className="terms-contact-name">
                                        RetryForge
                                    </p>

                                    <a
                                        href="mailto:support@retryforge.com"
                                        className="terms-contact-link"
                                    >
                                        support@retryforge.com
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}