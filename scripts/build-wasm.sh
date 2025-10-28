#!/usr/bin/env bash
set -euo pipefail

# Get the project root directory
if git rev-parse --show-toplevel >/dev/null 2>&1; then
  cd "$(git rev-parse --show-toplevel)"
else
  # Fallback: assume we're in the project root or find Cargo.toml
  if [[ ! -f "blink_markets/Cargo.toml" ]]; then
    echo "Error: Cannot find blink_markets/Cargo.toml"
    exit 1
  fi
fi

echo "===> Building blink_markets to wasm32-unknown-unknown (release)"
cd blink_markets
cargo build --release --target wasm32-unknown-unknown

echo "===> WASM artifacts:"
ls -lh target/wasm32-unknown-unknown/release | grep blink_markets || true

echo "✅ WASM build complete."