#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://blink-markets.vercel.app}"
SERVICE_URL="${SERVICE_URL:-https://veterans-pockets-marco-wants.trycloudflare.com}"
WAVE="${WAVE:-1}" # 1=Wave 1 (GraphQL optional), 2+=require GraphQL

echo "🚀 Running Wave ${WAVE} Completion Smoke Tests"
echo "Site: ${SITE_URL}"
echo "Service: ${SERVICE_URL}"

# ---- Site check (follow redirects, accept any 2xx) ----
site_status=$(curl -sS -o /dev/null -L --connect-timeout 5 --max-time 10 -w "%{http_code}" "${SITE_URL}")
if [[ "${site_status}" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ OK: Site ${site_status}"
else
  echo "❌ FAIL: Site returned ${site_status}"
  exit 1
fi

# ---- GraphQL check (no pipefail issues) ----
curl_q() {
  local url="$1"
  local resp
  resp=$(curl -sS -X POST "${url}" \
      -H 'content-type: application/json' \
      --connect-timeout 5 --max-time 10 \
      --data '{"query":"{ __typename }"}' 2>/dev/null || true)
  grep -q '__typename' <<<"${resp}" 2>/dev/null
}

GRAPHQL_OK=0
if curl_q "${SERVICE_URL}" || curl_q "${SERVICE_URL%/}/graphql"; then
  echo "✅ OK: GraphQL responding"
  GRAPHQL_OK=1
else
  echo "⚠️  WARN: No working GraphQL endpoint found at / or /graphql"
fi

if (( WAVE >= 2 )) && [[ "${GRAPHQL_OK}" -ne 1 ]]; then
  echo "❌ FAIL: GraphQL is required for Wave ${WAVE}"
  exit 1
fi

echo "🎉 PASS: Wave ${WAVE} smoke tests complete"