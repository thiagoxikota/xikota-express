# Handoff for Claude — Xikota Express

Summary
- PR: https://github.com/thiagoxikota/xikota-express/pull/1
- Branch: `feat/xikota-prd-scaffold` (latest commit pushed)
- Repo root: /Users/thiagoxikota/Documents/02_Projects__ao_store

What I delivered
- PRD and Docs: `Docs/Xikota-PRD-Final.md`, `Docs/design-tokens.schema.json`, prompt templates
- Backend scaffold: `backend/` (Express, adapters, worker, tests, migrate.js)
- Infra & CI: `docker-compose.yml`, `.github/workflows/ci.yml`, `infra/supabase_projects.sql`
- Automation scripts: `scripts/create_pr_local.sh`
- GitHub templates and `CONTRIBUTING.md` (added on feature branch)

What remains / priorities
1. Replace mock adapters with real clients (LLM, Stripe, Figma) and add secure config for secrets.
2. Centralize secrets (recommended: GitHub Secrets for CI, Keychain or Vault for local). The PAT leak was detected and should be revoked (we recommended revocation).
3. Harden CI: add lint, typecheck, Playwright/Playwright-UI verify if web UI present, and run a11y checks.
4. Add branch protection and required checks in GitHub (admin step).
5. Clean git history if any secret was committed (use `git filter-repo` or BFG) — only after confirmation.

Quick commands (run from repo root)
```bash
# run backend smoke tests
./backend/tests/smoke.sh

# run local DBHub (we started a local one during setup)
# ensure Postgres is running and DBHUB DSN env is set
DSN='postgres://postgres:pass@127.0.0.1:5432/dbhub' DSN="$DSN" npx --yes @bytebase/dbhub

# create PR (if needed)
# gh pr create --base main --head feat/xikota-prd-scaffold --title "feat: ..." --body-file PR_DESCRIPTION.md
```

Suggested next work for Claude (explicit tasks)
1. Run the CI workflow locally (or on GitHub Actions) and fix any failing steps.
2. Audit `backend/adapters/*` and implement real clients in `adapters/*_real.js` using environment variables for credentials.
3. Implement secrets centralization: create `scripts/extract_secrets.sh` that finds and replaces inline secrets with env placeholders, and prepare a PR that moves secrets into `GitHub Actions -> Secrets` (list them; do NOT include values in PR).
4. Add Playwright tests for the most important UI flows and wire them to CI.
5. Improve PR description and split into smaller PRs if reviewers prefer (e.g., docs separate from infra).

Suggested Claude prompt (paste to Claude to continue)
"I have a feature branch at `feat/xikota-prd-scaffold` containing a PR with a PRD, backend scaffold, CI, and infra. Please run the CI/workflow, audit the adapters under `backend/adapters`, implement production-ready clients that read credentials from environment variables, and open follow-up PRs for (A) adapters, (B) CI improvements, and (C) secrets centralization. Prepare a summary of changes and any secrets you require. Don't push secrets to Git. Use the repo at /Users/thiagoxikota/Documents/02_Projects__ao_store."

Security note
- A GitHub PAT (`ghp_...`) was pasted into chat earlier — revoke it immediately in https://github.com/settings/tokens and rotate any affected credentials. I ran a workspace scan and reported file paths; no other obvious matches found.

Files to inspect first
- `backend/adapters/` — mock vs real adapters
- `backend/tests/smoke.sh` — smoke script
- `.github/workflows/ci.yml` — CI flow
- `Docs/design-tokens.schema.json` — validate tokens with AJV

If you want, I can now create the initial follow-up PRs (adapters, CI) as drafts; tell me whether to proceed and confirm credentials placement (I will not accept raw secrets in chat).
