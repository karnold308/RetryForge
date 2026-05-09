import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import Footer from "./Footer";
import "../styles/Demo.css";

export default function Demo() {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const pageTitle = document.title;
        trackPageView(location.pathname, pageTitle);
    }, [location]);
    
    return (
        <>
            <main className="demo-page">
                <title>RetryForge - Demo</title>
                <header className="demo-header">
                    <Link to="/" className="demo-logo">
                        <img className="demo-header-logo" loading="lazy" src="/letter_mark_white_bg.png" />
                    </Link>
                </header>
                {/* HERO */}
                <section className="demo-hero">
                    <div className="demo-hero-left">
                        <span className="demo-badge">
                            Live walkthrough
                        </span>

                        <h1>See how RetryForge recovers failed payments</h1>

                        <p>
                            In 15 minutes, we’ll walk through your recovery opportunities,
                            Stripe integration, and expected ROI.
                        </p>

                        <button>Schedule Demo</button>
                    </div>

                    <div className="demo-hero-right">
                        <div className="demo-agenda-card">
                            <h3>What we’ll cover</h3>

                            <ul>
                                <li>✓ Failed payment analysis</li>
                                <li>✓ Recovery workflow walkthrough</li>
                                <li>✓ Retry optimization strategy</li>
                                <li>✓ Dashboard overview</li>
                                <li>✓ Pricing and setup</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* WHAT YOU SEE */}
                <section className="demo-section">
                    <div className="demo-container">

                        <div className="demo-section-header">
                            <h2>Track recovered revenue in real time</h2>

                            <p>
                                See failed payments, recovered revenue, retry performance,
                                and recovery rates from one dashboard.
                            </p>
                        </div>

                        <div className="demo-feature-grid">

                            <div className="demo-feature-card">
                                <h3>Recovered revenue</h3>
                                <p>
                                    Track how much failed subscription revenue has been
                                    recovered automatically.
                                </p>
                            </div>

                            <div className="demo-feature-card">
                                <h3>Retry performance</h3>
                                <p>
                                    Understand which retry timing and workflows recover the
                                    most payments.
                                </p>
                            </div>

                            <div className="demo-feature-card">
                                <h3>Failed payment analytics</h3>
                                <p>
                                    Monitor failed payments caused by expired cards,
                                    insufficient funds, and bank declines.
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

                {/* DEMO FLOW */}
                <section className="demo-section demo-muted" id="workflow">
                    <div className="demo-container">

                        <div className="demo-section-header">
                            <h2>How RetryForge works</h2>

                            <p>
                                Connect your Stripe account and start recovering revenue
                                automatically.
                            </p>
                        </div>

                        <div className="demo-steps-grid">

                            <div className="demo-step-card">
                                <div className="demo-step-number">1</div>

                                <h3>Connect Stripe</h3>

                                <p>
                                    Securely connect your Stripe account in minutes.
                                    No billing migration required.
                                </p>
                            </div>

                            <div className="demo-step-card">
                                <div className="demo-step-number">2</div>

                                <h3>Detect failed payments</h3>

                                <p>
                                    RetryForge automatically detects failed subscription
                                    payments and identifies recoverable revenue.
                                </p>
                            </div>

                            <div className="demo-step-card">
                                <div className="demo-step-number">3</div>

                                <h3>Automated recovery</h3>

                                <p>
                                    Optimized retry logic and recovery workflows run in the
                                    background automatically.
                                </p>
                            </div>

                            <div className="demo-step-card">
                                <div className="demo-step-number">4</div>

                                <h3>Track ROI</h3>

                                <p>
                                    See exactly how much revenue has been recovered and how
                                    your recovery performance improves over time.
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

                {/* WHAT HAPPENS IN DEMO */}
                <section className="demo-section">
                    <div className="demo-container">

                        <div className="demo-callout">

                            <h2>What we’ll show during the demo</h2>

                            <div className="demo-callout-list">

                                <div className="demo-callout-item">
                                    ✓ How RetryForge connects to Stripe
                                </div>

                                <div className="demo-callout-item">
                                    ✓ Failed payment recovery workflows
                                </div>

                                <div className="demo-callout-item">
                                    ✓ Revenue recovery analytics dashboard
                                </div>

                                <div className="demo-callout-item">
                                    ✓ Expected ROI based on your MRR
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* FAQ */}
                <section className="demo-section demo-muted">
                    <div className="demo-container">

                        <div className="demo-section-header">
                            <h2>Frequently asked questions</h2>
                        </div>

                        <div className="demo-faq-list">

                            <details className="demo-faq-item" open>
                                <summary>
                                    Does RetryForge replace Stripe Smart Retries?
                                </summary>

                                <p>
                                    No. RetryForge works alongside Stripe Billing and improves
                                    failed payment recovery with optimized retry timing and
                                    recovery workflows.
                                </p>
                            </details>

                            <details className="demo-faq-item">
                                <summary>
                                    How long does setup take?
                                </summary>

                                <p>
                                    Most teams can connect Stripe and begin tracking failed
                                    payments in just a few minutes.
                                </p>
                            </details>

                            <details className="demo-faq-item">
                                <summary>
                                    Do I need to change my billing code?
                                </summary>

                                <p>
                                    No. RetryForge works with your existing Stripe Billing
                                    setup without major code changes.
                                </p>
                            </details>

                            <details className="demo-faq-item">
                                <summary>
                                    How is pricing calculated?
                                </summary>

                                <p>
                                    RetryForge charges a monthly platform fee plus a small
                                    percentage of recovered revenue.
                                </p>
                            </details>

                        </div>

                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="demo-final-cta">
                    <div className="demo-container">

                        <h2>
                            Start recovering failed payments automatically
                        </h2>

                        <p>
                            Connect Stripe in minutes and recover subscription revenue
                            without manual follow-up.
                        </p>

                        <a href="/signup" className="demo-btn-primary">
                            Get Started
                        </a>

                    </div>
                </section>

            </main>




            <Footer />
        </>
    )
}