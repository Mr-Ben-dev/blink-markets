#!/bin/bash
# Conway Testnet Diagnostic Deployment Script
# Captures detailed logs for Linera team troubleshooting

set -euo pipefail
cd "$(dirname "$0")/.."

export LINERA_WALLET=".linera/wallet.json"
export LINERA_KEYSTORE=".linera/keystore.json"
export LINERA_STORAGE="rocksdb:.linera/wallet.db"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

log="/tmp/conway_diagnostic_$(date +%s).log"
attempts=8
sleep_between=45

echo "=========================================" | tee "$log"
echo " CONWAY TESTNET DIAGNOSTIC DEPLOYMENT" | tee -a "$log"
echo "=========================================" | tee -a "$log"
echo "" | tee -a "$log"

# Capture environment
echo "=== ENVIRONMENT ===" | tee -a "$log"
echo "Date (local): $(date)" | tee -a "$log"
echo "Date (UTC): $(date -u)" | tee -a "$log"
echo "Linera version: $(linera --version | head -3)" | tee -a "$log"
echo "Rust version: $(rustc --version)" | tee -a "$log"
echo "" | tee -a "$log"

# Capture wallet state
echo "=== WALLET STATE ===" | tee -a "$log"
linera wallet show 2>&1 | head -30 | tee -a "$log"
echo "" | tee -a "$log"

# Check balance
echo "=== BALANCE ===" | tee -a "$log"
linera query-balance 2>&1 | tee -a "$log"
echo "" | tee -a "$log"

# Get chain ID
CHAIN_ID=$(linera wallet show 2>&1 | grep "DEFAULT" -B1 | head -1 | awk '{print $3}')
echo "Default Chain ID: $CHAIN_ID" | tee -a "$log"
echo "" | tee -a "$log"

# Capture WASM checksums
echo "=== WASM ARTIFACTS ===" | tee -a "$log"
sha256sum "$CONTRACT" 2>&1 | tee -a "$log"
sha256sum "$SERVICE" 2>&1 | tee -a "$log"
ls -lh "$CONTRACT" "$SERVICE" 2>&1 | tee -a "$log"
echo "" | tee -a "$log"

# Query validators
echo "=== VALIDATOR QUERY ===" | tee -a "$log"
timeout 10 linera query-validators 2>&1 | head -20 | tee -a "$log" || echo "Query timeout" | tee -a "$log"
echo "" | tee -a "$log"

# Attempt deployment with retries
for i in $(seq 1 $attempts); do
  echo "=========================================" | tee -a "$log"
  echo " ATTEMPT $i/$attempts" | tee -a "$log"
  echo "=========================================" | tee -a "$log"
  
  # Sync before attempt
  echo "[$(date -u +%H:%M:%S)] Syncing..." | tee -a "$log"
  timeout 60 linera sync 2>&1 | tee -a "$log" || echo "Sync timeout or error" | tee -a "$log"
  
  # Check if there's a pending proposal
  if linera wallet show 2>&1 | grep -q "Pending proposal:.*present"; then
    echo "[$(date -u +%H:%M:%S)] Pending proposal detected, retrying..." | tee -a "$log"
    timeout 60 linera retry-pending-block 2>&1 | tee -a "$log" || echo "Retry timeout" | tee -a "$log"
  fi
  
  # Attempt deployment
  echo "[$(date -u +%H:%M:%S)] Starting publish-and-create..." | tee -a "$log"
  if timeout 240 linera publish-and-create \
      "$CONTRACT" "$SERVICE" \
      --json-parameters 'null' \
      --json-argument 'null' 2>&1 | tee -a "$log"; then
    
    echo "" | tee -a "$log"
    echo "=========================================" | tee -a "$log"
    echo " ✅ SUCCESS ON ATTEMPT $i" | tee -a "$log"
    echo "=========================================" | tee -a "$log"
    
    # Extract application ID
    APP_ID=$(grep -oP 'Application published successfully' -A5 "$log" | grep -oE '[a-f0-9]{64}' | tail -1 || echo "")
    
    if [ -n "$APP_ID" ]; then
      echo "Application ID: $APP_ID" | tee -a "$log"
      echo "Chain ID: $CHAIN_ID" | tee -a "$log"
      
      # Update .env
      sed -i "s/^VITE_CHAIN_ID=.*/VITE_CHAIN_ID=$CHAIN_ID/" .env 2>/dev/null || true
      sed -i "s/^VITE_APPLICATION_ID=.*/VITE_APPLICATION_ID=$APP_ID/" .env 2>/dev/null || true
      sed -i "s/^VITE_CONWAY_APPLICATION_ID=.*/VITE_CONWAY_APPLICATION_ID=$APP_ID/" .env 2>/dev/null || true
      
      echo "✅ .env updated!" | tee -a "$log"
    fi
    
    echo "" | tee -a "$log"
    echo "Full log saved to: $log" | tee -a "$log"
    exit 0
  fi
  
  # Deployment failed
  echo "" | tee -a "$log"
  echo "❌ Attempt $i failed" | tee -a "$log"
  
  # Capture specific error patterns
  echo "" | tee -a "$log"
  echo "=== ERROR ANALYSIS (Attempt $i) ===" | tee -a "$log"
  grep -i "timestamp.*future\|worker error\|failed to communicate" "$log" | tail -10 | tee -a "$log" || true
  
  if [ $i -lt $attempts ]; then
    echo "[$(date -u +%H:%M:%S)] Sleeping ${sleep_between}s before retry..." | tee -a "$log"
    sleep "$sleep_between"
  fi
done

# All attempts failed - generate diagnostic report
echo "" | tee -a "$log"
echo "=========================================" | tee -a "$log"
echo " ❌ ALL ATTEMPTS FAILED" | tee -a "$log"
echo "=========================================" | tee -a "$log"
echo "" | tee -a "$log"

echo "=== DIAGNOSTIC SUMMARY ===" | tee -a "$log"
echo "" | tee -a "$log"

echo "Timestamp Errors:" | tee -a "$log"
grep -c "timestamp.*future" "$log" | tee -a "$log" || echo "0" | tee -a "$log"
echo "" | tee -a "$log"

echo "Affected Validators:" | tee -a "$log"
grep "timestamp.*future" "$log" | grep -oP 'address="[^"]+' | sort -u | tee -a "$log" || true
echo "" | tee -a "$log"

echo "Blob Errors:" | tee -a "$log"
grep -c "Blobs not found" "$log" | tee -a "$log" || echo "0" | tee -a "$log"
echo "" | tee -a "$log"

echo "Module Publish Status:" | tee -a "$log"
grep "Module published" "$log" | tee -a "$log" || echo "No successful module publish detected" | tee -a "$log"
echo "" | tee -a "$log"

echo "Blocks Committed:" | tee -a "$log"
grep "block was committed" "$log" | tee -a "$log" || echo "No block commits detected" | tee -a "$log"
echo "" | tee -a "$log"

echo "=========================================" | tee -a "$log"
echo "Full diagnostic log: $log" | tee -a "$log"
echo "=========================================" | tee -a "$log"

# Extract key sections for Discord/GitHub report
report="/tmp/conway_issue_report.txt"
cat > "$report" <<EOF
# Conway Testnet Deployment Issue Report

## Environment
- Linera SDK: $(linera --version | head -1)
- Rust: $(rustc --version)
- Date: $(date -u)
- Chain ID: $CHAIN_ID
- Balance: $(linera query-balance 2>&1 | tail -1)

## Issue
Multiple deployment attempts fail with "timestamp in the future" error.

## Evidence
$(grep -c "timestamp.*future" "$log") timestamp errors across $(grep "timestamp.*future" "$log" | grep -oP 'address="[^"]+' | sort -u | wc -l) validators

## Module Publishing
$(grep "Module published" "$log" | tail -1 || echo "Module publishing inconsistent")

## Affected Validators
$(grep "timestamp.*future" "$log" | grep -oP 'address="[^"]+' | sed 's/address="//' | sort -u | head -10)

## Attempted Mitigations
- Fresh chain from faucet
- Multiple sync attempts before each deployment
- Retry with 45s backoff (8 attempts)
- Pending proposal handling

## Logs
Full diagnostic log: $log

EOF

echo "" | tee -a "$log"
echo "Issue report for Linera team: $report" | tee -a "$log"
cat "$report" | tee -a "$log"

exit 1
