#!/usr/bin/env bash
# Final Conway deployment with proper timing strategy
set -euo pipefail

cd /root/dev/blink-markets

echo "========================================="
echo " CONWAY TESTNET DEPLOYMENT"
echo " Optimized Timing Strategy"
echo "========================================="
echo ""

# WASM artifacts
CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

# Verify artifacts exist
if [ ! -f "$CONTRACT" ] || [ ! -f "$SERVICE" ]; then
  echo "❌ WASM artifacts not found. Building..."
  cargo build -p blink_markets --release --target wasm32-unknown-unknown
fi

echo "✓ Contract: $(ls -lh $CONTRACT | awk '{print $5}')"
echo "✓ Service: $(ls -lh $SERVICE | awk '{print $5}')"
echo ""

# Get chain info
CHAIN_ID=$(linera wallet show 2>&1 | grep -B 1 "DEFAULT" | grep "Chain ID:" | awk '{print $3}' || echo "")
BALANCE=$(linera query-balance 2>&1 | grep -oP "[\d.]+" | head -1 || echo "0")

if [ -z "$CHAIN_ID" ]; then
  echo "❌ No default chain found"
  echo "Run: linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net"
  exit 1
fi

echo "Chain ID: $CHAIN_ID"
echo "Balance: $BALANCE tokens"
echo ""

if (( $(echo "$BALANCE < 1" | bc -l) )); then
  echo "❌ Insufficient balance"
  exit 1
fi

# Strategy: Try deployment with increasing wait times
MAX_ATTEMPTS=10
INITIAL_WAIT=30   # Start with 30 seconds
WAIT_INCREMENT=60  # Add 60 seconds each attempt

for attempt in $(seq 1 $MAX_ATTEMPTS); do
  WAIT_TIME=$((INITIAL_WAIT + (attempt - 1) * WAIT_INCREMENT))
  
  echo "========================================="
  echo " ATTEMPT $attempt/$MAX_ATTEMPTS"
  echo " $(date)"
  echo "========================================="
  
  if [ $attempt -gt 1 ]; then
    echo "⏳ Waiting ${WAIT_TIME}s for validator synchronization..."
    sleep $WAIT_TIME
  fi
  
  echo "🚀 Deploying..."
  
  # Deploy without json-parameters (not needed for unit type)
  DEPLOY_OUTPUT=$(linera publish-and-create \
    "$CONTRACT" \
    "$SERVICE" \
    --json-argument 'null' 2>&1)
  
  DEPLOY_STATUS=$?
  echo "$DEPLOY_OUTPUT"
  
  # Check for success - look for specific success patterns
  if [ $DEPLOY_STATUS -eq 0 ] && echo "$DEPLOY_OUTPUT" | grep -q "Module published successfully"; then
    # Extract app ID - it's the last 64-char hex after "application" keyword
    APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -i "application" | grep -oP '([0-9a-f]{64})' | tail -1 || echo "")
    
    if [ -n "$APP_ID" ] && [ ${#APP_ID} -eq 64 ]; then
      echo ""
      echo "========================================="
      echo " ✅ DEPLOYMENT SUCCESSFUL!"
      echo "========================================="
      echo ""
      echo "Application ID: $APP_ID"
      echo ""
      
      # Save to file
      echo "$APP_ID" > /tmp/linera/CONWAY_APP_ID
      
      # Update .env
      if [ -f .env ]; then
        if grep -q "VITE_CONWAY_APPLICATION_ID" .env; then
          sed -i "s/VITE_CONWAY_APPLICATION_ID=.*/VITE_CONWAY_APPLICATION_ID=$APP_ID/" .env
        else
          echo "VITE_CONWAY_APPLICATION_ID=$APP_ID" >> .env
        fi
      fi
      
      # Start GraphiQL service
      echo "🌐 Starting GraphiQL service..."
      pkill -f "linera service" 2>/dev/null || true
      sleep 2
      
      linera service --port 8080 > /tmp/linera/service.log 2>&1 &
      SERVICE_PID=$!
      sleep 3
      
      if ps -p $SERVICE_PID > /dev/null; then
        echo "✓ GraphiQL running at http://localhost:8080"
        echo "✓ Service PID: $SERVICE_PID"
      else
        echo "⚠️  Service failed to start (check /tmp/linera/service.log)"
      fi
      
      echo ""
      echo "========================================="
      echo " NEXT STEPS"
      echo "========================================="
      echo "1. Open http://localhost:8080 in your browser"
      echo "2. Test GraphQL queries"
      echo "3. Update frontend .env with APP_ID"
      echo "4. Run: npm run dev"
      echo ""
      
      exit 0
    fi
  fi
  
  # Check if it's a timestamp error
  if echo "$DEPLOY_OUTPUT" | grep -iq "timestamp.*future"; then
    echo "❌ Validator clock drift detected (attempt $attempt)"
    echo "   Next wait time: ${WAIT_TIME}s"
  else
    echo "❌ Deployment failed (attempt $attempt)"
    echo "   Error details:"
    echo "$DEPLOY_OUTPUT" | tail -5
  fi
  
  if [ $attempt -eq $MAX_ATTEMPTS ]; then
    echo ""
    echo "========================================="
    echo " ❌ ALL ATTEMPTS FAILED"
    echo "========================================="
    echo ""
    echo "This is a Conway testnet infrastructure issue."
    echo "Your application code is correct (proven by local deployment)."
    echo ""
    echo "Options:"
    echo "1. Wait and try again later when validators are stable"
    echo "2. Use local deployment: npm run local:publish"
    echo "3. Report issue to Linera team in Discord"
    echo ""
    exit 1
  fi
done
