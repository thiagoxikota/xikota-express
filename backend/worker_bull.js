/*
  Production-ready worker skeleton using BullMQ + Redis.
  - Expects REDIS_URL in env (e.g. redis://localhost:6379)
  - Job name: 'process:project' with data { projectId }
  - Uses adapters: adapters/llm_real.js and adapters/figma_real.js (placeholders).
  - Falls back to mock adapters if real adapters throw.
*/

require('dotenv').config();
const { Worker, Queue, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');
const db = require('./db');
const llmReal = require('./adapters/llm_real');
const figmaReal = require('./adapters/figma_real');
const llmMock = require('./adapters/llm');
const figmaMock = require('./adapters/figma');
const validate = require('./ajv-validate');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new IORedis(REDIS_URL);

const queueName = 'projects';
const queue = new Queue(queueName, { connection });
const scheduler = new QueueScheduler(queueName, { connection });

async function processJob(job) {
  const { projectId } = job.data;
  console.log('[bull] processing project', projectId);
  const project = db.getProjectById(projectId);
  if (!project) throw new Error('project not found');

  const formData = JSON.parse(project.form_data);
  let tokens;
  try {
    tokens = await llmReal.generateDesignTokens(formData);
  } catch (err) {
    console.warn('[bull] llmReal failed or not implemented, falling back to mock', err.message);
    tokens = llmMock.generateTokens(formData);
  }

  const { valid, errors } = validate.validateTokens(tokens);
  if (!valid) {
    console.error('[bull] Validation failed', errors);
    // Save diagnostics for human review
    db.updateProject({ id: projectId, status: 'error', design_tokens: JSON.stringify({ error: true, errors }), figma_file_url: null, figma_nodes: null, stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
    return;
  }

  let figmaRes;
  try {
    figmaRes = await figmaReal.createFileFromTokens(tokens);
  } catch (err) {
    console.warn('[bull] figmaReal failed or not implemented, falling back to mock', err.message);
    figmaRes = figmaMock.createMockFile(tokens);
  }

  db.updateProject({ id: projectId, status: 'ready', design_tokens: JSON.stringify(tokens), figma_file_url: figmaRes.url, figma_nodes: JSON.stringify(figmaRes.nodes), stripe_payment_id: project.stripe_payment_id, price_cents: project.price_cents });
  console.log('[bull] project ready', projectId);
}

const worker = new Worker(queueName, async job => {
  await processJob(job);
}, { connection, concurrency: 2 });

worker.on('failed', (job, err) => {
  console.error('[bull] job failed', job.id, err);
});

console.log('BullMQ worker started, queue:', queueName);

// helper to enqueue from CLI
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    if (args[0] === 'enqueue' && args[1]) {
      const projectId = args[1];
      await queue.add('process:project', { projectId }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
      console.log('Enqueued project', projectId);
      process.exit(0);
    }
  })();
}
