#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

export LINERA_WALLET="${LINERA_WALLET:-.linera/wallet.json}"
export LINERA_KEYSTORE="${LINERA_KEYSTORE:-.linera/keystore.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:.linera/wallet.db}"

CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"

[[ -f "$CONTRACT" && -f "$SERVICE" ]] || { 
    echo "❌ WASM artifacts not found. Run: npm run wasm:build"
    exit 1
}

# Based on contract.rs: InstantiationArgument = u64
INIT_JSON="${INIT_JSON:-42}"

echo "===> Publishing and creating application on local devnet"
echo "Using init argument: ${INIT_JSON}"
set -x
linera publish-and-create "$CONTRACT" "$SERVICE" --json-argument "${INIT_JSON}"
set +x

echo ""
echo "===> ⚠️  IMPORTANT: Copy the Application ID from above and save it!"
echo "You can save it to .linera/app_id for reference:"
echo "echo 'APPLICATION_ID_HERE' > .linera/app_id"
echo ""
echo "✅ Local publish executed."