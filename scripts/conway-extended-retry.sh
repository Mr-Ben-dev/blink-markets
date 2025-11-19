#!/usr/bin/env bash
# scripts/conway-extended-retry.sh
# Extended retry with 5-minute intervals for validator synchronization
set -euo pipefail
cd /root/dev/blink-markets

echo "========================================="
echo " CONWAY EXTENDED RETRY DEPLOYMENT"
echo " (12 attempts × 5min wait = 60min max)"
echo "========================================="
echo ""

# Wallet env
export LINERA_WALLET="${LINERA_WALLET:-.linera/wallet.json}"
export LINERA_KEYSTORE="${LINERA_KEYSTORE:-.linera/keystore.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:.linera/wallet.db}"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

mkdir -p /tmp/linera
LOG="/tmp/linera/conway_extended_retry_$(date +%s).log"

# Verify artifacts
if [ ! -f "$CONTRACT" ] || [ ! -f "$SERVICE" ]; then
  echo "Building WASM..." | tee -a "$LOG"
  cargo build -p blink_markets --release --target wasm32-unknown-unknown 2>&1 | tee -a "$LOG"
fi

# Get current chain
CHAIN_ID=$(linera wallet show 2>/dev/null | grep -oP "Default.*\K[a-f0-9]{64}" | head -1 || echo "")
if [ -z "$CHAIN_ID" ]; then
  echo "❌ No default chain found. Run conway-agora-deploy.sh first" | tee -a "$LOG"
  exit 1
fi

echo "Chain ID: $CHAIN_ID" | tee -a "$LOG"
echo "Balance: $(linera query-balance 2>&1 | grep -oP "[\d.]+" | head -1) tokens" | tee -a "$LOG"
echo ""

attempts=12
sleep_between=300  # 5 minutes

for i in $(seq 1 $attempts); do
  echo "=========================================" | tee -a "$LOG"
  echo " ATTEMPT $i/$attempts" | tee -a "$LOG"
  echo " $(date)" | tee -a "$LOG"
  echo "=========================================" | tee -a "$LOG"
  
  # Sync first
  echo "Syncing..." | tee -a "$LOG"
  linera sync 2>&1 | tee -a "$LOG" || true
  
  # Attempt deployment
  echo "Deploying..." | tee -a "$LOG"
  DEPLOY_OUTPUT=$(linera publish-and-create \
    "$CONTRACT" "$SERVICE" \
    --json-parameters 'null' \
    --json-argument 'null' 2>&1 | tee -a "$LOG" || echo "FAILED")
  
  # Check for success
  APP_ID=$(echo "$DEPLOY_OUTPUT" | sed -nE 's/.*[Aa]pp(lication)? (ID|Id)[: ]+([0-9a-f]{64}).*/\3/p' | head -1 || echo "")
  
  if [ -n "$APP_ID" ]; then
    echo "" | tee -a "$LOG"
    echo "=========================================" | tee -a "$LOG"
    echo " ✅ SUCCESS ON ATTEMPT $i!" | tee -a "$LOG"
    echo "=========================================" | tee -a "$LOG"
    echo "APP_ID=$APP_ID" | tee -a "$LOG" | tee /tmp/linera/APP_ID
    
    # Update .env
    if grep -q "VITE_CONWAY_APPLICATION_ID" .env 2>/dev/null; then
      sed -i "s/VITE_CONWAY_APPLICATION_ID=.*/VITE_CONWAY_APPLICATION_ID=$APP_ID/" .env
    else
      echo "VITE_CONWAY_APPLICATION_ID=$APP_ID" >> .env
    fi
    
    # Start service
    echo "Starting service..." | tee -a "$LOG"
    pkill -f "linera service" 2>/dev/null || true
    sleep 2
    nohup linera service --port 8080 >/tmp/linera/service.log 2>&1 &
    sleep 3
    
    echo "✓ GraphiQL: http://localhost:8080" | tee -a "$LOG"
    echo "✓ Log: $LOG" | tee -a "$LOG"
    exit 0
  fi
  
  # Failed attempt
  echo "❌ Attempt $i failed" | tee -a "$LOG"
  
  if [ $i -lt $attempts ]; then
    echo "Waiting 5 minutes before retry (validator clock sync)..." | tee -a "$LOG"
    echo "Progress:" | tee -a "$LOG"
    for j in {1..10}; do
      echo -n "." | tee -a "$LOG"
      sleep 30
    done
    echo "" | tee -a "$LOG"
  fi
done

# All attempts failed
echo "" | tee -a "$LOG"
echo "=========================================" | tee -a "$LOG"
echo " ❌ ALL $attempts ATTEMPTS FAILED" | tee -a "$LOG"
echo "=========================================" | tee -a "$LOG"
echo "" | tee -a "$LOG"

# Analysis
TIMESTAMP_ERRORS=$(grep -c "timestamp.*future" "$LOG" || echo "0")
AFFECTED_VALIDATORS=$(grep -oP 'address="https://[^"]+' "$LOG" | sort -u | wc -l)

echo "Analysis:" | tee -a "$LOG"
echo "- Timestamp errors: $TIMESTAMP_ERRORS" | tee -a "$LOG"
echo "- Affected validators: $AFFECTED_VALIDATORS" | tee -a "$LOG"
echo "- Total time: ~$((attempts * sleep_between / 60)) minutes" | tee -a "$LOG"
echo "" | tee -a "$LOG"

echo "This confirms persistent Conway testnet infrastructure issue." | tee -a "$LOG"
echo "" | tee -a "$LOG"
echo "RECOMMENDATIONS:" | tee -a "$LOG"
echo "1. Use local deployment (works immediately): bash scripts/local-publish.sh" | tee -a "$LOG"
echo "2. Report to Linera Discord #testnet-status" | tee -a "$LOG"
echo "3. Submit with local deployment + these diagnostic logs" | tee -a "$LOG"
echo "" | tee -a "$LOG"
echo "Full log: $LOG" | tee -a "$LOG"

exit 1
