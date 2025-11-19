#!/usr/bin/env bash
# scripts/conway-hard-deploy.sh
# Hard-deploy to Conway: publish once, then hammer create until validators' clocks catch up
set -euo pipefail
cd /root/dev/blink-markets

# Wallet env
export LINERA_WALLET="${LINERA_WALLET:-.linera/wallet.json}"
export LINERA_KEYSTORE="${LINERA_KEYSTORE:-.linera/keystore.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:.linera/wallet.db}"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

mkdir -p /tmp/linera
LOG="/tmp/linera/conway_hard_deploy_$(date +%s).log"

# 0) Build (skip if already built)
if [ ! -f "$CONTRACT" ] || [ ! -f "$SERVICE" ]; then
  echo "[build] Building WASM..." | tee -a "$LOG"
  cargo build -p blink_markets --release --target wasm32-unknown-unknown 2>&1 | tee -a "$LOG"
fi

# 1) Ensure wallet/chain works
echo "[preflight] Sync + balance" | tee -a "$LOG"
linera sync 2>&1 | tee -a "$LOG" || true
linera query-balance 2>&1 | tee -a "$LOG" || true

# 2) Publish once (keeps the module even if 'create' later fails)
echo "[publish] publish-and-create (we'll capture module ID if printed)" | tee -a "$LOG"
PUBLISH_OUT="$(linera publish-and-create \
  "$CONTRACT" "$SERVICE" \
  --json-parameters 'null' \
  --json-argument 'null' 2>&1 | tee -a "$LOG" || true)"

# Try to extract either MODULE_ID or APP_ID from the first run
APP_ID="$(echo "$PUBLISH_OUT" | sed -nE 's/.*[Aa]pp(lication)? (ID|Id)[: ]+([0-9a-f]{64}).*/\3/p' | head -1 || true)"
MODULE_ID="$(echo "$PUBLISH_OUT" | sed -nE 's/.*(Module|Bytecode) (ID|Id)[: ]+([0-9a-f]{64}).*/\3/p' | head -1 || true)"

# 3) If app wasn't created, keep trying just the create step by reusing the module.
# If we couldn't parse a module id from output, we'll just rerun publish-and-create each time.
attempts=48         # ~24 minutes worst case
sleep_between=30

i=1
while [ -z "${APP_ID:-}" ] && [ $i -le $attempts ]; do
  echo "[attempt $i/$attempts] retrying create…" | tee -a "$LOG"
  linera sync 2>&1 | tee -a "$LOG" || true

  if [ -n "${MODULE_ID:-}" ]; then
    # Preferred: split flow if CLI supports 'create-application'
    if linera help 2>/dev/null | grep -q "create-application"; then
      TRY_OUT="$(linera create-application "$MODULE_ID" --json-argument 'null' 2>&1 | tee -a "$LOG" || true)"
    else
      # Fallback: re-run publish-and-create (cheap but may mint a new module id)
      TRY_OUT="$(linera publish-and-create "$CONTRACT" "$SERVICE" \
        --json-parameters 'null' --json-argument 'null' 2>&1 | tee -a "$LOG" || true)"
    fi
  else
    TRY_OUT="$(linera publish-and-create "$CONTRACT" "$SERVICE" \
      --json-parameters 'null' --json-argument 'null' 2>&1 | tee -a "$LOG" || true)"
  fi

  APP_ID="$(echo "$TRY_OUT" | sed -nE 's/.*[Aa]pp(lication)? (ID|Id)[: ]+([0-9a-f]{64}).*/\3/p' | head -1 || true)"
  if [ -n "$APP_ID" ]; then break; fi
  echo "…timestamp likely in the future; sleeping ${sleep_between}s" | tee -a "$LOG"
  sleep "$sleep_between"; i=$((i+1))
done

if [ -z "${APP_ID:-}" ]; then
  echo "FAILED to create application after $attempts attempts."
  echo "Log: $LOG"
  exit 1
fi

echo "SUCCESS — APP_ID=$APP_ID"
echo "$APP_ID" > /tmp/linera/APP_ID
echo "Log: $LOG"

# Optional: quick local service for judges
# (they can hit GraphiQL at http://localhost:8080 and see the app)
nohup sh -c "linera service --required-application-ids $APP_ID --port 8080 >/tmp/linera/service.log 2>&1" &
echo "GraphiQL: http://localhost:8080 (running in background)"
