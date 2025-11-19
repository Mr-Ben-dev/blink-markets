#!/bin/bash
set -e

echo "🚀 Blink Markets Wave 2 - Conway Testnet Deployment"
echo "===================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FAUCET_URL="https://faucet.testnet-conway.linera.net"

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v linera >/dev/null 2>&1 || { echo -e "${RED}❌ linera CLI not found${NC}"; exit 1; }

LINERA_VERSION=$(linera --version | grep "Linera protocol" | awk '{print $3}')
echo -e "${GREEN}✓${NC} Linera SDK version: ${LINERA_VERSION}"

if [ "${LINERA_VERSION}" != "v0.15.6" ]; then
    echo -e "${YELLOW}⚠${NC}  Warning: SDK version ${LINERA_VERSION} may not match Conway Testnet"
fi

# Build WASM binaries
echo -e "\n${BLUE}Building WASM binaries...${NC}"
cd blink_markets
cargo build --release --target wasm32-unknown-unknown
echo -e "${GREEN}✓${NC} WASM binaries built"

# Setup Conway wallet
echo -e "\n${BLUE}Setting up Conway Testnet wallet...${NC}"
export LINERA_WALLET="${PWD}/.linera-conway/wallet.json"
export LINERA_KEYSTORE="${PWD}/.linera-conway/keystore.json"
export LINERA_STORAGE="rocksdb:${PWD}/.linera-conway/wallet.db"

mkdir -p .linera-conway

# Initialize wallet from faucet
echo -e "${BLUE}Requesting chain from faucet...${NC}"
linera wallet init --faucet ${FAUCET_URL} || {
    echo -e "${YELLOW}⚠${NC}  Wallet may already exist"
}

linera wallet request-chain --faucet ${FAUCET_URL} || {
    echo -e "${YELLOW}⚠${NC}  Chain request may have failed, trying to continue..."
}

# Show wallet info
echo -e "\n${BLUE}Wallet information:${NC}"
linera wallet show

# Get chain ID
CHAIN_ID=$(linera wallet show | grep -v "Public Key" | grep -oP '^[a-f0-9]{64}' | head -1)
echo -e "Default Chain ID: ${GREEN}${CHAIN_ID}${NC}"

# Deploy application
echo -e "\n${BLUE}Deploying to Conway Testnet...${NC}"
APP_OUTPUT=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/blink_markets_{contract,service}.wasm \
    --json-argument '{}' \
    --required-application-ids 2>&1)

echo "${APP_OUTPUT}"

# Extract Application ID
APP_ID=$(echo "${APP_OUTPUT}" | grep -oP 'Application ID: \K[a-f0-9]+' | head -1)

if [ -z "${APP_ID}" ]; then
    echo -e "${RED}❌ Failed to extract Application ID${NC}"
    echo "Raw output:"
    echo "${APP_OUTPUT}"
    exit 1
fi

echo -e "\n${GREEN}✅ Conway Testnet Deployment Successful!${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Network: ${BLUE}Conway Testnet${NC}"
echo -e "Chain ID: ${GREEN}${CHAIN_ID}${NC}"
echo -e "App ID: ${GREEN}${APP_ID}${NC}"
echo -e "SDK Version: ${LINERA_VERSION}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Save deployment proof
mkdir -p ../wave2
cat > ../wave2/CONWAY_DEPLOYMENT.json <<EOF
{
  "network": "Conway Testnet",
  "faucet": "${FAUCET_URL}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "chain_id": "${CHAIN_ID}",
  "app_id": "${APP_ID}",
  "sdk_version": "${LINERA_VERSION}",
  "contract_wasm": "target/wasm32-unknown-unknown/release/blink_markets_contract.wasm",
  "service_wasm": "target/wasm32-unknown-unknown/release/blink_markets_service.wasm"
}
EOF

# Generate verification commands
cat > ../wave2/VERIFICATION_COMMANDS.sh <<EOF
#!/bin/bash
# Verification commands for judges

echo "Verifying Blink Markets deployment on Conway Testnet"
echo "======================================================"

# Show wallet
linera wallet show

# Query chain balance
linera query-balance --chain ${CHAIN_ID}

# Start service and access GraphiQL
echo ""
echo "To test the application:"
echo "1. Run: linera service --port 8080"
echo "2. Open: http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}"
echo ""
echo "GraphQL Query Examples:"
echo ""
echo "query { markets { id question outcomes } }"
echo "query { applicationId chainId }"
echo ""
echo "Mutation Example:"
echo "mutation { createMarket(question: \\"BTC > 100k?\\" outcomes: [\\"Yes\\", \\"No\\"] description: \\"Bitcoin price prediction\\" endTime: $(date -d '+7 days' +%s)) }"
EOF

chmod +x ../wave2/VERIFICATION_COMMANDS.sh

echo -e "\n${GREEN}Deployment documentation created:${NC}"
echo -e "  • wave2/CONWAY_DEPLOYMENT.json"
echo -e "  • wave2/VERIFICATION_COMMANDS.sh"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Run: ${GREEN}linera service --port 8080${NC}"
echo -e "2. Open GraphiQL: ${GREEN}http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}${NC}"
echo -e "3. Test mutations and queries"
echo -e "4. Record demo video showing on-chain execution"
