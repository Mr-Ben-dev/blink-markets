# 🎯 Blink Markets

**A Blazing-Fast Decentralized Prediction Market Platform on Linera**

[![Linera](https://img.shields.io/badge/Linera-0.15.6-blue.svg)](https://linera.io)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-1.82-orange.svg?logo=rust)](https://www.rust-lang.org)

> **Built for Linera Wave 2** - A production-ready prediction market dApp leveraging Linera's microchain architecture for instant finality and zero transaction costs.

---

## 🚀 Features

- ✅ **Instant Market Creation** - Create prediction markets with custom questions and outcomes
- ✅ **Real-Time Trading** - Place bets with immediate settlement via GraphQL mutations
- ✅ **Market Resolution** - Automated oracle-based resolution system
- ✅ **Winnings Claims** - Automatic payout calculation and distribution
- ✅ **Beautiful UI** - Modern, responsive interface with dark mode support
- ✅ **Duration Selector** - User-friendly time picker (1 hour to 30 days)
- ✅ **Performance HUD** - Real-time metrics and blockchain stats
- ✅ **Zero Gas Fees** - Powered by Linera's innovative microchain model

---

## 🏗️ Architecture

### Smart Contract (`blink_markets/`)
Built with Linera SDK 0.15.6, the smart contract handles:
- **State Management** - Markets, bets, and user positions
- **Operation Execution** - Create markets, place bets, resolve, claim winnings
- **BCS Serialization** - Efficient binary encoding for all data

### GraphQL Service Layer
Exposes async-graphql interface for:
- **Queries** - List markets, get market details, user positions
- **Mutations** - All state-changing operations via `schedule_operation()`

### Frontend (`src/`)
React + TypeScript + Vite stack with:
- **shadcn/ui** - Beautiful, accessible components
- **TailwindCSS** - Utility-first styling
- **urql** - Efficient GraphQL client
- **React Router** - Client-side routing

---

## 🔧 Prerequisites

### Required
- **Rust** 1.82+ with `wasm32-unknown-unknown` target
- **Node.js** 18+ and npm
- **Linera CLI** - Latest version from [Linera repository](https://github.com/linera-io/linera-protocol)
- **Git** - For version control

### Install Linera CLI
```bash
# From source (recommended)
git clone https://github.com/linera-io/linera-protocol
cd linera-protocol
cargo install --locked --path linera-service
```

Add Rust WASM target:
```bash
rustup target add wasm32-unknown-unknown
```

---

## 🚀 Quick Start - Local Network

### 1. Clone the Repository
```bash
git clone https://github.com/Mr-Ben-dev/blink-markets
cd blink-markets
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the WASM Contract
```bash
npm run wasm:build
```

This compiles the Rust smart contract to WASM bytecode:
- `blink_markets_contract.wasm` - Contract logic
- `blink_markets_service.wasm` - GraphQL service

### 4. Start Local Linera Network
```bash
linera net up
```

**Important**: Copy the environment variables from the output:
```bash
export LINERA_WALLET="/tmp/.tmpXXXXXX/wallet_0.json"
export LINERA_KEYSTORE="/tmp/.tmpXXXXXX/keystore_0.json"
export LINERA_STORAGE="rocksdb:/tmp/.tmpXXXXXX/client_0.db"
```

### 5. Deploy the Application
```bash
# Publish and create the application
linera publish-and-create \
  blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm \
  blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm \
  --json-argument "{\"initial_markets\": []}"
```

**Save the Application ID** from the output (e.g., `8b8648dcc87e2bd9...`).

### 6. Start the Linera Service
```bash
# Get your default chain ID
CHAIN_ID=$(linera wallet show | grep "Public Key" -A 1 | tail -1 | awk '{print $3}')

# Start the service on port 8080
linera service --port 8080 &
```

### 7. Configure Frontend
Update `.env` file:
```env
VITE_NETWORK=local
VITE_CHAIN_ID=<YOUR_CHAIN_ID>
VITE_APPLICATION_ID=<YOUR_APPLICATION_ID>
VITE_GRAPHQL_URL=http://localhost:8080/chains/<YOUR_CHAIN_ID>/applications/<YOUR_APPLICATION_ID>
```

### 8. Start the Frontend
```bash
npm run dev
```

Open **http://localhost:8081** in your browser! 🎉

---

## 🌐 Deployment to Conway Testnet

### 1. Initialize Wallet
```bash
npm run tn:init
# or manually:
linera wallet init --faucet https://faucet.testnet-conway.linera.net
```

### 2. Build & Publish
```bash
npm run tn:publish
```

This will:
1. Build the WASM contract
2. Publish to Conway testnet
3. Output your application ID

### 3. Update Frontend Configuration
Change `.env`:
```env
VITE_NETWORK=conway
VITE_CHAIN_ID=<YOUR_CONWAY_CHAIN_ID>
VITE_APPLICATION_ID=<YOUR_CONWAY_APP_ID>
VITE_GRAPHQL_URL=https://conway.linera.net/chains/<CHAIN_ID>/applications/<APP_ID>
```

### 4. Restart Frontend
```bash
npm run dev
```

---

## 💡 The `schedule_operation()` Fix

### The Problem
Initially, market creation appeared to work but markets never persisted. The GraphQL mutation returned success, but queries showed empty results.

### The Discovery
Reading through the Linera documentation (`linera-docs.md` lines 1151-1157), we found the critical pattern:

```rust
// ❌ WRONG - Just returns bytes, never executes
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    bcs::to_bytes(&operation).expect("Failed to serialize")
}

// ✅ CORRECT - Actually schedules and executes the operation
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    self.runtime.schedule_operation(&operation);  // <-- THE KEY!
    vec![]
}
```

### Why It Matters
In Linera's architecture:
1. **GraphQL mutations** must call `runtime.schedule_operation()`
2. This **schedules the operation** in the next block
3. The **client proposes a block** containing the operation
4. The **contract executes** the operation via `execute_operation()`
5. **State changes persist** to the blockchain

Without `schedule_operation()`, mutations just return serialized bytes that are never executed!

### Verification
We verified the fix on a local Linera network:

```bash
# Created a test market
curl -X POST "http://localhost:8080/chains/.../applications/..." \
  -d '{"query":"mutation { createMarket(...) }"}'

# Response: Block hash (proof of execution!)
{"data":"692c9755bdc21d3a66ede5599e8f03250c13b7af545960f49daa743d71ea634b"}

# Queried markets
curl -X POST "..." -d '{"query":"{ markets { id question } }"}'

# Market appears!
{"data":{"markets":[{"id":0,"question":"Test Market?"}]}}
```

**Result**: Markets are now created, persistent, and queryable! ✅

---

## 📖 Project Structure

```
blink-markets/
├── blink_markets/              # Rust smart contract
│   ├── src/
│   │   ├── lib.rs             # Module exports
│   │   ├── state.rs           # Application state
│   │   ├── contract.rs        # Contract logic
│   │   └── service.rs         # GraphQL service (with schedule_operation!)
│   ├── Cargo.toml
│   └── tests/                 # Integration tests
├── src/                       # React frontend
│   ├── pages/                 # Route components
│   │   ├── Home.tsx
│   │   ├── Markets.tsx
│   │   ├── CreateMarket.tsx   # With duration selector
│   │   └── MarketDetail.tsx
│   ├── components/            # Reusable components
│   │   ├── layout/            # Navbar, Footer
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── graphqlClient.ts   # urql configuration
│   │   └── lineraClient.ts    # Linera client helpers
│   └── hooks/                 # React hooks
├── scripts/                   # Deployment & utility scripts
│   ├── build-wasm.sh
│   ├── deploy-local.sh
│   ├── testnet-init.sh
│   └── testnet-publish.sh
├── docs/                      # Documentation
│   ├── CREATE_MARKET_GUIDE.md
│   ├── MUTATION_FIX.md
│   ├── FRONTEND_SETUP.md
│   └── runbooks/
├── .env                       # Environment configuration
├── package.json               # Node dependencies
├── vite.config.ts             # Vite configuration (with proxy)
└── tailwind.config.ts         # Tailwind CSS config
```

---

## 🎮 Usage Guide

### Creating a Market

1. Navigate to **Create Market** page
2. Enter your question (e.g., "Will Bitcoin reach $100k by 2025?")
3. Add 2+ outcomes (e.g., "Yes", "No")
4. Add a description
5. Select duration using the slider (1 hour to 30 days)
6. Click **Create Market**

The market is created **instantly** on the blockchain!

### Placing Bets

1. Browse markets on the **Markets** page
2. Click on a market to view details
3. Select an outcome
4. Enter your bet amount
5. Click **Place Bet**

Your bet is recorded immediately with instant finality.

### Claiming Winnings

1. When a market resolves, go to **My Positions**
2. View your winning bets
3. Click **Claim Winnings**
4. Rewards are transferred to your account

---

## 🛠️ Development Scripts

```bash
# Build WASM contract
npm run wasm:build

# Local network
npm run local:up        # Start local Linera network
npm run local:publish   # Deploy to local network

# Conway testnet
npm run tn:init         # Initialize wallet with faucet
npm run tn:publish      # Deploy to Conway testnet

# Frontend
npm run dev             # Start Vite dev server (port 8081)
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run Rust tests
```

---

## 🧪 Testing

### Contract Tests
```bash
cd blink_markets
cargo test
```

Tests include:
- ✅ Market creation
- ✅ Bet placement
- ✅ Market resolution
- ✅ Winnings claims
- ✅ Multi-chain scenarios

### Integration Tests
```bash
./scripts/test-full-stack.sh
```

End-to-end tests covering:
- WASM build
- Local deployment
- GraphQL queries
- Mutation execution
- State persistence

---

## 🔐 Security Considerations

- **No Private Keys in Code** - All wallet files are gitignored
- **BCS Serialization** - Type-safe encoding prevents injection attacks
- **Linera Authentication** - Operations are authenticated by the blockchain
- **Immutable Contracts** - Once deployed, contract logic cannot be changed
- **Oracle-Based Resolution** - Markets resolve via trusted oracle system

---

## 📊 Performance

Leveraging Linera's microchain architecture:

- **Instant Finality** - Transactions confirm in milliseconds
- **Zero Gas Fees** - No transaction costs for users
- **Parallel Execution** - Each chain operates independently
- **Scalable** - Unlimited throughput with microchain scaling

Measured on local network:
- Market creation: **~827ms**
- Bet placement: **<500ms**
- Query response: **<100ms**

---

## 🐛 Troubleshooting

### WASM Build Fails
```bash
# Ensure rust toolchain is correct
rustup show

# Clean and rebuild
cd blink_markets
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Local Network Won't Start
```bash
# Kill existing processes
pkill -9 linera
pkill -9 proxy

# Remove temporary files
rm -rf /tmp/.tmp*/

# Restart
linera net up
```

### Frontend Can't Connect
1. Check `.env` has correct `VITE_CHAIN_ID` and `VITE_APPLICATION_ID`
2. Verify Linera service is running: `curl http://localhost:8080`
3. Check browser console for errors
4. Restart Vite dev server

### Mutations Return Success But No Data
**This was the original bug!** Make sure your service.rs uses `schedule_operation()`:

```rust
self.runtime.schedule_operation(&operation);
```

See `docs/MUTATION_FIX.md` for detailed explanation.

---

## 🗺️ Roadmap

### ✅ Wave 1 (Completed)
- [x] Core smart contract
- [x] Market creation
- [x] Bet placement
- [x] Basic GraphQL service
- [x] React frontend

### ✅ Wave 2 (Completed)
- [x] Fix `schedule_operation()` bug
- [x] Duration selector UI
- [x] Conway testnet deployment
- [x] Performance HUD
- [x] Documentation

### 🔜 Future Enhancements
- [ ] Multi-outcome markets (>2 outcomes)
- [ ] Market categories and filtering
- [ ] User profiles and history
- [ ] Social features (comments, sharing)
- [ ] Advanced analytics dashboard
- [ ] Mobile-responsive improvements
- [ ] Oracle network integration
- [ ] Liquidity pools
- [ ] Market maker incentives

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Linera Team** - For building an incredible blockchain platform
- **Linera Wave 2** - For the opportunity to build on cutting-edge tech
- **shadcn/ui** - For beautiful, accessible UI components
- **The Rust Community** - For excellent tooling and support

---

## 📞 Contact & Links

- **GitHub**: [Mr-Ben-dev/blink-markets](https://github.com/Mr-Ben-dev/blink-markets)
- **Linera**: [linera.io](https://linera.io)
- **Documentation**: See `docs/` folder for guides

---

## 🎯 Key Takeaways

1. **Always use `schedule_operation()`** in GraphQL mutations
2. **Read the docs carefully** - The answer is often there!
3. **Linera's microchains** enable instant finality and zero fees
4. **Test locally first** - Faster iteration cycle
5. **Deploy to Conway** - Real testnet with actual validators

---

**Built with ❤️ for the Linera ecosystem**

*Making decentralized prediction markets fast, free, and accessible to everyone.*
