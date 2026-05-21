Title: feat: Xikota Express — PRD, schema, backend scaffold, worker & CI

Summary
- Adds the complete Xikota Express PRD, `design-tokens` schema, LLM prompt template, onboarding UX spec, Supabase migration SQL, and a local backend scaffold with mock adapters. Also includes a BullMQ worker skeleton, Docker Compose for Redis, smoke tests, and a CI workflow to run smoke tests on push/PR.

What's included
- `Docs/Xikota-PRD-Final.md` — final PRD
- `Docs/design-tokens.schema.json` — JSON Schema for design tokens
- `Docs/llm-prompts/design-tokens-prompt.md` — LLM prompt template
- `Docs/examples/design-tokens-sample.json` — example tokens
- `Docs/ux-onboarding.md` — onboarding flow and validations
- `infra/supabase_projects.sql` — migration SQL for `projects`
- `backend/` — Express API, worker (polling), BullMQ worker skeleton, mock adapters, AJV validation, smoke tests
- `docker-compose.yml` — Redis service for local BullMQ
- `.github/workflows/ci.yml` — CI to run smoke tests

Checklist (review before merge)
- [ ] Run smoke tests locally: `cd backend && npm ci && npm start` + `npm run worker` + `npm run smoke`
- [ ] Review `design-tokens.schema.json` and `Docs/examples/design-tokens-sample.json`
- [ ] Verify CI passes on this branch
- [ ] Decide who will provide production secrets (Supabase, Stripe, Figma) and add to repo settings
- [ ] Plan follow-up PRs for: real adapters implementation, infra provisioning, Playwright UI tests

Notes
- The repository contains mock adapters for LLM/Figma/Stripe to allow local development without credentials. Replace `adapters/*_real.js` with real implementations and set environment variables when ready for integration.
