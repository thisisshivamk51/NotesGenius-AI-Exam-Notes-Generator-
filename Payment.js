const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit_pack', 'subscription'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    creditsAdded: { type: Number, default: 0 },
    stripePaymentId: { type: String },
    stripeSessionId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    planName: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
