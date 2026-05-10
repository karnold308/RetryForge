

export default function RecoveryFlow() {
    return (
        <>
            <section className="recoveryFlow section-light">
                <div className="container recoveryFlowContainer">
                    <div className="recoveryFlowHeader">
                        <h2 className="section-title">What happens after a payment fails</h2>

                        <p className="recoveryFlowSubtitle">
                            From failed payment to recovered revenue — fully automated.
                        </p>
                    </div>
                    <div className="recoveryFlowCards">
                        <div className="recoveryFlowCard">
                            <div className="recoveryFlowStep">1.</div>
                            <h3>Payment fails</h3>
                            <p>
                                Stripe triggers an
                                <code> invoice.payment_failed </code>
                                event when a subscription payment cannot be processed.
                            </p>
                        </div>
                        <div className="recoveryFlowCard">
                            <div className="recoveryFlowStep">2.</div>
                            <h3>Recovery case created</h3>
                            <p>
                                RetryForge automatically creates a recovery case and schedules
                                retry attempts and customer recovery actions.
                            </p>
                        </div>
                        <div className="recoveryFlowCard">
                            <div className="recoveryFlowStep">3.</div>
                            <h3>Customer notified</h3>
                            <p>
                                Automated recovery emails prompt the customer to update their
                                payment method if needed.
                            </p>
                        </div>
                        <div className="recoveryFlowCard">
                            <div className="recoveryFlowStep">4.</div>
                            <h3>Retry executed</h3>
                            <p>
                                RetryForge triggers optimized payment retries based on recovery
                                timing and customer behavior.
                            </p>
                        </div>
                        <div className="recoveryFlowCard recoveryFlowSuccess">
                            <div className="recoveryFlowStep">5.</div>
                            <h3>Revenue recovered</h3>
                            <p>
                                Successful payments are marked as recovered and all remaining
                                recovery jobs are automatically canceled.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}