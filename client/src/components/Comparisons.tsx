
export default function Comparisons() {
    return (
        <section className="comparisonSection px-8 grid">
            <div className="container px-8 grid">
                <div>
                    <h2 className="comparison-title section-title">Why not just use Stripe?</h2>
                    <p className="comparison-subtitle">Stripe handles payments infrastructure. RetryForge optimizes revenue recovery.</p>
                </div>
                <div className="comparison-table relative grid gap-8 lg:grid-cols-2">
                    <div className="stripe-card">
                        <h3 className="comparison-card-title">Stripe</h3>
                        <ul>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    Generic retry logic
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    Limited control over timing
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    No visibility into recovery optimization
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <span className="comparison-feature-text">
                                    No per-customer retry strategy
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
                                    Recover more failed payments automatically
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Full control over recovery logic
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Track recovered MRR, retry performance, and recovery rate in real time
                                </span>
                            </li>
                            <li className="comparison-feature">
                                <div className="comparison-feature-icon">✓</div>
                                <span className="comparison-feature-text">
                                    Customer-specific retry strategies
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