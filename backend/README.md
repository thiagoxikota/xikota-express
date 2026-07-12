# Xikota Backend (Local Mock)

This is a local development scaffold for the Xikota Express backend. It uses local SQLite and mocks for LLM, Figma and Stripe so you can run everything without external API keys.

Prereqs
- Node.js 18+ and npm

Install

```bash
cd backend
npm install
```

Run server

```bash
npm start
```

Run worker (separate terminal)

```bash
npm run worker
```

Test flow

1. Create a project:

```bash
curl -X POST http://localhost:3000/projects -H "Content-Type: application/json" -d '{"type":"Landing Page","description":"Plataforma B2B...","vibe":"Minimalista","colors":{"hexes":["#000000","#333333","#E5E5E5"]}}'
```

2. Use the returned `checkoutUrl` to simulate checkout. The mock checkout page includes a curl that triggers the webhook.

Note: on some systems you may need to make the smoke script executable before running it:

```bash
chmod +x tests/smoke.sh
```

3. Worker will detect `paid` projects and generate `design_tokens` and a mock `figma_file_url`.

Wiring real services
- Replace files in `adapters/` with real clients and set environment variables. Keep the same adapter interface.

Production-ready worker (BullMQ + Redis)
- A production-ready worker skeleton was added at `worker_bull.js`. It requires `REDIS_URL` (e.g. `redis://localhost:6379`).
- To run Redis locally for the Bull worker, use the repository `docker-compose.yml`:

```bash
docker-compose up -d redis
```

- Then run the worker:

```bash
REDIS_URL=redis://localhost:6379 node worker_bull.js
```

CI
- A GitHub Actions workflow `/.github/workflows/ci.yml` runs the smoke tests on push/PRs. The CI uses the polling worker for simplicity.
