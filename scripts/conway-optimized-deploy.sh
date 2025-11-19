#!/usr/bin/env bash
# scripts/conway-optimized-deploy.sh
# Optimized Conway deployment: fresh chain + validator sync wait
set -euo pipefail
cd /root/dev/blink-markets

echo "========================================="
echo " CONWAY OPTIMIZED DEPLOYMENT"
echo "========================================="
echo ""

# Wallet env
export LINERA_WALLET="${LINERA_WALLET:-.linera/wallet.json}"
export LINERA_KEYSTORE="${LINERA_KEYSTORE:-.linera/keystore.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:.linera/wallet.db}"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

mkdir -p /tmp/linera
LOG="/tmp/linera/conway_agora_deploy_$(date +%s).log"

echo "[1/7] Verifying WASM artifacts..." | tee -a "$LOG"
if [ ! -f "$CONTRACT" ] || [ ! -f "$SERVICE" ]; then
  echo "Building WASM..." | tee -a "$LOG"
  cargo build -p blink_markets --release --target wasm32-unknown-unknown 2>&1 | tee -a "$LOG"
fi
echo "✓ WASM artifacts ready" | tee -a "$LOG"
echo ""

echo "[2/7] Checking current wallet status..." | tee -a "$LOG"
linera wallet show 2>&1 | head -20 | tee -a "$LOG"
echo ""

echo "[3/7] Requesting FRESH chain from faucet..." | tee -a "$LOG"
echo "This ensures better timestamp alignment with validators" | tee -a "$LOG"
FRESH_CHAIN_OUTPUT=$(linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net 2>&1 | tee -a "$LOG")

# Extract new chain ID - look for the actual chain ID in the output
NEW_CHAIN_ID=$(echo "$FRESH_CHAIN_OUTPUT" | grep -oP "Chain ID.*?\K[a-f0-9]{64}" | tail -1 || echo "")
if [ -z "$NEW_CHAIN_ID" ]; then
  # Alternative: check wallet for most recent chain
  echo "Extracting chain ID from wallet..." | tee -a "$LOG"
  NEW_CHAIN_ID=$(linera wallet show 2>&1 | grep "Chain ID:" | tail -1 | grep -oP "[a-f0-9]{64}" || echo "")
fi
if [ -z "$NEW_CHAIN_ID" ]; then
  echo "❌ Failed to get fresh chain ID" | tee -a "$LOG"
  exit 1
fi
echo "✓ Fresh chain obtained: $NEW_CHAIN_ID" | tee -a "$LOG"
echo ""

echo "[4/7] Setting fresh chain as default..." | tee -a "$LOG"
linera wallet set-default "$NEW_CHAIN_ID" 2>&1 | tee -a "$LOG"
echo "✓ Default chain set" | tee -a "$LOG"
echo ""

echo "[5/7] Verifying balance..." | tee -a "$LOG"
BALANCE=$(linera query-balance 2>&1 | tee -a "$LOG")
echo "$BALANCE"
echo ""

echo "[6/7] CRITICAL: Waiting 5 minutes for validator clock synchronization..." | tee -a "$LOG"
echo "This wait period allows validators to synchronize their clocks" | tee -a "$LOG"
echo "Start time: $(date)" | tee -a "$LOG"

# Progress indicator for 5 minutes (300 seconds)
for i in {1..10}; do
  echo -n "." | tee -a "$LOG"
  sleep 30
done
echo "" | tee -a "$LOG"
echo "✓ 5-minute wait complete at $(date)" | tee -a "$LOG"
echo ""

echo "[7/7] Deploying to Conway with sync..." | tee -a "$LOG"
linera sync 2>&1 | tee -a "$LOG" || true

echo "Starting publish-and-create..." | tee -a "$LOG"
DEPLOY_OUTPUT=$(linera publish-and-create \
  "$CONTRACT" "$SERVICE" \
  --json-parameters 'null' \
  --json-argument 'null' 2>&1 | tee -a "$LOG" || echo "DEPLOYMENT_FAILED")

# Check for success
if echo "$DEPLOY_OUTPUT" | grep -qE "(Application|App) (ID|Id)"; then
  APP_ID=$(echo "$DEPLOY_OUTPUT" | sed -nE 's/.*[Aa]pp(lication)? (ID|Id)[: ]+([0-9a-f]{64}).*/\3/p' | head -1)
  
  if [ -n "$APP_ID" ]; then
    echo ""
    echo "========================================="
    echo " ✅ SUCCESS!"
    echo "========================================="
    echo "APP_ID=$APP_ID" | tee /tmp/linera/APP_ID
    echo ""
    
    # Update .env
    if grep -q "VITE_CONWAY_APPLICATION_ID" .env 2>/dev/null; then
      sed -i "s/VITE_CONWAY_APPLICATION_ID=.*/VITE_CONWAY_APPLICATION_ID=$APP_ID/" .env
    else
      echo "VITE_CONWAY_APPLICATION_ID=$APP_ID" >> .env
    fi
    
    # Start service
    echo "Starting GraphiQL service at http://localhost:8080..." | tee -a "$LOG"
    pkill -f "linera service" 2>/dev/null || true
    sleep 2
    nohup linera service --port 8080 >/tmp/linera/service.log 2>&1 &
    sleep 3
    
    echo "✓ Service started"
    echo "✓ GraphiQL: http://localhost:8080"
    echo "✓ Log: $LOG"
    echo ""
    exit 0
  fi
fi

# If we get here, deployment failed
echo ""
echo "========================================="
echo " ⚠️  DEPLOYMENT FAILED"
echo "========================================="
echo ""
echo "Analyzing errors..." | tee -a "$LOG"

# Count timestamp errors
TIMESTAMP_ERRORS=$(grep -c "timestamp.*future" "$LOG" || echo "0")
echo "Timestamp errors: $TIMESTAMP_ERRORS" | tee -a "$LOG"

if [ "$TIMESTAMP_ERRORS" -gt 0 ]; then
  echo ""
  echo "RECOMMENDATION: Try extended retry strategy"
  echo "Run: bash scripts/conway-extended-retry.sh"
  echo ""
  echo "This is the known Conway validator clock drift issue."
  echo "Options:"
  echo "1. Wait 10-15 minutes and run this script again"
  echo "2. Use extended retry script (12 attempts x 5min = 60min total)"
  echo "3. Use local deployment for demo (works immediately)"
fi

echo ""
echo "Full log: $LOG"
exit 1
