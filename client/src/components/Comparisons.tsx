
export default function Comparisons() {
    return (
        <section className="comparisonSection px-8 grid">
            <div className="container px-8 grid">
                <div>
                    <h2 className="comparison-title section-title">Why not just use Stripe?</h2>
                    <p className="comparison-subtitle">Stripe handles payments infrastructure. RetryForge optimizes reclaiming failed invoices.</p>
                </div>
                <div className="comparison-table relative grid gap-8 lg:grid-cols-2">
                    <div className="stripe-card">
                        <h3 className="comparison-card-title">Stripe</h3>
                        <ul>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    One-size-fits-all retry timing
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    Limited control over timing
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    No recovery analytics
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    Not optimized for your customer behavior
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="our-card">
                        <h3 className="comparison-card-title">RetryForge</h3>
                        <ul>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Optimized retry timing
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Recovery analytics
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Higher recovered MRR
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Customer-specific workflows
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="comparison-vs">
                        <div className="comparison-vs-badge">
                        <span className="comparison-vs-text">
                            VS
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}