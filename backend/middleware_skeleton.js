// Middleware skeleton for Xikota - replace mocks with real clients
// Responsibilities:
// - Validate incoming project events
// - Enqueue jobs for processing
// - Retry and audit LLM/Figma calls
// TODO: integrate with real queue (BullMQ / Redis) and background workers

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Example endpoint to enqueue processing for a paid project
app.post('/enqueue/:id', async (req, res) => {
  const id = req.params.id;
  const project = db.getProjectById(id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  // TODO: push job to queue with idempotency key
  // For now, update status to processing to simulate enqueue
  db.updateProject({ id, status: 'processing', design_tokens: project.design_tokens, figma_file_url: project.figma_file_url, figma_nodes: project.figma_nodes, stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
  res.json({ ok: true });
});

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.MW_PORT || 3100;
app.listen(port, () => console.log(`Middleware skeleton listening on http://localhost:${port}`));

module.exports = app;
