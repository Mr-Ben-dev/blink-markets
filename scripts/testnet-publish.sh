#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

: "${LINERA_FAUCET_URL:=https://faucet.testnet-conway.linera.net}"
: "${LINERA_WALLET:=.linera/wallet.json}"
: "${LINERA_KEYSTORE:=.linera/keystore.json}"
: "${LINERA_STORAGE:=rocksdb:.linera/wallet.db}"

export LINERA_WALLET LINERA_KEYSTORE LINERA_STORAGE

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

if [[ ! -f "$CONTRACT" || ! -f "$SERVICE" ]]; then
    echo "❌ WASM artifacts not found. Run: npm run wasm:build"
    exit 1
fi

# Detect init args; if contract requires them, set INIT_JSON or default to empty.
# Based on contract.rs: InstantiationArgument = (), so we use null
INIT_JSON="${INIT_JSON:-null}"

echo "===> Publishing and creating application on Testnet"
echo "Using init argument: ${INIT_JSON}"
set -x
linera publish-and-create "$CONTRACT" "$SERVICE" --json-argument "${INIT_JSON}"
set +x

echo ""
echo "===> ⚠️  IMPORTANT: Copy the Application ID from above and save it!"
echo "You can save it to .linera/app_id for reference:"
echo "echo 'APPLICATION_ID_HERE' > .linera/app_id"
echo ""
echo "✅ Publish step executed."