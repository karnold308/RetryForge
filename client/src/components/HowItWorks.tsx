import { useEffect } from "react";

export default function HowItWorks() {

    useEffect(() => {
        const cards = document.querySelectorAll(".howItWorks-card");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);
    return (
        <section id="howItWorks" className="howItWorks px-8 grid">
            <div className="container howItWorksContainer">
                <h2 className="howItWorksTitle section-title">How it works</h2>
                <p className="howItWorksSubtitle">Connect your account and start recovering revenue in minutes</p>

                <div className="howItWorks-cards">
                    <div className="howItWorks-card">
                        <div className="howItWorks-cardTitleDiv">
                            <div className="howItWorks-number">1.</div>
                            <h3>&nbsp;Connect Stripe</h3>
                        </div>
                        <p>Securely connect your account in seconds. No code changes required.</p>
                    </div>

                    <div className="howItWorks-card">
                        <div className="howItWorks-cardTitleDiv">
                            <div className="howItWorks-number">2.</div>
                            <h3>&nbsp;Detect failed payments</h3>
                        </div>
                        <p>We automatically analyze failed subscriptions and identify recoverable revenue.</p>
                    </div>

                    <div className="howItWorks-card hiw-important">
                        <div className="howItWorks-cardTitleDiv">
                            <div className="howItWorks-number">3.</div>
                            <h3>&nbsp;Recover Failed Payments</h3>
                        </div>
                        <p>Automatically retry failed invoices at higher-converting times run in the background to recover lost payments.</p>
                    </div>
                </div>
                <div className="recovery-insights-card">
                    <div className="recovery-insights-header">
                        <p className="recovery-insights-label">
                            Recovery Analytics
                        </p>
                        <h3>
                            See exactly what RetryForge recovers
                        </h3>
                        <p className="recovery-insights-subtitle">
                            Track recovered revenue, retry performance,
                            and failed payment trends in real time.
                        </p>
                    </div>
                    <div className="recovery-insights-grid">
                        <div className="recovery-metric">
                            <span className="metric-label">
                                Failed revenue
                            </span>
                            <strong>
                                $4,280
                            </strong>
                        </div>
                        <div className="recovery-metric">
                            <span className="metric-label">
                                Recovered revenue
                            </span>
                            <strong className="metric-success">
                                +$1,240
                            </strong>
                        </div>
                        <div className="recovery-metric">
                            <span className="metric-label">
                                Recovery rate
                            </span>
                            <strong>
                                29%
                            </strong>
                        </div>
                        <div className="recovery-metric">
                            <span className="metric-label">
                                Best retry window
                            </span>
                            <strong>
                                2:00 AM - 6:00 AM
                            </strong>
                        </div>
                    </div>
                    <div className="recovery-insights-footer">
                        No guesswork. Just measurable recovered MRR.
                    </div>
                </div>
            </div>
        </section>
    )
}