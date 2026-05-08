
export default function Problem() {
    return (
        <section className="problem">
            <div className="container grid">
                <h2 className="section-title">Failed payments are silently killing your revenue</h2>

                <p>
                    Most SaaS companies lose 5–15% of revenue due to failed payments—and never recover most of it.
                </p>
                <div className="problem-cards gap-4">
                    <div className="problem-card">
                    <span>💳</span><h3>Expired cards</h3>
                    <p>Customers don’t update payment details in time.</p>
                    </div>

                    <div className="problem-card">
                    <span>🏦</span><h3>Bank declines</h3>
                    <p>Legitimate payments get rejected unexpectedly.</p>
                    </div>

                    <div className="problem-card">
                    <span>⏱️</span><h3>Poor retry timing</h3>
                    <p>Default retries miss optimal recovery windows.</p>
                    </div>
                </div>
                <p className="problem-footer">
                    Failed payments are one of the highest-ROI revenue problems in SaaS — because the customer already intended to pay.
                    8% fail rate. 30% recoverable.
                </p>
            </div>
        </section>
    )
}