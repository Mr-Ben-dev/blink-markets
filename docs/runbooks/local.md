# Local Development Runbook

Complete guide for running Blink Markets on a local Linera devnet.

## Prerequisites

- **Rust**: rustup stable 1.86.0+ with `wasm32-unknown-unknown` target
- **Linera CLI**: version 0.15.3+ installed and in PATH
- **Node.js**: 18+ with npm
- **Git**: For project directory detection

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Install dependencies  
npm ci
```

Update `.env` for local development:
```bash
VITE_NETWORK=local
VITE_LINERA_SERVICE_URL=http://localhost:8080
```

## Local Deployment Commands

### 1. Start Local Devnet

```bash
npm run local:up
```

This will:
- Start local Linera network with faucet on port 8080
- Initialize wallet against local faucet
- Request a chain from local faucet
- Display network PID and wallet info

### 2. Build WASM Artifacts

```bash
npm run wasm:build
```

### 3. Publish to Local Network

```bash
npm run local:publish
```

**⚠️ IMPORTANT**: Save the Application ID:

```bash
echo 'APPLICATION_ID_HERE' > .linera/app_id
```

### 4. Start Service (New Terminal)

```bash
npm run linera:service
```

### 5. Start Frontend (New Terminal)

```bash
npm run dev
```

## Verification

### Check Wallet
```bash
linera wallet show
linera query-balance
```

### Service Health
- http://localhost:8080 - GraphQL playground
- http://localhost:5173 - Frontend app

### Chain Status Panel
Should show:
- ✅ Service connected
- Network: local
- Chain info if available

## Stopping Local Network

```bash
# Kill the background process
pkill -f 'linera net up'

# Or use the specific PID shown during startup
kill PID_NUMBER
```

## Contract Initialization

Default initialization value: `42`

Customize with:
```bash
INIT_JSON=123 npm run local:publish
```

## Advantages of Local Development

- ✅ No internet required after setup
- ✅ Faster iteration cycle  
- ✅ Full control over network state
- ✅ No testnet faucet dependencies
- ✅ Instant transactions

## File Locations

- Wallet: `.linera/wallet.json`
- Local network data: Temporary (lost on restart)
- WASM artifacts: `blink_markets/target/wasm32-unknown-unknown/release/`

## Troubleshooting

### Port 8080 Already in Use
```bash
# Kill any existing services
pkill -f 'linera'
lsof -ti:8080 | xargs kill
```

### "Failed to connect to faucet"
Ensure the local network started successfully. Check for error messages in the `npm run local:up` output.

### Restarting Development
Each time you restart the local network, you'll need to:
1. `npm run local:up` (creates fresh network)
2. `npm run local:publish` (republish with new app ID)