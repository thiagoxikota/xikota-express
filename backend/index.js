const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const stripeAdapter = require('./adapters/stripe');

const app = express();
app.use(bodyParser.json());

// small CORS helper for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/projects', (req, res) => {
  const formData = req.body;
  const id = `prj_${uuidv4()}`;
  const priceMap = { 'Identidade Visual': 10000, 'Landing Page': 25000, 'Material Social': 10000, 'App / UI': 50000 };
  const selected = formData.type || 'Landing Page';
  const price = priceMap[selected] || 25000;

  db.insertProject({ id, user_id: null, status: 'draft', form_data: JSON.stringify(formData), price_cents: price });
  const session = stripeAdapter.createCheckoutSession(id, price);

  res.json({ projectId: id, checkoutUrl: session.url, price_cents: price });
});

app.get('/projects/:id', (req, res) => {
  const id = req.params.id;
  const project = db.getProjectById(id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  // parse JSON fields
  project.form_data = JSON.parse(project.form_data);
  project.design_tokens = project.design_tokens ? JSON.parse(project.design_tokens) : null;
  project.figma_nodes = project.figma_nodes ? JSON.parse(project.figma_nodes) : null;
  res.json(project);
});

// Mock Stripe webhook endpoint for local development
app.post('/webhooks/stripe', (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ error: 'missing projectId' });
  // set status to paid
  const proj = db.getProjectById(projectId);
  if (!proj) return res.status(404).json({ error: 'project not found' });
  db.updateProject({ id: projectId, status: 'paid', design_tokens: proj.design_tokens, figma_file_url: proj.figma_file_url, figma_nodes: proj.figma_nodes, stripe_payment_id: `pi_mock_${projectId}`, price_cents: proj.price_cents });
  res.json({ ok: true });
});

app.get('/mock-checkout', (req, res) => {
  const { projectId } = req.query;
  // simulate checkout completed by calling webhook internally
  res.send(`Mock checkout complete. To finalize run: curl -X POST http://localhost:3000/webhooks/stripe -H "Content-Type: application/json" -d '{"projectId":"${projectId}"}'`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Xikota backend mock running on http://localhost:${port}`));
