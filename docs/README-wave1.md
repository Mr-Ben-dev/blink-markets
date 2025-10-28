# Blink Markets - Wave 1 Overview

A modern React/TypeScript frontend paired with a Rust smart contract on Linera blockchain.

## Quick Start

### A-path: Testnet Deployment
1. **Setup**: `cp .env.example .env && npm ci`
2. **Initialize**: `npm run tn:init` - Creates wallet and requests chain
3. **Build**: `npm run wasm:build` - Compiles Rust to WASM
4. **Deploy**: `npm run tn:publish` - Publishes app to testnet
5. **Serve**: `npm run linera:service` - Starts service on :8080
6. **Dev**: `npm run dev` - Frontend on :5173

### B-path: Local Development (Optional)
1. **Setup**: `cp .env.example .env && npm ci`
2. **Network**: `npm run local:up` - Starts local devnet + faucet
3. **Build**: `npm run wasm:build` 
4. **Deploy**: `npm run local:publish`
5. **Serve**: `npm run linera:service`
6. **Dev**: `npm run dev`

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend**: Rust smart contract + service on Linera protocol
- **Integration**: Chain Status panel with health checks and GraphQL queries

## Runbooks

- [Testnet Deployment](./runbooks/testnet.md) - Complete testnet setup
- [Local Development](./runbooks/local.md) - Local devnet workflow

## Features

- ✅ Automated wallet creation and chain setup
- ✅ WASM build pipeline for Rust contracts
- ✅ Chain status monitoring with auto-refresh
- ✅ Demo mode fallback when service unreachable
- ✅ CI/CD with GitHub Actions
- ✅ Vercel deployment ready

## Verification

After setup, verify:
- `linera wallet show` - Shows wallet info
- `linera query-balance` - Shows chain balance
- http://localhost:8080 - Service health endpoint
- http://localhost:5173 - Frontend with Chain Status panel