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
                            <h3>&nbsp;Recover revenue automatically</h3>
                        </div>
                        <p>Automatically retry failed invoices at higher-converting times run in the background to recover lost payments.</p>
                    </div>
                </div>
                <div>
                    <p>See Exactly What You Recover</p>
                    <div>
                        <div>
                            Failed revenue
                        </div>
                        <div>
                            Recovered revenue
                        </div>
                        <div>
                            Recovery rate (%)
                        </div>
                        <div>
                            Performance by retry timing and email sequence
                        </div>
                    </div>
                    <p>No guesswork. Just clear ROI.</p>
                </div>
            </div>
        </section>
    )
}