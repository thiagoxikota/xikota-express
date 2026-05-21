const db = require('./db');
const llm = require('./adapters/llm');
const figma = require('./adapters/figma');
const validate = require('./ajv-validate');

async function processPaidProject(project) {
  try {
    console.log('Processing project', project.id);
    const formData = JSON.parse(project.form_data);
    const tokens = llm.generateTokens(formData);
    const { valid, errors } = validate.validateTokens(tokens);
    if (!valid) {
      console.error('Validation failed', errors);
      db.updateProject({ id: project.id, status: 'error', design_tokens: null, figma_file_url: null, figma_nodes: null, stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
      return;
    }

    const figmaRes = figma.createMockFile(tokens);
    db.updateProject({ id: project.id, status: 'ready', design_tokens: JSON.stringify(tokens), figma_file_url: figmaRes.url, figma_nodes: JSON.stringify(figmaRes.nodes), stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
    console.log('Project processed, figma_url=', figmaRes.url);
  } catch (err) {
    console.error('Processing error', err);
    db.updateProject({ id: project.id, status: 'error', design_tokens: null, figma_file_url: null, figma_nodes: null, stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
  }
}

async function poll() {
  const projects = db.listProjectsByStatus('paid');
  if (!projects || projects.length === 0) return;
  for (const p of projects) {
    await processPaidProject(p);
  }
}

console.log('Worker started: polling every 5s');
setInterval(poll, 5000);
