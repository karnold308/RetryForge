import type { SolutionFeature } from '../models/types'

const solutionFeatures: SolutionFeature[] = [
    {
        title: "Smart retry scheduling",
        icon: "✓",
    },
    {
        title: "Recover failed payments without manual follow-up.",
        icon: "✓",
    },
    {
        title: "Real-time recovery visibility",
        icon: "✓",
    },
    {
        title: "Full Stripe integration",
        icon: "✓",
    },
    {
        title: "Automated \“update your card\” emails",
        icon: "✓",
    }
];

export default function Solution() {
    return (
        <section id="features" className="solution container section-muted">
            {/* left column */}
            <div className="gap-12 grid items-center">

                <div>
                    <h2 className="section-title">RetryForge recovers revenue - your way</h2>
                    <p className="solution-content">
                        Smart retries, optimized timing, and complete visibility into failed payment recovery.
                    </p>
                    <div className="solution-list">
                        {solutionFeatures.map((feature, index) => (
                            <div key={index} className="solution-item">
                                <span className="solution-check">
                                    {feature.icon}
                                </span>
                                <h3>{feature.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>




            </div>
            {/* right column */}
            <div className="gap-12 grid items-center border border-gray-200 rounded-2xl shadow-lg">
                <div>
                    <img
                        src="/dashboard_mockup_2.png"
                        alt="RetryForge dashboard real time"
                        className="rounded-lg"
                    />

                </div>
            </div>
        </section>
    )
}