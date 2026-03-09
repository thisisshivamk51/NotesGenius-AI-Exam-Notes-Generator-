const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession, stripeWebhook, getPaymentHistory, getCreditPacks } = require('../controllers/paymentController');

router.post('/webhook', stripeWebhook);
router.use(protect);
router.get('/credit-packs', getCreditPacks);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/history', getPaymentHistory);

module.exports = router;
