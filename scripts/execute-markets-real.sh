#!/bin/bash
set -e

export LINERA_WALLET="/tmp/.tmpcyDSlC/wallet_0.json"
export LINERA_STORAGE="rocksdb:/tmp/.tmpcyDSlC/client_0.db"

APP_ID="e48d3909d562d5ec69f307d12908762bea6f6d43aa81b35b37438a8717b4528c"
CHAIN_ID="ec77531fa6d42ef1b2726b6c674ea5c99f7d075c5330692c4d3f1758ef25fe9f"

GRAPHQL_URL="http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID"
SYSTEM_URL="http://localhost:8080"

echo "=== Creating Real Markets on Blockchain ==="
echo ""

# Function to create a market and execute it
create_and_execute_market() {
    local question=$1
    local outcomes=$2
    local description=$3
    
    echo "Creating market: $question"
    
    # Step 1: Get serialized operation bytes from mutation
    local mutation_query="mutation { createMarket(question: \"$question\", outcomes: $outcomes, description: \"$description\", endTime: 1735689600) }"
    
    local bytes_result=$(curl -s -X POST "$GRAPHQL_URL" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"$mutation_query\"}")
    
    # Extract the bytes array from JSON
    local bytes=$(echo "$bytes_result" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['createMarket'])")
    
    echo "  Got operation bytes: ${bytes:0:50}..."
    
    # Step 2: Submit the operation bytes to the chain using system API
    echo "  Submitting operation to chain..."
    
    # The executeOperations mutation needs the bytes in the right format
    # Let's try submitting through the chain's operations endpoint
    local exec_result=$(curl -s -X POST "$SYSTEM_URL" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"mutation { chain(chainId: \\\"$CHAIN_ID\\\") { executeOperations(operations: [$bytes], applicationId: \\\"$APP_ID\\\") } }\"}")
    
    echo "  Execution result: $exec_result"
    echo ""
    sleep 2
}

# Create Market 1: Bitcoin
create_and_execute_market \
    "Will Bitcoin reach 100k by December 31, 2025?" \
    "[\\\"Yes\\\", \\\"No\\\"]" \
    "Prediction market on whether BTC will hit 100,000 by end of 2025"

# Create Market 2: Ethereum
create_and_execute_market \
    "Will Ethereum complete The Merge in 2024?" \
    "[\\\"Complete Success\\\", \\\"Partial Success\\\", \\\"Delayed to 2025\\\"]" \
    "Market on Ethereum transition to proof-of-stake"

# Create Market 3: AI
create_and_execute_market \
    "Which AI company will achieve AGI first?" \
    "[\\\"OpenAI\\\", \\\"Google DeepMind\\\", \\\"Anthropic\\\", \\\"Other\\\"]" \
    "Prediction on which company reaches AGI first"

echo "=== Querying Markets from Blockchain ==="
curl -s -X POST "$GRAPHQL_URL" \
    -H "Content-Type: application/json" \
    -d '{"query":"{ markets { id question outcomes totalVolume resolved } }"}' | python3 -m json.tool

echo ""
echo "=== Block Height ==="
curl -s -X POST "$GRAPHQL_URL" \
    -H "Content-Type: application/json" \
    -d '{"query":"{ blockHeight }"}' | python3 -m json.tool
