module.exports = {
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },
  CREDIT_COSTS: {
    GENERATE_NOTES: 10,
    GENERATE_DIAGRAMS: 5,
    REVISION_MODE: 5,
    IMPORTANT_QUESTIONS: 5,
  },
  PLANS: {
    FREE: { name: 'Free', credits: 50 },
    BASIC: { name: 'Basic', credits: 500, priceId: 'price_basic_monthly' },
    PREMIUM: { name: 'Premium', credits: 1500, priceId: 'price_premium_monthly' },
  },
  CREDIT_PACKS: [
    { credits: 100, price: 100, label: '100 Credits - $1' },
    { credits: 500, price: 400, label: '500 Credits - $4' },
    { credits: 1000, price: 700, label: '1000 Credits - $7' },
  ],
  DEFAULT_FREE_CREDITS: parseInt(process.env.DEFAULT_FREE_CREDITS) || 50,
};
