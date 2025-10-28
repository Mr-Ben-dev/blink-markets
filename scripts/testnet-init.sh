#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

: "${LINERA_FAUCET_URL:=https://faucet.testnet-conway.linera.net}"
: "${LINERA_WALLET:=.linera/wallet.json}"
: "${LINERA_KEYSTORE:=.linera/keystore.json}"
: "${LINERA_STORAGE:=rocksdb:.linera/wallet.db}"

mkdir -p .linera

export LINERA_WALLET LINERA_KEYSTORE LINERA_STORAGE

echo "===> Initializing wallet against Testnet faucet: ${LINERA_FAUCET_URL}"
linera wallet init --faucet "${LINERA_FAUCET_URL}"

echo "===> Requesting chain from faucet"
linera wallet request-chain --faucet "${LINERA_FAUCET_URL}"

echo "===> Wallet info"
linera wallet show

echo "===> Sync + balance"
linera sync
linera query-balance || true

echo "✅ Testnet wallet and chain ready."