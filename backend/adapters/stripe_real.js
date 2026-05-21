// Placeholder Stripe adapter - implement PaymentIntent / Checkout integration
// Exports: async createCheckoutSession(projectId, priceCents), verifyWebhook(req)

async function createCheckoutSession(projectId, priceCents) {
  throw new Error('Stripe real adapter not implemented.');
}

function verifyWebhook(req) {
  throw new Error('Stripe webhook verification not implemented.');
}

module.exports = { createCheckoutSession, verifyWebhook };
