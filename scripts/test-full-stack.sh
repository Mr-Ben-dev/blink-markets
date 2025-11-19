#!/usr/bin/env bash
set -euo pipefail

echo "🧪 Testing Blink Markets Full Stack Integration"
echo "================================================"

# Configuration
export LINERA_WALLET="/tmp/.tmpcyDSlC/wallet_0.json"
export LINERA_KEYSTORE="/tmp/.tmpcyDSlC/keystore_0.json"
export LINERA_STORAGE="rocksdb:/tmp/.tmpcyDSlC/client_0.db"

CHAIN_ID="ec77531fa6d42ef1b2726b6c674ea5c99f7d075c5330692c4d3f1758ef25fe9f"
APP_ID="e48d3909d562d5ec69f307d12908762bea6f6d43aa81b35b37438a8717b4528c"
GRAPHQL_URL="http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}"

echo "📍 Chain ID: ${CHAIN_ID}"
echo "📦 App ID: ${APP_ID}"
echo "🔗 GraphQL: ${GRAPHQL_URL}"
echo ""

# Test 1: Query initial state
echo "✅ Test 1: Query initial block height"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { blockHeight }"}' | jq -r '.data.blockHeight'

echo ""
echo "✅ Test 2: Query initial markets (should be empty)"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { markets { id question } }"}' | jq '.data.markets | length'

echo ""
echo "📊 Test 3: Creating first market - Bitcoin to $100K"
# Create market via GraphQL mutation
MUTATION=$(curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMarket(question: \"Will Bitcoin reach $100K by Dec 2024?\", outcomes: [\"Yes\", \"No\"], description: \"Prediction market for Bitcoin price\", endTime: 1735689600) }"
  }' | jq -r '.data.createMarket')

# Convert hex to base64 and execute operation
echo "Operation bytes: ${MUTATION}"

# Submit the operation using linera client
cd /root/dev/blink-markets/blink_markets
echo "${MUTATION}" | xxd -r -p | linera execute-operation || true

echo ""
echo "📊 Test 4: Creating second market - Ethereum Upgrade"
MUTATION2=$(curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMarket(question: \"Will ETH 2.0 complete in 2024?\", outcomes: [\"Yes\", \"No\"], description: \"Ethereum upgrade prediction\", endTime: 1735689600) }"
  }' | jq -r '.data.createMarket')

echo "Operation bytes: ${MUTATION2}"

echo ""
echo "✅ Test 5: Query markets after creation"
sleep 2
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { markets { id question outcomes resolved totalVolume } }"}' | jq '.data.markets'

echo ""
echo "✅ Test 6: Query updated block height"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { blockHeight }"}' | jq -r '.data.blockHeight'

echo ""
echo "✅ Test 7: Query leaderboard"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { leaderboard { user points wins totalBets } }"}' | jq '.data.leaderboard'

echo ""
echo "🎉 Full Stack Test Complete!"
echo ""
echo "🌐 Frontend: http://localhost:8081"
echo "🔗 GraphQL: http://localhost:8080"
echo "📊 GraphiQL: ${GRAPHQL_URL}"
