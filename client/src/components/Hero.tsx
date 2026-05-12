

export default function Hero() {
    return (
        <section className="bg-gray-50 section-gradient flex items-center heroSection hero">
            <div className="container px-8 grid md:grid-cols-2 gap-12 items-center">
                {/* left column */}
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4">
                        {/* <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
                            RF
                        </div>*/}
                        <span className="text-xl font-semibold text-gray-900">
                            {/* RetryForge */}
                            <img alt="RetryForge logo" className="fullLogo" src="/full_logo_with_name_2.png" />
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-tight mb-5">
                        Recover subscription revenue Stripe leaves behind
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        Recover failed Stripe payments automatically before subscriptions churn.
                    </p>

                    {/* CTA */}
                    <div className="flex gap-4">
                        {/*
                        <a href="/demo" className="nav-btn-secondary heroDemoBtn">Book a Demo</a> 
                        */ }
                        <a href="#calculator" className="nav-btn-secondary how-much-losing">See How Much You're Losing</a>
                    </div>
                    <div className="hero-trust-bar">
                        <div className="hero-trust-item">
                            <span className="hero-trust-dot"></span>
                            Works with Stripe Billing
                        </div>

                        <div className="hero-trust-item">
                            <span className="hero-trust-dot"></span>
                            Setup in minutes
                        </div>

                        <div className="hero-trust-item">
                            <span className="hero-trust-dot"></span>
                            No billing migration required
                        </div>
                    </div>
                </div>

                {/* right column */}
                <div className="relative">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
                        <img
                            src="/dashboard_mockup.png"
                            alt="RetryForge dashboard showing recovered revenue analytics"
                            className="rounded-lg"
                        />
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                        Recovered Payment ✓
                    </div>
                </div>

            </div>
        </section>
    );
}

