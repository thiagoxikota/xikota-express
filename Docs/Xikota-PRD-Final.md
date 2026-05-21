# Xikota Express — PRD Final (Maio 2026)

Resumo executivo
- Produto: Design as a Service (DaaS) — pacotes productizados (Basic / Standard / Premium) com SLA 24h.
- Proposta: automação LLM → Figma + curadoria humana (últimos 10%).

1. Modelo de negócio
- Pacotes e preços: Basic R$100, Standard R$250, Premium R$500, Enterprise sob orçamento.
- Inclusões: entregáveis fixos por pacote; 1 rodada gratuita de revisão textual/cores; mudanças estruturais cobradas.

2. Arquitetura operacional (sumário)
- Front-end (`App.jsx`) envia `formData` para `POST /projects`.
- Persistência: Supabase table `projects` (status lifecycle: draft → paid → processing → ready → assigned → completed).
- Pagamento: Stripe Checkout; webhook `checkout.session.completed` atualiza `projects.status=paid` e enfileira job.
- Middleware: LLM Adapter -> Token Compiler -> Figma Adapter -> persistência `designTokens` + `figma_url`.
- Orquestração/Notificação: n8n / Make para notificações (Telegram/WhatsApp), e dashboard admin para retries e atribuições.

3. Hand-off (middleware)
- Responsibilities: normalize `formData`, call LLM using prompt template (see `Docs/llm-prompts/design-tokens-prompt.md`), validate JSON against `design-tokens.schema.json` (AJV), call Figma API to create styles & frames, persist results.
- Resiliência: retries exponenciais, idempotência por `project_id`, audit logs de prompts/responses, circuit-breaker para LLM.

4. UX / Onboarding (refinado)
- Direction: minimal, high-contrast, whitespace, engineering tone.
- Validations: description >= 50 chars; reference URLs must match `^https?://`; required selection of package & vibe; advance button disabled until validations pass.
- Micro-interactions: 300ms border activation on click; back arrow mandatory; loading phases (7s split in 3) during processing.
- Accessibility: pre-approved palettes with contrast ratios, focus visible, reduced-motion support.
- Files: see `Docs/ux-onboarding.md` for step-by-step and microcopy.

5. API Endpoints (MVP)
- `POST /projects` — create draft (body: `formData`), returns `projectId`.
- `GET /projects/:id` — fetch status and payload (auth required for private data).
- `POST /webhooks/stripe` — verify sig, set `status=paid`, enqueue job.
- `POST /projects/:id/refaction` — compute extra charge and create PaymentIntent.

6. Data model (Supabase)
- Table: `projects` (see migration `infra/supabase_projects.sql`). Fields: `id`, `user_id`, `status`, `form_data` (jsonb), `design_tokens` (jsonb), `figma_file_url`, `figma_nodes` (jsonb), `price_cents`, `stripe_payment_id`, `created_at`, `updated_at`.

7. Acceptance criteria (MVP)
- Front-end onboarding flow implemented with validations and loading phases.
- `formData` persisted in Supabase `projects` table.
- Stripe checkout integrated; webhook updates `projects.status` to `paid`.
- Middleware worker (mock LLM OK) transforms paid projects into `designTokens` and writes minimal Figma frames (mock or real).
- Admin dashboard shows queue, job logs, and allows manual retry.

8. KPIs
- TTV ≤ 24h for 95% of projects.
- Onboarding→Payment conversion ≥ 20%.
- CSAT ≥ 4.3/5.
- Designer time ≤ 30 minutes average.

9. Next steps
- Run Supabase migration `infra/supabase_projects.sql`.
- Implement middleware worker (use prompt template + AJV validation).
- Integrate real Figma API in Sprint1 and switch from mock.

Referências e artefatos
- `Docs/design-tokens.schema.json`
- `Docs/llm-prompts/design-tokens-prompt.md`
- `Docs/examples/design-tokens-sample.json`
- `Docs/ux-onboarding.md`
- `infra/supabase_projects.sql`
