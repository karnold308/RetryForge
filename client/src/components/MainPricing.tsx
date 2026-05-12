
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
                        + 5% of recovered revenue.
                    </p>
                    <p>Most customers recover their first failed invoice within days, often covering the cost of our platform.</p>
                    <ul className="pricing-features">
                        <li>Automatic retries</li>
                        <li>Send branded card-update emails before subscriptions cancel.</li>
                        <li>Revenue recovery dashboard</li>
                        <li>Stripe integration</li>
                    </ul>

                    <a href="/signup" className="nav-btn-primary pricing-btn">
                        Start Recovering Revenue
                    </a>
                </div>
                <p className="pricing-note">
                    Cancel anytime, no long-term contracts, and you only pay when we successfully recover revenue.
                </p>
            </div>
        </section>
    )
}