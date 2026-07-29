import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SEC);

// IMPORTANT: your connected account id
const CONNECTED_ACCOUNT = "acct_1Tf0pOGo1N3i5kYn";

async function run() {
  console.log("Running on connected account:", CONNECTED_ACCOUNT);

  // 1. Create a customer on the CONNECTED account
  const customer = await stripe.customers.create(
    {
      email: "fail-test@example.com",
      name: "Fail Test User",
    },
    {
      stripeAccount: CONNECTED_ACCOUNT,
    }
  );

  console.log("Customer:", customer.id);

  // 2. Create a payment method that WILL fail
  const paymentMethod = await stripe.paymentMethods.create(
  {
    type: "card",
    card: {
      token: "tok_chargeDeclined", // or tok_visa
    },
  },
  {
    stripeAccount: CONNECTED_ACCOUNT,
  }
);

  console.log("Payment method:", paymentMethod.id);

  // 3. Attach payment method
  await stripe.paymentMethods.attach(
    paymentMethod.id,
    {
      customer: customer.id,
    },
    {
      stripeAccount: CONNECTED_ACCOUNT,
    }
  );

  // 4. Set as default
  await stripe.customers.update(
    customer.id,
    {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    },
    {
      stripeAccount: CONNECTED_ACCOUNT,
    }
  );

  // 5. Create subscription → this triggers invoice cycle
  const subscription = await stripe.subscriptions.create(
    {
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Fail Subscription",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    },
    {
      stripeAccount: CONNECTED_ACCOUNT,
    }
  );

  console.log("Subscription:", subscription.id);
}

run().catch(console.error);