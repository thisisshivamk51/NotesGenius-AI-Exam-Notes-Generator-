const { CREDIT_COSTS } = require('../config/constants');

const checkCredits = (action) => {
  return (req, res, next) => {
    const required = CREDIT_COSTS[action] || 10;
    if (req.user.credits < required) {
      return res.status(402).json({
        success: false,
        message: `Insufficient credits. You need ${required} credits for this action.`,
        creditsRequired: required,
        creditsAvailable: req.user.credits,
      });
    }
    req.creditCost = required;
    next();
  };
};

module.exports = { checkCredits };
