
export default function MainPricing() {
    return (
        <section id="pricing" className="pricing">
            <div className="container">
                <div className="pricing-header">
                    <h2 className="section-title">
                        Simple, performance-based pricing
                    </h2>

                    <p className="pricing-subtitle">
                        Start recovering failed payments in minutes.
                        Only pay when revenue is recovered.
                    </p>
                </div>

                <div className="pricing-card">
                    <div className="pricing-plan">
                        Starter
                    </div>
                    <div className="pricing-price-row">
                        <span className="pricing-price">
                            $49
                        </span>
                        <span className="pricing-price-period">
                            /month
                        </span>
                    </div>
                    <p className="pricing-revenue-share">
                        + 5% of recovered revenue
                    </p>
                    <ul className="pricing-features">
                        <li>Automatic retries</li>
                        <li>Send branded card-update emails before subscriptions cancel.</li>
                        <li>Revenue recovery dashboard</li>
                        <li>Stripe integration</li>
                    </ul>

                    <a href="/signup" className="nav-btn-primary pricing-btn">
                        Get Started
                    </a>
                </div>
                <p className="pricing-note">
                    Cancel anytime, no long-term contracts, and you only pay when we successfully recover revenue.
                </p>
            </div>
        </section>
    )
}