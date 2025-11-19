#!/bin/bash
# Deploy to Conway Testnet with intelligent retry logic

set -e
cd "$(dirname "$0")/.."

export LINERA_WALLET=".linera/wallet.json"
export LINERA_KEYSTORE=".linera/keystore.json"
export LINERA_STORAGE="rocksdb:.linera/wallet.db"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

echo "========================================="
echo " CONWAY TESTNET - RETRY DEPLOYMENT"
echo "========================================="

# Sync
echo "Syncing..."
timeout 60 linera sync 2>&1 | tail -5 || echo "Sync timeout"

# Check balance
BALANCE=$(linera query-balance 2>&1 | tail -1)
echo "Balance: $BALANCE"

# Try deployment with retries
MAX_RETRIES=3
for i in $(seq 1 $MAX_RETRIES); do
    echo ""
    echo "Attempt $i/$MAX_RETRIES..."
    
    # Use "null" for unit type InstantiationArgument
    if timeout 180 linera publish-and-create "$CONTRACT" "$SERVICE" --json-argument "null" 2>&1 | tee /tmp/deploy.log; then
        echo "✅ DEPLOYMENT SUCCESSFUL!"
        
        # Extract application ID from the output
        # Look for lines like: "Application <app-id> created on chain <chain-id>"
        APP_ID=$(grep -oP '(?<=Application )[a-f0-9]{64,}' /tmp/deploy.log | head -1)
        CHAIN_ID=$(linera wallet show 2>&1 | grep "DEFAULT" -B1 | head -1 | awk '{print $3}')
        
        if [ -z "$APP_ID" ]; then
            # Fallback: extract from bytecode ID format
            APP_ID=$(grep -oE 'e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65[0-9a-f]{32}' /tmp/deploy.log | head -1)
        fi
        
        echo "Chain ID: $CHAIN_ID"
        echo "App ID: $APP_ID"
        
        if [ -n "$APP_ID" ] && [ "$APP_ID" != "$CHAIN_ID" ]; then
            # Update .env
            sed -i "s/^VITE_CHAIN_ID=.*/VITE_CHAIN_ID=$CHAIN_ID/" .env 2>/dev/null || true
            sed -i "s/^VITE_APPLICATION_ID=.*/VITE_APPLICATION_ID=$APP_ID/" .env 2>/dev/null || true
            
            echo "✅ .env updated!"
            exit 0
        else
            echo "⚠️  Could not extract valid Application ID"
        fi
    fi
    
    echo "❌ Attempt $i failed"
    [ $i -lt $MAX_RETRIES ] && sleep 90
done

echo ""
echo "❌ ALL ATTEMPTS FAILED"
echo "Conway testnet infrastructure issues detected."
echo "See /tmp/deploy.log for details"
exit 1
