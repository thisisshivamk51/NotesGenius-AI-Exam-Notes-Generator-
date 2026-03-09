const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');
const { CREDIT_PACKS } = require('../config/constants');

// POST /api/v1/payments/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { packIndex } = req.body;
    const pack = CREDIT_PACKS[packIndex];
    if (!pack) return res.status(400).json({ success: false, message: 'Invalid credit pack' });

    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${pack.credits} ExamNotesAI Credits` },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      metadata: { userId: req.user._id.toString(), credits: pack.credits, packIndex },
    });

    await Payment.create({
      userId: req.user._id,
      type: 'credit_pack',
      amount: pack.price,
      creditsAdded: pack.credits,
      stripeSessionId: session.id,
      status: 'pending',
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/payments/webhook
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, credits } = session.metadata;

    await User.findByIdAndUpdate(userId, { $inc: { credits: parseInt(credits) } });
    await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: 'completed', stripePaymentId: session.payment_intent }
    );
  }

  res.json({ received: true });
};

// GET /api/v1/payments/history
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/payments/credit-packs
const getCreditPacks = async (req, res) => {
  res.json({ success: true, packs: CREDIT_PACKS });
};

module.exports = { createCheckoutSession, stripeWebhook, getPaymentHistory, getCreditPacks };
