#!/usr/bin/env bash
set -euo pipefail

echo "🌱 Seeding Blink Markets with demo data via GraphQL mutations..."

CHAIN_ID="ec77531fa6d42ef1b2726b6c674ea5c99f7d075c5330692c4d3f1758ef25fe9f"
APP_ID="e48d3909d562d5ec69f307d12908762bea6f6d43aa81b35b37438a8717b4528c"
GRAPHQL_URL="http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}"

echo "🔗 Using GraphQL endpoint: ${GRAPHQL_URL}"
echo ""

# Note: GraphQL mutations return serialized operations that need to be submitted via the service
# For demo purposes, we'll show the mutations being called

echo "📊 Market 1: Bitcoin Price Prediction"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMarket(question: \"Will Bitcoin reach $100K by December 2024?\", outcomes: [\"Yes\", \"No\"], description: \"Prediction market for Bitcoin reaching $100,000 USD by end of 2024\", endTime: 1735689600) }"
  }' | jq .

echo ""
echo "📊 Market 2: Ethereum Upgrade"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMarket(question: \"Will Ethereum complete full PoS transition in 2024?\", outcomes: [\"Yes\", \"No\"], description: \"Will Ethereum finish its transition to proof-of-stake by EOY 2024?\", endTime: 1735689600) }"
  }' | jq .

echo ""
echo "📊 Market 3: AI Milestone"
curl -s -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMarket(question: \"Will GPT-5 be released in 2024?\", outcomes: [\"Yes\", \"No\", \"Maybe\"], description: \"Will OpenAI release GPT-5 or equivalent model before December 31, 2024?\", endTime: 1735689600) }"
  }' | jq .

echo ""
echo "ℹ️  Note: To execute these operations, you need to submit them via the linera service."
echo "ℹ️  In a production app, the frontend would handle operation submission automatically."
echo ""
echo "✅ Mutations generated! Check the data field for serialized operations."
echo "🌐 View frontend at: http://localhost:8081/markets"
echo "📊 GraphiQL IDE at: ${GRAPHQL_URL}"
