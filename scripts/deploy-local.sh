#!/bin/bash
set -e

echo "🚀 Blink Markets Wave 2 - Local Deployment Script"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v linera >/dev/null 2>&1 || { echo "❌ linera CLI not found. Please install Linera SDK 0.15.6"; exit 1; }
command -v cargo >/dev/null 2>&1 || { echo "❌ cargo not found. Please install Rust"; exit 1; }

# Verify Linera version
LINERA_VERSION=$(linera --version | grep "Linera protocol" | awk '{print $3}')
echo -e "${GREEN}✓${NC} Linera SDK version: ${LINERA_VERSION}"

# Build WASM binaries
echo -e "\n${BLUE}Building WASM binaries...${NC}"
cd blink_markets
cargo build --release --target wasm32-unknown-unknown
echo -e "${GREEN}✓${NC} WASM binaries built successfully"

# Start local network (if not already running)
echo -e "\n${BLUE}Setting up local Linera network...${NC}"
linera net up --testing-prng-seed 37 || {
    echo -e "${YELLOW}⚠${NC}  Local network may already be running"
}

# Initialize wallet
echo -e "\n${BLUE}Initializing wallet...${NC}"
export LINERA_WALLET="${PWD}/.linera/wallet.json"
export LINERA_STORAGE="rocksdb:${PWD}/.linera/wallet.db"

linera wallet init --with-new-chain || {
    echo -e "${YELLOW}⚠${NC}  Wallet may already exist"
}

# Deploy application
echo -e "\n${BLUE}Deploying Blink Markets application...${NC}"
APP_OUTPUT=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/blink_markets_{contract,service}.wasm \
    --json-argument 'null' 2>&1)

echo "${APP_OUTPUT}"

# Extract Application ID and Chain ID
APP_ID=$(echo "${APP_OUTPUT}" | grep -oP 'Application ID: \K[a-f0-9]+' | head -1)
CHAIN_ID=$(linera wallet show | grep -v "Public Key" | grep -oP '^[a-f0-9]{64}' | head -1)

echo -e "\n${GREEN}✅ Deployment successful!${NC}"
echo -e "Chain ID: ${CHAIN_ID}"
echo -e "App ID: ${APP_ID}"

# Save deployment info
mkdir -p ../deployment
cat > ../deployment/local_deployment.json <<EOF
{
  "network": "local",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "chain_id": "${CHAIN_ID}",
  "app_id": "${APP_ID}",
  "sdk_version": "${LINERA_VERSION}"
}
EOF

echo -e "\n${BLUE}Starting node service...${NC}"
echo -e "Run: ${GREEN}linera service --port 8080${NC}"
echo -e "GraphiQL IDE: ${GREEN}http://localhost:8080${NC}"
echo -e "Application GraphQL: ${GREEN}http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}${NC}"
echo -e "\n${GREEN}Deployment info saved to: deployment/local_deployment.json${NC}"
