#!/usr/bin/env bash
set -euo pipefail

# create_pr_local.sh
# Usage:
#   REMOTE_URL=git@github.com:USER/REPO.git ./scripts/create_pr_local.sh
# If origin is missing, set REMOTE_URL env var. Requires gh CLI authenticated to open PR automatically.

BRANCH=feat/xikota-prd-scaffold
TITLE="feat: Xikota Express — PRD, schema, backend scaffold, worker & CI"
BODY_FILE=PR_DESCRIPTION.md
BASE_BRANCH=main

root_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$root_dir"

echo "Checking branch $BRANCH exists..."
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "Branch $BRANCH not found locally. Exiting." >&2
  exit 1
fi

echo "Ensuring clean working tree..."
if ! git diff --quiet || ! git diff --staged --quiet; then
  echo "Working tree has changes. Commit or stash before running this script." >&2
  git status --porcelain
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already configured." 
else
  if [ -z "${REMOTE_URL:-}" ]; then
    echo "Remote 'origin' not configured. Provide REMOTE_URL env var to add remote." >&2
    echo "Example: REMOTE_URL=git@github.com:USERNAME/REPO.git $0" >&2
    exit 1
  else
    echo "Adding remote origin=$REMOTE_URL"
    git remote add origin "$REMOTE_URL"
  fi
fi

echo "Pushing branch $BRANCH to origin..."
git push -u origin "$BRANCH"

if command -v gh >/dev/null 2>&1; then
  echo "Creating PR via gh..."
  gh pr create --base "$BASE_BRANCH" --head "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE" || true
  echo "PR command executed. If authenticated, PR should be open." 
else
  echo "gh CLI not found. To create PR manually run:" 
  echo "  gh pr create --base $BASE_BRANCH --head $BRANCH --title '$TITLE' --body-file $BODY_FILE"
fi

echo "Done."
