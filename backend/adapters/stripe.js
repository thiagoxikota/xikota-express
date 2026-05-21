// Mock Stripe adapter for local dev
function createCheckoutSession(projectId, priceCents) {
  return {
    id: `cs_mock_${projectId}`,
    url: `http://localhost:3000/mock-checkout?projectId=${projectId}`,
    amount: priceCents
  };
}

module.exports = { createCheckoutSession };
