const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = require("stripe")(stripeKey);
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

exports.handleStripeWebhook = async (req, res, next) => {
  try {
    const event = req.body;
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
    }
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
