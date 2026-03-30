/**
 * NavzaBD checkout — Stripe Checkout Session (redirect flow).
 *
 * Env:
 *   STRIPE_SECRET_KEY       — required for live/initiate
 *   STRIPE_WEBHOOK_SECRET   — required for POST /api/payments/webhook
 *   STRIPE_CURRENCY         — default "usd" (set e.g. "bdt" if your Stripe account supports it)
 *   CLIENT_URL              — frontend origin, e.g. http://localhost:3000
 *
 * Redirects:
 *   success → {CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}
 *   cancel  → {CLIENT_URL}/payment/fail?reason=cancelled
 *
 * SSLCommerz: not bundled here; add a separate handler using sslcommerz-lts
 * and the same Order + mark-paid pattern if you switch gateways.
 */
const Order = require("../models/orderModel");
const Product = require("../models/productModel.js");

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require("stripe")(key);
}

function getClientBaseUrl() {
  return (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
}

function getStripeCurrency() {
  return (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
}

/** Minor units: assume 2-decimal currencies (USD, BDT, EUR, etc.) */
function toStripeUnitAmount(unitPrice) {
  return Math.round(Number(unitPrice) * 100);
}

async function markOrderPaidFromStripe(orderId, { stripeSessionId, paymentIntentId } = {}) {
  const order = await Order.findById(orderId);
  if (!order) return null;
  if (order.status === "paid") return order;

  order.status = "paid";
  if (!order.shippingAddress) order.shippingAddress = {};
  order.shippingAddress.paidAt = new Date();
  if (stripeSessionId) order.shippingAddress.stripeSessionId = stripeSessionId;
  if (paymentIntentId) order.shippingAddress.PaymentIntentId = paymentIntentId;
  await order.save();

  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
    product.stock = Math.max(0, product.stock - item.quantity);
    await product.save();
  }

  return order;
}

/**
 * POST /api/payment/initiate (protected)
 * Body: { amount, items, shippingAddress } or { amount, orderId }
 * Creates Stripe Checkout Session; returns { url, sessionId, orderId }.
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503);
      throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }

    const userId = req.user._id;
    const userEmail = req.user.email;
    const { amount, items, shippingAddress, orderId } = req.body;

    const clientBase = getClientBaseUrl();
    const successUrl = `${clientBase}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const failUrl = `${clientBase}/payment/fail`;
    const cancelUrl = `${clientBase}/payment/fail?reason=cancelled`;

    const currency = getStripeCurrency();

    const buildLineItems = (orderItems) =>
      orderItems.map((i) => ({
        price_data: {
          currency,
          product_data: { name: i.name },
          unit_amount: toStripeUnitAmount(i.price),
        },
        quantity: i.quantity,
      }));

    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order || order.userId.toString() !== userId.toString()) {
        res.status(404);
        throw new Error("Order not found");
      }
      if (order.status !== "pending") {
        res.status(400);
        throw new Error("Order is not payable");
      }
      if (Math.abs(order.total - Number(amount)) > 0.01) {
        res.status(400);
        throw new Error("Amount does not match order total");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: userEmail || undefined,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString(),
        },
        line_items: buildLineItems(order.items),
      });

      order.shippingAddress.stripeSessionId = session.id;
      await order.save();

      return res.status(200).json({
        url: session.url,
        sessionId: session.id,
        orderId: order._id,
        cancelUrl: failUrl,
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      shippingAddress.postalCode === undefined ||
      shippingAddress.postalCode === null ||
      shippingAddress.postalCode === ""
    ) {
      res.status(400);
      throw new Error(
        "shippingAddress with street, city, country, and postalCode is required",
      );
    }

    const lineItems = Array.isArray(items) ? items : [];
    if (lineItems.length === 0) {
      res.status(400);
      throw new Error("items are required");
    }

    const normalizedItems = lineItems.map((li) => {
      const productId = li.productId || li.product || li._id;
      const quantity = Math.floor(Number(li.quantity || li.qty || 0));
      return {
        productId,
        name: String(li.name || "Product"),
        price: Number(li.price),
        quantity,
        image: li.image || "",
      };
    });

    for (const it of normalizedItems) {
      if (!it.productId || it.quantity < 1 || !Number.isFinite(it.price)) {
        res.status(400);
        throw new Error("Invalid order items");
      }
      const product = await Product.findById(it.productId).select("stock name");
      if (!product) {
        res.status(400);
        throw new Error("Invalid product in cart");
      }
      if (it.quantity > product.stock) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.name || it.name}. Only ${product.stock} left.`,
        );
      }
    }

    const computedTotal = normalizedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    if (Math.abs(computedTotal - Number(amount)) > 0.01) {
      res.status(400);
      throw new Error("Amount does not match cart total");
    }

    const order = await Order.create({
      userId,
      items: normalizedItems,
      total: computedTotal,
      status: "pending",
      shippingAddress: {
        street: String(shippingAddress.street),
        city: String(shippingAddress.city),
        country: String(shippingAddress.country),
        postalCode: String(shippingAddress.postalCode),
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
      line_items: buildLineItems(normalizedItems),
    });

    order.shippingAddress.stripeSessionId = session.id;
    await order.save();

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
      orderId: order._id,
      cancelUrl: failUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payment/verify?session_id=...
 * Idempotent: marks order paid when Stripe session is paid (backup if webhook is slow).
 */
exports.verifyCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const sessionId = req.query.session_id;
    if (!stripe || !sessionId) {
      res.status(400);
      throw new Error("session_id is required");
    }

    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    const orderId = session.metadata?.orderId;

    if (session.payment_status === "paid" && orderId) {
      const pi = session.payment_intent;
      const paymentIntentId =
        typeof pi === "string" ? pi : pi && typeof pi === "object" && "id" in pi
          ? String(pi.id)
          : undefined;
      await markOrderPaidFromStripe(orderId, {
        stripeSessionId: session.id,
        paymentIntentId,
      });
    }

    return res.status(200).json({
      success: session.payment_status === "paid",
      orderId: orderId || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503);
      throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }
    const { amount, orderId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: getStripeCurrency(),
      metadata: { orderId: String(orderId || "") },
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("Stripe webhook not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId && session.payment_status === "paid") {
        const pi = session.payment_intent;
        const paymentIntentId =
          typeof pi === "string"
            ? pi
            : pi && typeof pi === "object" && "id" in pi
              ? String(pi.id)
              : undefined;
        await markOrderPaidFromStripe(orderId, {
          stripeSessionId: session.id,
          paymentIntentId,
        });
      }
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await markOrderPaidFromStripe(orderId, {
          paymentIntentId: paymentIntent.id,
        });
      }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return res.status(500).json({ received: false, error: e.message });
  }

  res.status(200).json({ received: true });
};
