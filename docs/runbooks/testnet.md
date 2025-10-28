# Testnet Deployment Runbook

Complete guide for deploying Blink Markets to Linera Testnet.

## Prerequisites

- **Rust**: rustup stable 1.86.0+ with `wasm32-unknown-unknown` target
- **Linera CLI**: version 0.15.3+ installed and in PATH
- **Node.js**: 18+ with npm
- **Git**: For project directory detection

### Install Prerequisites

```bash
# Install Rust target for WASM
rustup target add wasm32-unknown-unknown

# Verify linera installation
linera --version

# Verify node
node --version
npm --version
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Install dependencies  
npm ci
```

## Deployment Commands

Run these commands in sequence:

### 1. Initialize Testnet Wallet

```bash
npm run tn:init
```

This will:
- Create `.linera/` directory
- Initialize wallet against testnet faucet
- Request a new chain from faucet
- Display wallet info and balance

### 2. Build WASM Artifacts

```bash
npm run wasm:build
```

Compiles the Rust contract and service to WASM targeting `wasm32-unknown-unknown`.

### 3. Publish to Testnet

```bash
npm run tn:publish
```

**⚠️ IMPORTANT**: Copy the Application ID from the output and save it:

```bash
# Save the app ID for reference
echo 'e476187f-linera-app-id-here' > .linera/app_id
```

### 4. Start Local Service

```bash
npm run linera:service
```

Starts the Linera service on port 8080. Keep this running.

### 5. Start Frontend (New Terminal)

```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## Verification & Sanity Checks

### Check Wallet Status
```bash
linera wallet show
```

### Check Balance
```bash
linera sync
linera query-balance
```

### Service Health
Visit http://localhost:8080 - should respond with GraphQL playground or service info.

### Frontend Integration
Visit http://localhost:5173 - Chain Status panel should show:
- ✅ Service URL connected
- Network: testnet
- Optional: Chain ID and balance if available

## Environment Variables

Key variables in `.env`:

```bash
VITE_APP_NAME=Blink Markets
VITE_NETWORK=testnet  
VITE_LINERA_SERVICE_URL=http://localhost:8080
LINERA_FAUCET_URL=https://faucet.testnet-conway.linera.net
```

## Contract Initialization

The contract expects a `u64` initialization argument. Default value is `42`.

To customize:
```bash
INIT_JSON=100 npm run tn:publish
```

## Troubleshooting

### "WASM artifacts not found"
Run `npm run wasm:build` first.

### "Failed to initialize wallet"
Check internet connection and faucet URL in `.env`.

### "Service not responding"
Ensure `npm run linera:service` is running and no port conflicts on 8080.

### "Chain Status shows Demo Mode"
Normal if service is unreachable - app falls back to mock data.

## File Locations

- Wallet: `.linera/wallet.json`
- Keystore: `.linera/keystore.json` 
- Storage: `.linera/wallet.db/`
- App ID: `.linera/app_id` (manual)
- WASM: `blink_markets/target/wasm32-unknown-unknown/release/`