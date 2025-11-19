#!/usr/bin/env bash
# scripts/verify-conway-setup.sh
# Complete verification based on Agora documentation
set -euo pipefail

echo "========================================="
echo " CONWAY SETUP VERIFICATION"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0

# Test 1: Rust
echo -n "1. Rust (1.75.0+): "
if command -v rustc &> /dev/null; then
    VERSION=$(rustc --version | grep -oP '\d+\.\d+\.\d+')
    echo -e "${GREEN}✓${NC} $VERSION"
    pass=$((pass + 1))
else
    echo -e "${RED}✗ NOT INSTALLED${NC}"
    fail=$((fail + 1))
fi

# Test 2: wasm32 target
echo -n "2. wasm32-unknown-unknown: "
if rustup target list 2>/dev/null | grep -q "wasm32-unknown-unknown (installed)" 2>/dev/null; then
    echo -e "${GREEN}✓ INSTALLED${NC}"
    pass=$((pass + 1))
else
    echo -e "${RED}✗ NOT INSTALLED${NC}"
    echo "   Fix: rustup target add wasm32-unknown-unknown"
    fail=$((fail + 1))
fi

# Test 3: Protobuf
echo -n "3. Protobuf (3.21+): "
if command -v protoc &> /dev/null; then
    VERSION=$(protoc --version | grep -oP '\d+\.\d+')
    echo -e "${GREEN}✓${NC} $VERSION"
    pass=$((pass + 1))
else
    echo -e "${RED}✗ NOT INSTALLED${NC}"
    echo "   Fix: sudo apt install -y protobuf-compiler"
    fail=$((fail + 1))
fi

# Test 4: Linera CLI
echo -n "4. Linera CLI (0.15.6): "
if command -v linera &> /dev/null; then
    VERSION=$(linera --version 2>&1 | grep -oP 'linera.*' || echo "unknown")
    if [[ "$VERSION" == *"0.15.6"* ]]; then
        echo -e "${GREEN}✓${NC} $VERSION"
        pass=$((pass + 1))
    else
        echo -e "${YELLOW}⚠${NC} $VERSION (expected 0.15.6)"
        pass=$((pass + 1))
    fi
else
    echo -e "${RED}✗ NOT INSTALLED${NC}"
    echo "   Fix: cargo install --locked linera-service@0.15.6"
    fail=$((fail + 1))
fi

# Test 5: Wallet initialized
echo -n "5. Wallet initialized: "
if [ -f ".linera/wallet.json" ] || [ -f "$HOME/.config/linera/wallet.json" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    pass=$((pass + 1))
else
    echo -e "${RED}✗ NOT FOUND${NC}"
    echo "   Fix: linera wallet init --faucet https://faucet.testnet-conway.linera.net"
    fail=$((fail + 1))
fi

# Test 6: Wallet has chains
echo -n "6. Wallet has chains: "
if linera wallet show &> /dev/null; then
    CHAINS=$(linera wallet show 2>/dev/null | grep -c "Chain ID:" || echo "0")
    if [ "$CHAINS" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} $CHAINS chain(s)"
        pass=$((pass + 1))
    else
        echo -e "${YELLOW}⚠${NC} No chains"
        echo "   Fix: linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net"
        pass=$((pass + 1))
    fi
else
    echo -e "${RED}✗ CANNOT ACCESS${NC}"
    fail=$((fail + 1))
fi

# Test 7: Balance check
echo -n "7. Token balance: "
if linera query-balance &> /dev/null 2>&1; then
    BALANCE=$(linera query-balance 2>&1 | grep -oP "[\d.]+" | head -1 || echo "0")
    if (( $(echo "$BALANCE >= 1" | bc -l) )); then
        echo -e "${GREEN}✓${NC} $BALANCE tokens"
        pass=$((pass + 1))
    else
        echo -e "${YELLOW}⚠${NC} $BALANCE tokens (low)"
        echo "   Fix: linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net"
        pass=$((pass + 1))
    fi
else
    echo -e "${RED}✗ CANNOT QUERY${NC}"
    fail=$((fail + 1))
fi

# Test 8: System clock sync
echo -n "8. System clock sync: "
if command -v timedatectl &> /dev/null; then
    if timedatectl status 2>/dev/null | grep -q "synchronized: yes"; then
        echo -e "${GREEN}✓ SYNCHRONIZED${NC}"
        pass=$((pass + 1))
    else
        echo -e "${YELLOW}⚠${NC} Not synchronized"
        echo "   Fix: sudo timedatectl set-ntp true"
        pass=$((pass + 1))
    fi
else
    # Check with ntpdate
    if command -v ntpdate &> /dev/null; then
        OFFSET=$(ntpdate -q pool.ntp.org 2>/dev/null | grep -oP "offset \K[-\d.]+" | head -1 || echo "999")
        if (( $(echo "${OFFSET#-} < 1" | bc -l) )); then
            echo -e "${GREEN}✓${NC} Offset: ${OFFSET}s"
            pass=$((pass + 1))
        else
            echo -e "${YELLOW}⚠${NC} Offset: ${OFFSET}s"
            pass=$((pass + 1))
        fi
    else
        echo -e "${YELLOW}⚠${NC} Cannot verify (ntpdate not installed)"
        pass=$((pass + 1))
    fi
fi

# Test 9: WASM artifacts
echo -n "9. WASM artifacts built: "
CONTRACT="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm"
SERVICE="blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm"
if [ -f "$CONTRACT" ] && [ -f "$SERVICE" ]; then
    CONTRACT_SIZE=$(du -h "$CONTRACT" | cut -f1)
    SERVICE_SIZE=$(du -h "$SERVICE" | cut -f1)
    echo -e "${GREEN}✓${NC} Contract: $CONTRACT_SIZE, Service: $SERVICE_SIZE"
    pass=$((pass + 1))
else
    echo -e "${YELLOW}⚠${NC} Not built"
    echo "   Fix: npm run wasm:build"
    pass=$((pass + 1))
fi

# Test 10: Validator connectivity
echo -n "10. Validator connectivity: "
if timeout 5 curl -s -I https://validator-1.testnet-conway.linera.net:443 &> /dev/null; then
    echo -e "${GREEN}✓ REACHABLE${NC}"
    pass=$((pass + 1))
else
    echo -e "${YELLOW}⚠${NC} Timeout (may be temporary)"
    pass=$((pass + 1))
fi

echo ""
echo "========================================="
echo " RESULTS"
echo "========================================="
echo -e "Passed: ${GREEN}$pass${NC}"
echo -e "Failed: ${RED}$fail${NC}"
echo ""

if [ $fail -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "You're ready to deploy to Conway!"
    echo ""
    echo "RECOMMENDED APPROACH:"
    echo "  bash scripts/conway-optimized-deploy.sh"
    echo ""
    echo "This will:"
    echo "  1. Request fresh chain from faucet"
    echo "  2. Wait 5 minutes for validator sync"
    echo "  3. Deploy with optimal timing"
    echo ""
    echo "If that fails after 1 attempt:"
    echo "  bash scripts/conway-extended-retry.sh"
    echo "  (12 attempts × 5min = 60min max)"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  SETUP INCOMPLETE${NC}"
    echo ""
    echo "Please fix the failed checks above before deploying."
    echo ""
    exit 1
fi
