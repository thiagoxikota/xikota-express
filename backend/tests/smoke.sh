#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:3000"

echo "Creating project..."
RESP=$(curl -s -X POST "$BASE/projects" -H "Content-Type: application/json" -d '{"type":"Landing Page","description":"Plataforma B2B SaaS para gestão logística. Exemplo de descrição com mais de cinquenta caracteres para teste.","vibe":"Minimalista","colors":{"hexes":["#000000","#333333","#E5E5E5"]}}')
echo "Response: $RESP"

PROJECT_ID=$(echo "$RESP" | sed -n 's/.*"projectId":"\([^"]*\)".*/\1/p')
CHECKOUT_URL=$(echo "$RESP" | sed -n 's/.*"checkoutUrl":"\([^"]*\)".*/\1/p')

if [ -z "$PROJECT_ID" ]; then
  echo "Failed to parse projectId" >&2
  exit 1
fi

echo "Project ID: $PROJECT_ID"
echo "Checkout URL: $CHECKOUT_URL"

echo "Simulating checkout webhook..."
curl -s -X POST "$BASE/webhooks/stripe" -H "Content-Type: application/json" -d "{\"projectId\":\"$PROJECT_ID\"}"

echo "Waiting worker to process (5s) ..."
sleep 5

echo "Fetching project..."
curl -s "$BASE/projects/$PROJECT_ID" | python -m json.tool

echo "Done."
