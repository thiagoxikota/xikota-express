# Xikota Express

Concept prototype for a productized design service (Design as a Service). A user submits a short brief, picks a package, and the system generates a design-token set and a Figma file, with a human curating the final result.

This repository is a working prototype, not a live product. The backend runs locally against SQLite with mocked LLM, Figma, and Stripe integrations, so the full flow can be exercised without any external API keys.

## What is here

- Docs/Xikota-PRD-Final.md: product requirements for the concept
- Docs/design-tokens.schema.json: JSON Schema for the generated design tokens
- Docs/llm-prompts/, Docs/examples/, Docs/ux-onboarding.md: prompt template, sample output, onboarding spec
- backend/: Express API, polling worker, SQLite wrapper, AJV validation, and mock adapters
- infra/supabase_projects.sql: reference schema for the projects table

## Run the mock locally

Requires Node.js 18 or newer.

```bash
cd backend
npm install
npm start        # API on http://localhost:3000
npm run worker   # second terminal
npm run smoke    # end-to-end mock flow
```

The *_real.js adapters under backend/adapters/ are unimplemented placeholders. Wiring real LLM, Figma, and Stripe clients is out of scope for this prototype.

## Status

Prototype. Not maintained as a shipping product.
