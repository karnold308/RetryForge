import type { FAQ } from "../models/types"

export function FAQ() {

    const faqs: FAQ[] = [
        {
            question: "Does RetryForge replace Stripe Smart Retries?",
            answer: `No. RetryForge works alongside Stripe Billing and builds on top of your
          existing subscription setup. Stripe handles payment infrastructure while
          RetryForge focuses on improving failed payment recovery with optimized
          retry timing, recovery workflows, and better visibility into recovered revenue.`
        },
        {
            question: "How long does setup take?",
            answer: `Most teams can connect Stripe and begin tracking failed payments in just
          a few minutes. No complex onboarding or billing migration is required.`
        },
        {
            question: "Do I need to change my billing code?",
            answer: `No. RetryForge is designed to work with your existing Stripe Billing
          setup without requiring major code changes or a custom payment flow.`
        },
        {
            question: "How does RetryForge recover failed payments?",
            answer: `RetryForge automatically detects failed subscription payments and runs
          optimized retry sequences designed to improve recovery rates. It can
          also trigger automated customer workflows such as card update reminders
          and recovery emails.`
        },
        {
            question: "What kinds of failed payments can be recovered?",
            answer: `RetryForge helps recover common failed payments caused by expired cards,
          temporary bank declines, insufficient funds, and outdated payment details.
          Some payment failures are unrecoverable, but many can be recovered with
          better retry timing and customer follow-up.`
        },
        {
            question: "How is pricing calculated?",
            answer: `RetryForge uses simple performance-based pricing: a monthly platform fee
          plus a percentage of successfully recovered revenue. You only pay when
          revenue is recovered.`
        },
        {
            question: "Can I customize retry timing and workflows?",
            answer: `Yes. RetryForge is designed to give you more control over recovery
          strategies, including retry timing, recovery workflows, and customer
          communication sequences.`
        },
        {
            question: "What happens if a payment still fails?",
            answer: `If a payment cannot be recovered after retries and recovery workflows,
          the subscription remains unpaid according to your Stripe subscription
          settings and dunning rules.`
        },
        {
            question: "Does RetryForge work internationally?",
            answer: `Yes. RetryForge works with Stripe Billing and supports businesses with
          customers in multiple countries and currencies supported by Stripe.`
        },
    ]

    return (
        <section className="faq-section section-light" id="faq">
  <div className="container">
    <div className="faq-header">
      <h2 className="section-title">Frequently asked questions</h2>
      <p className="faq-subtitle">
        Everything you need to know before connecting your Stripe account.
      </p>
    </div>

    <div className="faq-list">
        {faqs.map((faq,index) => (

            <details key={index} className="faq-item" open={0 === index ? true : false}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
            </details>
        ))}

    </div>
  </div>
</section>
    )
}