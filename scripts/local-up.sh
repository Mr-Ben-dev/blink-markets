#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

mkdir -p .linera

export LINERA_WALLET="${LINERA_WALLET:-.linera/wallet.json}"
export LINERA_KEYSTORE="${LINERA_KEYSTORE:-.linera/keystore.json}"
export LINERA_STORAGE="${LINERA_STORAGE:-rocksdb:.linera/wallet.db}"

echo "===> Starting local Linera net with faucet on :8080"
linera net up --with-faucet --faucet-port 8080 &
NET_PID=$!

sleep 3

echo "===> Init local wallet + chain against faucet http://localhost:8080"
linera wallet init --faucet http://localhost:8080
linera wallet request-chain --faucet http://localhost:8080

echo "===> Sync and check balance"
linera sync
linera query-balance || true

echo ""
echo "Local net PID: $NET_PID"
echo "✅ Local net ready. To stop: pkill -f 'linera net up' || kill $NET_PID"