58 products found.
ReaX
Hidden
ReaX
React to the market before it moves
Updates in this Wave
1.Multi-DEX integration
 
Integrated Jupiter aggregator for Solana DEX routing
Automated execution across multiple DEXes for optimal pricing
Slippage protection and route optimization in the relayer service
2. Twitter signals
 
Real-time monitoring of Twitter influencers with dynamic user management
Google Gemini AI parsing extracts trading signals, entry/exit prices, stop-loss, take-profit, and position sizing
Image analysis for chart-based signals
Auto-order creation on high-confidence bullish signals
Frontend UI to add/remove monitored Twitter users with active/inactive toggles
 
2.Portfolio management
On-chain state management via Linera microchains for all strategies, signals, and orders
Real-time P&L tracking, win rate, and performance metrics
Order history with status tracking (Pending, Submitted, Filled, Failed)
Performance charts showing trading performance and signals by token
Risk management with built-in stop-loss, take-profit, and position sizing controls
 
3.UI/UX improvements
Fixed text visibility issues across all form elements
Enhanced dashboard with real-time WebSocket updates
Improved user experience for managing monitored account
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
10 pt
Grant
0 USDC
 
2
synapsenet
Hidden
synapsenet
Real-time blockchain data mesh using Linera microchains + Chainlink oracles for live ETH
Updates in this Wave
3 Linera microchains (Oracle, Subscription, Metadata) 
Enhanced backend with multi-oracle aggregation (Chainlink, Pyth, CoinGecko)
OHLC candle generation (1s, 1m, 1h, 24h intervals)
Complete frontend with 5 pages (Dashboard, Analytics, Alerts, Subscription, API Docs)
Real-time WebSocket streaming
REST API with 5 endpoints
Price alerts system
Subscription management (Free/Pro/Enterprise tiers)
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
1 pt
Grant
0 USDC
 
2
Alethea Network
Hidden
Alethea Network
Alethea Network is a decentralized oracle protocol resolution of real-world events.
Updates in this Wave
Update in this Wave  delivered a production-ready dispute resolution oracle with power-based voter selection on Linera blockchain. Core features: (1) Voter Selection System - automatically selects top voters by power (stake × reputation) with four reputation tiers providing 1.0x to 2.0x weight multipliers; (2) Voting Permissions - smart contract enforces access control, only selected voters can vote; (3) Power-Based Rewards - proportional distribution incentivizing accuracy; (4) Account-Based Registration - simplified from 5 minutes to 30 seconds; (5) Complete Workflow - query creation to reward distribution with Majority, Weighted, and Consensus strategies. Performance: 10x faster registration, <100ms selection for 1000+ voters, 99.9% uptime.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
15 pt
Grant
0 USDC
 
2
LINERA FLAPPY
LINERA FLAPPY
LINERA FLAPPY showcases the potential of Linera's microchain architecture for real-time.
GitHub
Updates in this Wave
Adding Anti-Cheat System from feedback
 
Architecture Flow: Frontend (Tracking) → Player Chain (Registration) → Leaderboard Chain (Validation)
 

Frontend Tracking
  - Tracks: Jump count, game duration, pipes passed
  - Generates cryptographic proof on game end
  - Timestamps: Start time, end time
 
Player Chain
  - Registers game sessions with unique IDs
  - Stores local proof history
  - Fast user feedback
 
Leaderboard Chain (Security Layer)
  - Validates proofs against rules
  - Updates global rankings
  - Permanent audit trail
 
Validation Rules
  1. Session Timeout: 10-minute expiration
  2. Minimum Duration: 1.2s per pipe
  3. Maximum Duration: 30s per pipe
  4. Score Consistency: final_score == pipes_passed
  5. Jump Limits: 5 base + 10 per pipe
  6. Duration Check: duration > 0 if score > 0
 
Key Features


Session-Based Gaming
Cross-Chain Messaging
  Player submits → Session registered → Proof validated → Score accepted/rejected
 
Proof History UI
  - Filter by status: Accepted/Rejected/Pending
  - Filter by mode: Practice/Tournament
  - Detailed metrics: Score, jumps, duration
  - Rejection reasons displayed
 
New Game UI design
 
Smart Contract Repo: https://github.com/nut1shot/linera-flappy/tree/wave2
Front End Repo: https://github.com/nut1shot/linera-flappy-game/tree/wave2
 
Demo: https://linera-flappy-game-wave2.vercel.app/
VIDEO Demo: https://youtu.be/PdYr0115Tv4
 
Admin Account:
Username: admin
Password: Linera-Wave2-Secure!2025
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
4 pt
Grant
0 USDC
 
3
Linot
Linot
Linot is a real-time Whot card game built on Linera, bringing fast, social, and scalable gameplay.
GitHub
Updates in this Wave
Wave 2 Progress Made 
 
--- 
 
Status Currently: 
 
Developed a complete, production-ready, real-time multiplayer Whot game built on Linera microchains, validating the platform's capability for low-latency, complex state applications.
 
Complete Game Logic - Implemented the full Whot ruleset, including all six special cards, complex penalty stacking, turn management, last card challenges, and deterministic, verifiable shuffling (using Chain ID as the seed)
 
Backend Details - Designed and deployed a modular backend with 7 smart contract operations (CreateMatch, PlayCard, DrawCard, etc.). Achieved zero panics, building successfully with custom Rust Result and Error types.
 
Data Layer Status - Exposed 12 type-safe GraphQL query endpoints via async-graphql. Achieved consistent sub-50ms query latency on the local network, demonstrating Web2-level performance for blockchain state access.
 
Player Foundation Status - Focused on having multiplayer features for now as priority. Implemented end-to-end flow with strict turn enforcement and caller authentication, creating a cheat-proof environment. Further development will be made in Wave 3 to show the game play in action. 
 


##  
End Result 
 
The backend game logic, architecture, and query service are  currently complete for demo. 
 
Further development to be done for Wave 3 
 
Frontend integration is pending the implementation of the GraphQL Mutation layer.
 
Implement GraphQL mutations for browser-based interaction, connect the React UI, and introduce the planned betting mechanics on live match rankings. 
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Alphabot
Hidden
Alphabot
Community driven transparent AI trading bots on Linera microchains with verifiable predictions
Updates in this Wave
# Wave 2 Major Features
## 1. Scheduler Service - Autonomous Predictions 🤖
Cron-based Node.js service that automatically triggers hourly ETH predictions via GraphQL mutations to Linera contracts. Fully containerized with configurable strategies (Gemma LLM), graceful shutdown, and comprehensive logging.
**Configuration:**
envSTRATEGY=gemma
CRON_SCHEDULE=0 * * * *
INFERENCE_API_KEY=your_key
**Impact:** Transforms AlphaBot from manual to fully autonomous AI trading bot.
 
 
## 2. Gemma 3 27B LLM Integration 🧠
Production AI strategy using Gemma 3 27B Instruct via inference.net (OpenAI-compatible). Fast inference (<5s), strong financial reasoning, cost-effective (~$0.10/prediction).
**Output:** BUY/SELL/HOLD action, predicted price (micro-USD), confidence (basis points), natural language reasoning.
**Sample:** "Strong upward momentum with increasing volume, breaking resistance at $3,550."
**Flow:** Scheduler → GraphQL → Contract → HTTP Proxy → inference.net → On-Chain
**Replaces:** Atoma Network (API deprecated)
 
## 3. HTTP Proxy (External Service Mirror) 🌐
Localhost proxy (localhost:3002) works around Linera's HTTP authorization restrictions. Routes contract requests to external APIs: Binance (market data), inference.net (LLM).
**Why:** Linera HTTP policy configured at genesis level, contracts can't call external APIs directly.
**Features:** Transparent auth forwarding, health checks, retry logic, TypeScript/Express.
**Future:** Remove when Linera supports direct API calls.
 
 
## 4. Docker Compose Production Stack 🐳
 
Complete orchestration of 3 services: scheduler (cron), external-service-mirror (port 3002), frontend (port 3000).
**Quick Start:**
Bash./setup-env.sh
make linera-local
docker compose up -d
open http://localhost:3000
## **Benefits:** One-command deployment, consistent environments, auto-restarts, <10 min setup (down from 30+ min).
 
 
## Impact Summary
 
**Achievements:**

✅ Autonomous AI predictions (Gemma 3 27B)
✅ Production deployment (Docker Compose)
✅ HTTP proxy workaround (Linera limitation)
✅ Sub-10-minute setup (automated)
 
**Performance:**
Prediction: <5s | LLM inference: 3-8s
Frontend update: <1s | Setup: 10 min
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
7 pt
Grant
0 USDC
 
3
AdLoom X Ultra 
Hidden
AdLoom X Ultra
Real-time attention economy: Viewers earn, creators profit, advertisers optimize
Updates in this Wave


Full-Stack Implementation
 
Built complete Linera smart contract in Rust with viewer ledgers, advertiser budgets, and A-Fi credit system
Deployed GraphQL service for real-time attention tracking and leaderboard queries
Created React + Vite frontend with live telemetry dashboard
 
Testnet Conway Deployment
 
Successfully deployed Wasm contracts to Linera Testnet Conway
Configured GraphQL endpoint for live blockchain data
Live demo: https://ad-loom-x-ultra.vercel.app/
Core Features Shipped
 
Viewer attention scoring and instant $ATTN rewards
Creator revenue dashboard with real-time earnings
Advertiser Brand OS with AI-powered campaign management
Developer SDK integration flow
 
Documentation & Setup
 
Complete README with Windows setup guide (winget commands for all dependencies)
Local devnet testing instructions
Testnet Conway deployment steps
GraphQL query examples
 
GitHub Repository
 
Clean project structure with contract + frontend
Full source code: https://github.com/sarthak567/AdLoom-X-Ultra
Includes build scripts, tests, and deployment configs
 
Key Achievement: Delivered a working real-time attention economy on Linera microchains with sub-second settlement, demonstrating how parallel execution enables instant micropayments for viewers, creators, and advertisers.RetryClaude can make mistakes. Please double-check responses.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Predictum
Hidden
Predictum
⚡ Bet Fast. Settle Instantly. Win Real-Time.
Updates in this Wave

# 📋 Update Log - Predictum Prediction Market
 
## DEMO: https://www.youtube.com/watch?v=vOsnll_aKzQ
 
## 🎯 Current Update (November 17, 2025)
 
### ✅ Completed Features
 
#### 1. **Active Markets Filter** (Default View)

**Changed**: Home page now defaults to showing only "Active" markets
**Impact**: Better UX - users see bettable markets first
**Files**: frontend/src/pages/Home.tsx

#### 2. **Backend Filter & Sort Implementation**

**Added**: Server-side filtering by status and category
**Added**: Server-side sorting (newest, ending-soon, popular, alphabetical)
**Removed**: Client-side filtering/sorting (improved performance)
**Files**: 
  - backend/internal/handlers/handlers.go
  - frontend/src/api/client.ts
  - frontend/src/pages/Home.tsx

#### 3. **Pagination System**

**Added**: Full pagination with 20 markets per page
**Added**: Page navigation controls (Previous, 1, 2, 3, ..., Next)
**Added**: Total count and current page indicators
**Impact**: Better performance for large datasets
**Files**: frontend/src/pages/Home.tsx, backend/internal/handlers/handlers.go

#### 4. **Dynamic Market Status Updates**

**Added**: Auto-update markets to "Locked" when endTime passes
**Logic**: Backend checks on every request and updates status
**Files**: backend/internal/handlers/handlers.go

#### 5. **Claimable Markets for Demo**

**Created**: 5 demo markets with resolved status for claiming
**Added**: Proper claim flow with balance updates
**Fixed**: My Bets page to correctly display positions
**Files**: frontend/src/pages/MyBets.tsx

#### 6. **UI Improvements**

**Simplified**: Filter and sort section (more compact design)
**Removed**: "Create Market" button 
**Added**: Info badge about automated market creation
**Updated**: Project name to "Predictum" throughout
**Files**: frontend/src/pages/Home.tsx, frontend/src/components/Header.tsx

#### 7. **Linera Blockchain Proof System** 

**Created**: demo_linera_proof.sh - Automated proof script
**Created**: LINERA_PROOF.md - Complete deployment documentation
**Created**: QUICK_PROOF.txt - Quick reference card
**Created**: LINERA_CLI_COMMANDS.md - CLI commands guide
**Added**: Linera proof section to README.md
**Impact**: Complete verifiable proof of blockchain deployment
 
**Contract Details**:
Chain ID: 10c453e40426ef2bdbe6d9ddf0164c04e24fbb9d5695c26f65df24c5d852d9f0
App ID: 3910a3b9f7f92fb9c47d9d460a26b4d7819c0a7f01a9cefbe5f575c4e74b6a76
Network: Linera Testnet Conway
Status: ✅ Deployed & Operational
 

#### 8. **TypeScript Type Fixes**

**Fixed**: canvas-confetti type definitions
**Installed**: @types/canvas-confetti
**Files**: frontend/package.json

#### 9. **Bug Fixes**

**Fixed**: Markets not showing on frontend
**Fixed**: My Bets page not loading positions correctly
**Fixed**: GraphQL field names (marketCount vs market_count)
**Fixed**: Frontend API client not passing filters to backend
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
5 pt
Grant
0 USDC
 
2
DeadKeys
Hidden
DeadKeys
Type or Be Devoured!
Updates in this Wave
The goal of Wave 2 was to pave the way for all future waves and features by establishing a stable, extensible foundation across gameplay, on-chain systems, and UI. 
 
This wave added Story Mode, Time Attack Mode, Survival Mode with power-ups, the Secure Leaderboard, The Crypt Hub UI, On-Chain Player Profiles, and the Central Text Hub on the Application Chain. 
 
Core gameplay logic and contracts were refactored for performance and maintainability, ensuring scalability for upcoming Arena and Shop systems.
 
Completed this wave:
• Secure Leaderboard — restricted writes to Application Chain.
• Central Text Hub — hosted on the Application Chain, supporting dynamic word / event feeds.
• Admin Word Management — support for updating word sets directly on the Application Chain.
• Story Mode — complete single-player progression loop with leaderboard scoring.
• Time Attack Mode — timed survival challenge with leaderboard scoring.
• Power ups — now includes power-ups to blast zombies.
• The Crypt UI — integrated Profile / Achievements / Leaderboard.
• On-Chain Player Profile — tracks kills, WPM, and revealed Zombie chart.
• Refactored styling, logic, and structure for long-term maintainability.
• Squashed numerous gameplay and contract bugs for improved stability.
• Visual, more game music and SFX polish for demo build completed.
• Cross-messaging verified between player microchains ↔ leaderboard.
 
Game URL: https://deadkeys.vercel.app/
 
 
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
16 pt
Grant
0 USDC
 
3
HypeVest
Hidden
HypeVest
HypeVest: The Creator Economy, Liquid.
Updates in this Wave


Creator Tranches 
 
Added full tranche creation flow: supply, unit price, % revenue share, metadata.
 
Implemented creator registry + profile setup.
 
Added live YouTube stats (subs, views) using public API.
 
Bond Buying & Minting
 
Fans can purchase tranche units via UI → relayer → Linera app.
 
On-chain minting implemented (Rust → Wasm) and indexed in dashboard.
 
Staking + Voting Rights Layer
 
Built “stake_tranche” and “unstake_tranche” entrypoints.
 
Staked units automatically grant governance/discussion rights.
 
Added SBT-style proof for gated chat/Discord integration.
 
Secondary Market (Orderbook + Trades)
 
Implemented off-chain orderbook in relayer (Node.js).
 
Sellers can list units → on-chain escrow locks tokens.
 
Trades settled on-chain using Linera transfer calls.
 
Added Trade dashboard (bids, asks, history).
 
Revenue Attestations + Payouts
 
Creator signs revenue JSON → relayer verifies → posts on-chain.
 
Bondholders receive pro-rata claimable payout.
 
Added claim history + tranche yield calculation.
 
UX & Dashboard Improvements
 
Creator profile pages with growth graphs.
 
Tranche cards with APR, progress, and risk info.
 
Buy / Sell / Stake modals integrated with relayer endpoints.
 
Full local environment configuration
 
Built stable workflow for WSL2, Rust, Linera CLI, relayer, and Next.js.
 
Enabled automated build scripts + environment templates.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
CoinDrafts
CoinDrafts
Draft Your Fortune. Beat the Market
Deliverable
Updates in this Wave
✅ We have created backend applications for CoinDrafts Core and Traditional Leagues with complete Rust implementation
✅ We have deployed both applications successfully on Linera Protocol
✅We have established GraphQL service integration running on localhost:8080 with working schema
✅ We have a frontend built on SvelteKit and proper GraphQL integration
✅ We have created a complete Docker buildathon template with deployment scripts and configuration
✅ We have tested and confirmed working operations: game creation, tournament creation, portfolio submission, tournament registration
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Jeteeah
Jeteeah
The Classic Snake Game Reborn for Web3.
GitHub
Updates in this Wave
We integrated the frontend with the smart contract and introduced a blockchain mode that awards points and records them on the Linera testnet.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
LineraChess
Hidden
LineraChess
Zero lag. 100% onchain.
Updates in this Wave
Added contract and deployment of the product on testnet. 
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Linera Realms
Hidden
Linera Realms
Next-generation blockchain RPG with real-time multiplayer and instant transaction finality
Updates in this Wave


Cross-chain player transfers with complete state
Distributed world regions across chains
Verifiable battle system with on-chain records
Multi-chain guild system with shared resources
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
7 pt
Grant
0 USDC
 
4
Finera
Finera
Play to win on Linera
Deliverable
Updates in this Wave
Build all applications successfully
Deploy with updated script including --required-application-ids
Create two player chains
 Join matchmaking queue
Create and confirm battle offer
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
7 pt
Grant
0 USDC
 
3
AetherArena
AetherArena
The Real-Time, AI-Powered Arena of Predictions.
Deliverable
Updates in this Wave
Core Infrastructure & Basic Arenas
Focus: Building the foundational Linera application and basic UI for prediction arenas.
 
Detailed Updates:
Linera Application
Frontend
  ✅ Set up React + TypeScript + Vite project
  ✅ Integrated Linera GraphQL client with subscriptions
  ✅ Basic arena creation form
  ✅ Arena listing page showing active arenas
  ✅ Simple prediction placement UI
Rust Service (rust-orchestrator/):
  ✅ Basic service structure with Actix Web
  ✅ Configuration management for Linera connection
  ✅ Skeleton for future AI integration (placeholder functions)
Key Challenges Overcome:
  1. Cross-chain messaging: Initially struggled with the concept of user microchains sending predictions to arena microchains. Solved by studying Linera's cross-chain messaging patterns.
  2. State management: Had to carefully design the arena state transitions to prevent invalid operations (e.g., predicting on closed arenas).
  3. GraphQL subscriptions: Took time to understand how to properly handle real-time updates in the React frontend.
Testing Setup:
  - Created 3 test arenas with different statuses
  - Manual testing of prediction flow between two test users
  - Verified real-time updates work across multiple browser tabs
 
Wave 2 Deliverables:
  ✅ Basic prediction marketplace without AI
  ✅ Real-time UI updates via GraphQL subscriptions
  ✅ Cross-chain prediction messaging
  ✅ Arena creation and resolution by admin
 
 
Milestone
0points
 
Grant
0 USDC
 
0
BOLTIS CHARGE
Hidden
BOLTIS CHARGE
Real Time Decentralized Card Battle
Updates in this Wave

### Week 1: Linera Research & Architecture Planning
**Goal:** Understand Linera's microchain architecture and plan BOLTIS migration strategy
 
**Completed:**

Researched Linera's elastic validator set and microchain model
Benchmarked transaction finality times (Linera: <100ms per microchain)
Analyzed Linera's Rust-based application framework
Set up Linera testnet development environment
Configured Linera SDK and development tools
 
**Deliverables:**
Technical specification: Linera microchain architecture for BOLTIS
Development environment with Linera CLI and SDK
Test wallets and microchains initialized on testnet
 
**Blockers:** None
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Fluxera
Hidden
Fluxera
Fluxera is a data layer and indexing platform that indexes blockchain data from Lineras microchains
Updates in this Wave
Kindly check video demo here: https://www.youtube.com/watch?v=55hGcd0qYCg
 
Wave 2 we had a couple of updates which include:
 
  - SQLite schema optimized with proper indexing Indexed columns: block_height, microchain_id,
  timestamp
  - Efficient querying for large datasets
   - Full compatibility with Linera local networks
  - Testnet network support
  - Secure API access for web applications
  - Proper middleware configuration
Real time frontend integrated
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Creators website 
Creators website
TikTok website
GitHub
Updates in this Wave
Helping is always great and makes a person become what society calles a proud citizen and inturn he will help. Other s 
 
 
Milestone
0points
 
Grant
0 USDC
 
0
MicroScribbl
MicroScribbl
One of the most popular game working on Linera microchains!
Deliverable
Updates in this Wave
MVP version with live demo, fully functional game fully on Linera, only drawing on web sockets for now: https://skribbl-linera.xyz/ (sometimes Linera client can fail, try cleaning memory in dev tools --> application --> storage --> clear site data and then reload website
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Alea
Alea
Alea: Linera's provably fair, instant randomness beacon for secure on-chain apps.
Deliverable
Updates in this Wave

# Project Alea - Key Achievements this wave
 
## Milestone 2: TEE Aggregation & Attestation

Implemented deterministic secret sorting and concatenation
Built mock TEE enclave that generates attestations
Created full round integration with TEE aggregation
Verified output is deterministic and reproducible
Prepared foundation for real SGX integration
 

## Milestone 3: Beacon Microchain Integration

Connected off-chain network to Linera microchain
Implemented transaction submission for randomness events
Added event subscription for real-time updates
Created on-chain storage for randomness with attestations
Verified instant finality on Linera testnet
 

## Milestone 4: Client SDK & Developer Experience

Complete TypeScript SDK built for easy dApp integration
Developers can request randomness with just a few lines of code
Robust error handling with automatic reconnection logic
Comprehensive documentation with practical examples
Package ready for npm publication with semantic versioning
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
8 pt
Grant
0 USDC
 
2
Linera Flip Market
Linera Flip Market
Real-time coin flip betting powered by Linera microchains
GitHub
Updates in this Wave
GitHub: https://github.com/AlexD-Great/Linera-flip-market
 
Wave 2 Updates
Smart Contract Enhancements
SDK 0.15 Compatibility: Migrated to latest Linera SDK (testnet_conway branch)
ServiceAbi Implementation: Added GraphQL service integration with proper trait implementations
Type Safety: Added EventValue type and modernized deprecated API methods
State Management: Implemented BCS serialization for proper state handling
Technical Improvements
WASM Compilation: Successfully builds optimized WebAssembly binaries
Code Quality: Production-ready with comprehensive error handling
Build System: Optimized Cargo.toml for release builds
Development Infrastructure
Environment: WSL 2 + Ubuntu 24.04 setup
Toolchain: Rust 1.86.0 with WASM target
Documentation: Added deployment guides and technical notes
Core Features
Smart Contract:
 
Provably fair coin flip mechanism
Secure betting system with instant resolution
Player leaderboard with win tracking
GraphQL API for querying game state
Frontend:
 
MetaMask wallet integration
Real-time flip results and notifications
Responsive, mobile-first design
Live demo on Vercel
Deliverables
✅ Smart contract (Rust) with SDK 0.15 compatibility
✅ WASM binaries compiled and tested
✅ Frontend (Next.js + TypeScript)
✅ Comprehensive documentation
✅ Live demo deployment
⏳ Testnet deployment (coordinated with dev team)
 
Technical Stack
Linera SDK 0.15.6 (testnet_conway)
Rust 1.86.0 + async-graphql 7.0
Next.js 14 + TypeScript + TailwindCSS
Progress Metrics
Code Completion: 100%
WASM Build: ✅ Success
SDK Compatibility: ✅ Latest
Documentation: ✅ Complete
Innovation
Clean, modular architecture
Modern SDK patterns and best practices
Intuitive UX with instant feedback
Production-ready error handling
Status
Smart contract compiles successfully and is deployment-ready. Frontend live with full user flows. Testnet deployment in progress with development team.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Provera
Hidden
Provera
A platform that allows user and event organizers to facilitate attendance onchain.
Updates in this Wave
vercel link: https://proveras.vercel.app/
demo link: https://youtu.be/ZYPjshBLfS4?si=xWzwE_WXHXpgAUxT


The Rust contracts were deployed to the Linera Conway Testnet.
The Application ID was generated after the successful deployment.
The web app uses the wallet initialized in the LInera SDK with faucet for testing purposes.
The create event and deploy microchain is working for development purposes while using the test wallet as a default mechanism for the event organizer page.
It stores the event to Linera conway testnet blockchain and allows badge claiming.
The event organizer page is almost fully functional. The qr code generator and ipfs feature will be updated as time goes on.
The "Attendee" section will be worked on in the next wave and mock/placeholder data will be removed from it.
The Linera SDK, CLI, and Storage service were successfully installed to the dependencies of this web app.
On the event organizers dashboard, on click listeners and functions were added to the 
"Manage Attendess" button - In order to view How many users have claimed badges for that event.
"View Details" button- In order to view the Microchain ID and event details
"QR Code button Generator"- In order to generate multiple QR codes for attendees.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
4 pt
Grant
0 USDC
 
2
Linera Security Bounty
Hidden
Linera Security Bounty
Instant bug bounty payouts in milliseconds. No middlemen, no delays, no fees. Built on Linera.
Updates in this Wave
Wave 2 Updates - What We Delivered
 
Live Platform: https://app.bug3.io
 
COMPLETED:
 
Infrastructure & Deployment:


Production platform on Hetzner dedicated server (99.9% uptime)
Nginx reverse proxy with SSL/TLS encryption for all endpoints
Linera SDK 0.16.0 with native GraphQL integration
Sub-250ms query latency verified via Performance Monitor widget
5 active bounty programs managing $50M+ in rewards
4 submissions processed successfully end-to-end
 
Frontend Development:
Migrated from basic HTML to React 18 + TypeScript + Vite
Deployed on Vercel with automatic HTTPS
Dark theme UI built for security researchers
Login/logout workflow with Hunter/Admin role sessions
Wallet connection mockup (UI ready for Linera wallet integration)
Real-time Performance Monitor showing live latency metrics
Filtering by status, severity, and contract address
Fully responsive across desktop and mobile
 
Core Features Built:
Bounty creation with custom reward pools and severity tiers
Vulnerability submission with proof-of-concept uploads
Owner verification system (approve/reject submissions)
Instant payout claims leveraging Linera sub-second finality
Real-time state updates via GraphQL subscriptions
On-chain immutable audit trail
 
Documentation:
Architecture design and technical decisions documented
Wave 3 roadmap with timeline
Security policy and disclosure guidelines
Setup guides for deployment
 
IN PROGRESS (80% complete):
 
Webhook Notifications:
Email subscription interface deployed
Event infrastructure ready
Delivery engine with retry logic: 2-3 weeks
 
Pilot Project Onboarding:
Platform production-ready and stable
Active outreach to Linera ecosystem projects (GoGoCash, XFighterZone, QuickPoll)
5 operational test programs demonstrating full functionality
Goal: 3-5 pilots in next 4-6 weeks
 
KEY ACHIEVEMENT:
 
Production platform proving Linera microchains enable instant finality for security workflows. Each bounty on isolated microchain eliminates congestion - architectural advantage over traditional platforms (HackerOne/Immunefi: 21-45 days) and L1-constrained alternatives (1-3 days). Performance Monitor displays live <250ms metrics, transparently verifying instant coordination claims.
 
TECHNICAL HIGHLIGHTS:
 
Authentication: Complete login/logout flow with role-based sessions (Hunter/Admin). Wallet connection mockup ready - UI components prepared for Linera browser extension integration (estimated 2-3 weeks when available). Demonstrates full auth workflow while unblocking deployment.
 
Microchain validation: 5 concurrent programs with zero interference. Predictable WASM execution, parallel scaling proven.
 
ADJUSTMENTS:
 
Delivered core platform for Wave 2. Prioritized production stability over feature quantity. Webhooks at 80% (non-blocking for core workflow).
 
Platform production-ready. Test complete bounty lifecycle at app.bug3.io - Performance Monitor shows real-time <250ms proof.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Agora
Hidden
Agora
Gamified prediction markets with sub-second finality on personal microchains
Updates in this Wave
🔥 AGORA – WAVE 2 SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
📌 WHAT IS AGORA?
Agora is a real-time prediction market on the Linera blockchain. Users create markets, stake tokens on outcomes, and trade with sub-second settlement. Each market runs on isolated microchains for parallel scaling.
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
🚀 WAVE 2: CONWAY TESTNET INTEGRATION
✅ Chain ID: 134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
✅ App ID: 884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905
✅ Validators: validator-1 → validator-4
✅ Wallet balance: 100 tokens
✅ 11 blocks created on real Conway nodes
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
🛠️ TECH STACK
• Smart contracts: Linera SDK 0.15.6, Rust, Wasm, GraphQL
• Frontend: React 18, TypeScript 5.5, Vite, Zustand, TailwindCSS
• Backend: async-graphql, <50 ms query latency, real-time subscriptions
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
✨ COMPLETED FEATURES
🎯 Market Creation: custom questions, outcomes, deadlines, on-chain storage, automatic microchain assignment
🛒 Marketplace: live market browser, filters, search, real-time phase indicators
💰 Wallet Integration: Conway wallet import, balance display, IndexedDB persistence, chain ID verification
🎲 Predictions: token-staked predictions, commit-reveal security, real-time odds & payout calculation, claim winnings
🎮 Gamified Interface: leaderboard, achievements, weekly challenges, Confidence Flip game (Brier scoring)
👤 User Profile: history, ROI, win/loss ratio, portfolio tracking, badges
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
🔍 LIVE PROOF
Test Market: “btc to 150k ?” (ID 0)
Stored on real Conway validators with verifiable blocks.
 
Verification commands:
linera wallet show
curl http://localhost:9000
 -d '{"query":"{ listMarkets { marketId question } }"}'
 
All interactions (create, predict, resolve) write immutable data to the Conway testnet.
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
🏆 KEY ACHIEVEMENTS
✅ Real Conway integration (not simulated)
✅ 11 live blocks created
✅ Permanent on-chain market storage
✅ Real-time UI connected to validators
✅ <50 ms GraphQL latency
✅ Zero contract panics
✅ Full marketplace UI + game leaderboard
✅ Cross-chain messaging implemented
 
━━━━━━━━━━━━━━━━━━━━━━━━━━
 
🎥 DEMO & LINKS
Video: https://youtu.be/iJ7ZOIszwXg
 
GitHub: https://github.com/mohamedwael201193/agora
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
devmo
devmo
If you have any questions for the judges, please comment here.
Submit
 
1
InsightFlow
Hidden
InsightFlow
InsightFlow is an AI-powered truth engine built on Linera microchains
Updates in this Wave
In this wave, InsightFlow evolved from a prototype concept into a fully functional microchain-powered fact oracle with automated market generation. We built three core Linera applications — EventChain, MarketChain, and ReputationChain — and connected them using cross-chain messaging to create a real-time truth-verification pipeline.
 
The AI Worker was integrated with multi-source monitoring (news APIs, social data, RSS feeds) to detect breaking events, generate structured claims, and send them to the EventChain. We implemented the full claim lifecycle: claim submission → confidence scoring → multi-source evidence attachment → on-chain publishing.
 
On the frontend, we developed a real-time dashboard built with React + Tailwind that displays live events, confidence indicators, evidence summaries, and auto-generated market cards. Each verified claim triggers automated market creation on the MarketChain, enabling users to vote, stake, and track probabilities in near-real time.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
XFighterZone Linera Microchains
XFighterZone Linera Microchains
Real-time esports & prediction metaverse powered by Linera Microchains.
GitHub
Updates in this Wave
Multiplatform, UI/UX improvements (Friend List, Hero System)
Status: ✅ Completed
Core Architecture
Xfighter-Leaderboard Integration - Cross-app real-time communication
Real-time Ranking System - Dynamic score calculation & cross-chain queries
Enhanced Multi-Queue Architecture - 150 high-priority + 500 low-priority slots → Optimized large request throughput
Enhanced Monitoring & Recovery - Real-time queue metrics, detailed logging, and full state restoration
 
Advanced Tournament System
Leaderboard Snapshot & Deterministic Bracket Generation
Progressive Rounds: Quarterfinals → Semifinals → Finals & Dedicated recordTournamentScore operations
 
Gameplay & Social Features
Multiplatform Support (Windows & macOS)
Friend System & New Hero Keylsey
Normal & Ranked competitive modes
Docker easy for testing system
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
8 pt
Grant
0 USDC
 
2
Chillie
Chillie
A decentralised video stream platform. Roadmap: video meeting->podcast->game streaming
GitHub
Updates in this Wave
Now there is a custodial in app wallet, users are able to deposit token and spend in app, or receive tipping and withdraw. We also implemented user tiers to unlock different permission of types of streaming room they can host and percentage of tipping which goes to their wallet. And new smart contract has been deployed to test net.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
LineraRWA
LineraRWA
LineraRWA brings real-world assets on-chain through fractional ownership and Linera microchains.
GitHub
Updates in this Wave
Updates video - https://drive.google.com/drive/u/0/folders/1RPRhJnifLpTG_hfED_5aX_BjLx-nWik8
 
 ✅ Advanced Analytics Dashboard
Portfolio value tracking with percentage change indicators
Monthly income metrics with trend analysis
Average APY calculation and comparison
Income history charts (6-month visualization)
Asset performance tracking with individual metrics
Portfolio diversification breakdown (Real Estate, Commercial, Residential)
Risk analysis metrics (Volatility, Sharpe Ratio, Max Drawdown, Beta)
Time range selector (7d, 30d, 90d, 1y views)
 
 
✅ Marketplace with Order Book
Real-time order book display (Buy/Sell orders)
Price ticker with 24h change percentage
Quick trade panel for instant transactions
Recent trades history with timestamps
My Orders section with status tracking (Pending, Partial, Filled)
Limit order placement interface
Order cancellation functionality
Spread calculation and display
 
✅Real-time Notifications System
Notification bell with unread count badge
Income alerts (rental income received)
Trade notifications (order filled, executed)
Price alerts (significant price changes)
Governance updates (new proposals, voting deadlines)
System notifications (feature updates)
Mark as read/unread functionality
Click-through navigation to relevant pages
Time-based formatting (Just now, 5m ago, 2h ago, etc.)
Governance Portal
Voting power display based on token holdings
Active proposals with deadline countdown
Past proposals with results (Passed/Rejected)
Proposal types (Management, Financial, Capital)
Real-time vote tracking with progress bars
Vote casting interface (For/Against)
Quorum tracking and deadline management
Proposal details and descriptions
Vote percentage calculations
 
 ✅ Enhanced Smart Contracts
DistributeRentalIncome operation - Proportional income distribution to all owners
CreateProposal operation - Governance proposal creation with metadata
Vote operation - Voting mechanism with power tracking
Income history tracking - Historical income records per asset/owner
 - Proposal management - Storage and querying of proposals
Vote tracking - Prevent double voting, deadline validation
New message types - Income distribution, proposal creation, voting events
Query endpoints - Income history, proposals, individual proposal details
 
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Linera Mine
Hidden
Linera Mine
⛏️ Build trust, trade blocks, and mine the future of AI agents! 💎
Updates in this Wave
⛏️ Wave 2 Update: The On-Chain Awakening
Welcome to Wave 2 of Linera Mine!⚡ This is the moment everything shifts. The simulation phase is behind us—our system is now plugged directly into the Linera blockchain core. Chronos has evolved from a conceptual prototype into a fully operational, on-chain prediction marketplace.
 
🧱 What We Achieved in Wave 2
 
💰 Real Wallet Transactions Are Live
 
Players can now connect their native Linera wallets and trade using real, verifiable, on-chain transactions.
No mock actions, no placeholders—just seamless, blockchain-secured execution.
 
🔮 Oracle Feeds for Trustless Data
 
To achieve fair market outcomes, we integrated decentralized oracle feeds delivering live, tamper-resistant data.
These oracles ensure transparency, verifiability, and trust in every market’s resolution.
 
🚪 Cross-Chain Bridges Have Arrived
 
Our multi-world vision is officially in motion.
We constructed the first cross-chain bridges, enabling interoperability and setting the foundation for multi-chain liquidity, asset transfers, and future expansions beyond Linera.
 
⚙️ Economic Engine Reinforced & Secured
 
The core economic engine has been rebuilt for performance and resilience:
 
Gas costs optimized for every major on-chain operation
 
Liquidity pools & AMMs added for superior price discovery and continuous liquidity
 
Multi-sig governance protection applied to critical administrative functions
This ensures fairness, efficiency, and long-term protocol stability.
 
🏁 Status: Transformation Complete
 
Linera Mine is no longer a simulation.
It’s now a fully-on-chain prediction marketplace, alive within the Linera universe—tested, validated, and powered by decentralized infrastructure.
The engine is built.
The systems are live.
The awakening has begun.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
MicroChess
MicroChess
Decentralized on-chain chess using Linera microchains for secure, transparent gameplay.
GitHub
Updates in this Wave
✅ Wave 2 Updates
During Wave 2, we delivered all promised features and improved the overall functionality and user experience of MicroChess.
 
⚡️ Live Leaderboard with Real-Time Updates:
A fully functional live leaderboard was implemented using Supabase Realtime. Player ratings, match results, and new players now update instantly without refreshing. This fulfills our goal of making in-game fields dynamic and interactive.
 
⌛️ Real-Time Dynamic Game Fields:
We added realtime updates across the platform, including live total game count, automatic profile sync, and instant updates to match metadata. Game progress and player stats now feel immediate and consistent.
 
🖥️ Improved UI/UX for Chess Gameplay:
We refined layout stability, improved responsiveness, and enhanced the visual clarity of the board and interaction flow to create a smoother experience.
 
🔥 Major Croissant Wallet Upgrades:
Wallet interactions are significantly more stable on testnet-conway. Improvements include better connection reliability, smoother transaction flow, fewer disconnect issues, and more consistent communication between the frontend and client logic.
 
♳ Bug Fixes, Stability Improvements & API Enhancements:
We stabilized realtime channels, improved data fetching reliability, fixed multiple UI syncing issues, and refined API responses for the Croissant Wallet. These updates make MicroChess far more stable for everyday use.
 
🚀 How to Test MicroChess
Follow these steps to try MicroChess on testnet-conway. Note: Random matches require two players to be online at the same time, so they may not always pair due to low traffic. Friendly matches always work.
 


Install the Croissant Wallet:
Download the latest v0.2.1-testnet release of the Croissant Wallet<a href="https://github.com/Nirajsah/croissant/releases/tag/v0.2.1-testnet" target="_blank" rel="noopener noreferrer nofollow"></a>, extract it, and load it as a browser extension.
 
Create a New Wallet:
Open the extension and create a new wallet (takes a few seconds).
 
Connect to MicroChess:
Visit https://microchess.io, click Connect, and approve the request in your wallet.
 
Start Playing:
Click Play Now. Choose Random Match (affects ELO) or Friendly Match (no rating changes).
 
Assigning New Chain:
If new chain info appears, click Assign and approve it in the wallet. Refresh afterward to start    playing.
 
Update Your Profile (Optional):
To show your name on the leaderboard instead of your public key, open the left sidebar (Ctrl+B, Cmd+B, or the bottom-left menu), update your name, save, and start a Random Match.
 
Reporting Issues:
If you see bugs, UI problems, wallet issues, or unexpected behaviour, please let us know immediately. Your feedback is extremely valuable.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
7 pt
Grant
0 USDC
 
3
AgentPay
AgentPay
Lightning-fast payments for the AI agent economy
GitHub
Updates in this Wave
This wave introduces the first fully functional prototype of AgentPay, the real-time payment layer for autonomous AI agents built on the Linera microchain architecture. The updates focus on architecture refinement, improved transaction performance, interoperability improvements, and substantial progress toward developer-readiness.
 
Core Payment Engine Implementation
 
We completed the first working version of the microchain-native payment engine.
Key capabilities added:
 • Instant, deterministic payment execution
 • Parallelized microchain processing
 • High-frequency micro-transaction support
 • Removal of mempool delays and congestion risks
This establishes the foundation for real-time agent settlement.
 
Agent Interaction & Transaction API
 
A new API layer now allows agents to initiate, receive, and verify payments programmatically.
Updates include:
 • Simplified payment endpoints
 • Message-passing interface for agent-to-agent communication
 • Structured response models for deterministic outcomes
This enables seamless integration with autonomous agent frameworks.
 
Microchain Optimization & Storage Layout
 
We refactored storage structures for improved:
 • State access speed
 • Execution consistency
 • Parallel task scheduling
This significantly enhances scalability across many active agents.
 
Developer Documentation (In Progress)
 
We added early-stage documentation explaining:
 • How the payment engine works
 • How agents can integrate
 • Microchain lifecycle
This is being expanded into a full developer onboarding guide.
 
Benchmarking & Stress Testing
 
Initial stress tests demonstrate strong early performance:
 • Sub-second settlement
 • Predictable throughput under load
 • Zero performance degradation under high concurrency
Full benchmarks will be published in the next wave.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Asa
Hidden
Asa
Crosschain lending
Updates in this Wave
New project - Backend and frontend
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Drawn
Drawn
Stay Drawn in
Deliverable
Updates in this Wave
Established the creative and technical blueprint of the game ensuring that as development begins, the team has clear direction on user interaction, blockchain integration points, and game economy logic.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Tempura
Hidden
Tempura
Tempura is a decentralized webtoon platform on Linera empowering creators with fair monetization.
Updates in this Wave
This is my first time partipation so my first submission as well to linera. 
I have had an old template of webtoon inspired lovable app with changes(UI/UX) that i wish are implemented by webtoon, after discussing it with artists on webtoon.
Now i built the app on top of Linera targeting readers and artists. 
It is still a prototype n i am working on it continuously 
pls check out the demo on my repo since i uploaded the one without voiceover
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Babalu
Babalu
Team Babalu embodies dedication, creativity, and consistent excellence.
Deliverable
Updates in this Wave
Wave Updates Description:
In this Wave, Team Babalu focused on refining our project workflow and enhancing deliverables with improved structure and clarity. Key updates include:
 
Project Organization
Process Improvements
Technical Enhancements
Problem-Solving Approach
Documentation & Deliverables
 
Deliverable URL: https://project-babalu-demo.com/deliverable
 
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Lightweight Linera dApp for GM messages
Lightweight Linera dApp for GM messages
Lightweight Linera dApp for GM messages, owner lookups, and targeted sends on Conway testnet
GitHub
Updates in this Wave
Chain Event Subscriptions Upgrade
The first version's polling-based responses have been replaced with chain event subscriptions, enabling the frontend to generate bubble displays and real-time reply pop-ups for your GM messages, greatly enhancing interactivity.
 
Sending Leaderboard
Added a leaderboard for GMIC sends.
 
24-Hour Cooldown Toggle
Implemented a switch for the 24-hour cooldown period.
 
Invitation Feature
Added invitation functionality.
 
Dynamic Wallet Integration
Incorporated Dynamic wallet features into the frontend.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
CHRONOS
Hidden
CHRONOS
High-speed prediction markets powered by Linera blockchain.
Updates in this Wave
📢 Wave Update — Chronos Markets
 
In this wave, we moved from a fully designed frontend into preparing Chronos Markets for real blockchain execution on the Linera network, setting up all the foundations needed for on-chain trading, market resolution, and autonomous agent activity.
 
🛠️ Frontend Architecture Completed
We finalized the entire UI layer using React 19 + TypeScript, built a fully responsive layout with TailwindCSS, and configured a smooth development workflow through Vite + WSL. The platform now has all core pages fully implemented:
 
🏠 Home — Trending markets + platform stats
📊 Markets — Filterable grid of all prediction markets
💹 Market Page — Interactive order interface & charting
💼 Portfolio — Live balance + P&L tracking
🧱 Create Market — Dynamic market creation flow
🤖 Agent Hub — Deploy & manage autonomous trader agents
 
🔗 Linera Wallet Integration
We integrated the Linera Wallet with full connect/disconnect functionality, session handling, and a dedicated wallet context provider, paving the way for:
💰 real wallet transactions
📜 smart-contract calls
⚖️ on-chain market resolution
This completes the necessary groundwork for enabling orderbooks, liquidity pools, AMMs, and multi-sig interactions in the next waves.
 
📈 Data, Charts & Interactivity
We added real-time UI elements to mirror the final blockchain experience, including:
📉 market charts powered by Recharts
🏃 live ticker animations
📡 mock oracle feeds covering 10 markets across Politics, Crypto, Sports, Tech, Finance & Culture
These components are structured to plug directly into real oracle data as soon as contracts go live.
 
🤖 Agent Deployment System
We built a complete agent deployment modal with validation, UI state control, and integration hooks, preparing Chronos for fully automated trader agents that will execute strategies using on-chain data.
 
⚙️ Blockchain Integration Preparation
While the core smart contracts will be integrated in the next wave, this update prepared the frontend for:
🧩 Linera orderbook interactions
🪙 liquidity pool/AMM logic
🌉 future cross-chain bridging
🔐 multi-sig wallet flows
All UI/UX flows and TypeScript schemas are aligned with the planned Linera contract architecture, ensuring a clean plug-in during the integration phase.
 
🧪 Ready for Testnet Connectivity
The entire platform is now wired for connecting to the Linera testnet, enabling end-to-end testing of:
✔️ market creation
✔️ order placement
✔️ settlement logic
✔️ gas-optimized executions
✔️ oracle-driven market resolution
 
🚀 Chronos Markets is now fully architected, feature-complete on the frontend, and ready for blockchain connectivity, real transactions, and agent-based trading in the upcoming wave.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Microbet
Microbet
First real-time price prdiction game.
GitHub
Updates in this Wave
Sucessfully integrated Linera client in Browser, publishedMVP version with live link. Added mobile-friendly design.
 
The logic works as follows:
The player claim a wallet through the Linera client, along with 5 tokens so they can start placing bets right away. There is also an option to add these tokens by clicking on the wallet.
 
On the server, two Linera service nodes are running — one for BTC bets and one for ETH bets. Additionally, there is a script on the server that queries data and sends it to Supabase, as well as an orchestrator that closes and resolves rounds every 5 minutes.
 
Live demo: https://microbet-linera.xyz/
 
Frontend code: https://github.com/egorble/MicrobetFront
Smart Contracts code: https://github.com/egorble/Microbet
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
10 pt
Grant
0 USDC
 
3
chenxiaosheng
chenxiaosheng
WEB3R is building a decentralized AI network
Deliverable
Updates in this Wave
WEB3R is building a decentralized AI network, forging a future of open, trustworthy, and collaborative intelligence
 
 
Milestone
0points
 
Grant
0 USDC
 
0
PulseMarkets
Hidden
PulseMarkets
Markets that move at the speed of thought.
Updates in this Wave


Implemented the core Market Microchain contract, including market creation, betting logic, and event emission.
 
Added real-time updates using Linera GraphQL subscriptions to stream market events instantly to the frontend.
 
Built the first version of the Dashboard UI with live odds, sparkline charts, and active market listing.
 
Implemented Market Detail Page, showing current odds, bet form, live price movements, and trade volume.
 
Added a mock wallet connection flow to simulate user interactions and test end-to-end functionality.
 
Integrated market event handlers to ensure the UI updates automatically when new bets are placed.
 
Created reusable UI components (cards, buttons, charts) optimized for the PulseMarkets neon–cyber theme.
 
Deployed the MVP microchain and performed basic end-to-end testing across contract + frontend.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
LineraOdds
LineraOdds
Real-time sports bets powered by microchains
GitHub
Updates in this Wave
Updated contract arquitecture from "Temporary Chain" aproach to a single contract set
Adding bet feature with cross-chain messages
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Blackjack on Microchains
Blackjack on Microchains
The Real-Time Blackjack Experience on Linera: Fast as Web2, Transparent as Blockchain Should Be
GitHub
Updates in this Wave
Creating the user-facing application, delivering a fully functional single-player experience that proves real-time on-chain gaming is possible.
 
🎨 Flutter Web Development
Build web interface
Create reusable component library: cards, betting controls, game buttons
Intuitive UI that provides immediate visual feedback
 
🔗 Web3 Integration Layer
Create robust contract interaction layer with error handling and retry logic
Enable seamless communication between Flutter UI and Linera smart contracts
 
🎲 Single-Player Mode Launch
Complete gameplay flow: connect wallet → load tokens → place bets → play hands
All actions execute on-chain with instant finality
Every card deal and payout happens through smart contract calls
Player experience feels as smooth as centralized platforms
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Blink Markets
Hidden
Blink Markets
Lightning-fast prediction markets on Linera's revolutionary microchain architecture
Updates in this Wave
Wave 2 Submission — Linera SDK 0.15.6 (Conway Testnet)
🚀 What shipped this wave
• On‑chain core v1: production‑ready contract + service compiled with SDK 0.15.6, zero panics, typed errors.
• Realtime GraphQL: queries + subscriptions for live state; UI auto‑updates without refresh.
• Cross‑chain messaging: deterministic workflows across personal microchains.
• Wallet flow: connect → authenticate → execute ops; balances and tx history surfaced in‑app.
• Deterministic RNG / sequencing where needed; state machine guards and pause/resume switches.
• Performance HUD: block height, latency, and app/chain IDs visible for judges.
• DevOps: deploy_conway.sh using --required-application-ids, Docker compose, seed + smoke tests.
🧩 Architecture highlights
• Microchain‑per‑domain design: isolation, parallelism, and predictable throughput.
• Service layer exposes typed endpoints; frontend uses an SDK client with retry/backoff + idempotency keys.
• Event‑driven UI with optimistic updates, server reconciliation, and graceful rollback on failure.
• Storage views organized for O(1) hot paths, indexed lists for history and leaderboards.
🛡️ Safety & integrity
• Access control: caller authentication and role gates; replay protection and nonce checks.
• Invariant checks on every state transition; slippage/limit guards for value‑moving ops.
• Comprehensive tests: unit, integration, and cross‑chain simulators; CI verifying WASM, schema, and ABI.
⚡ Proof it’s live
• Deployed on Conway testnet with Linera SDK 0.15.6.
• App IDs and chain IDs displayed in the app header and logs; each action increments block height in realtime.
• GraphQL subscriptions stream state changes visible to judges within the UI Performance HUD.
📈 What this enables now
• Sub‑second, Web2‑like UX with fully on‑chain finality.
• Transparent audit trail: every mutation emits events; history pages reconstruct flows end‑to‑end.
• One‑click local repro: clone → run.bash → seeded demo ready in minutes.
🎯 Wave 3 focus
• Expand mutation surface for advanced user flows.
• Hardening and soak tests at scale; chaos scenarios and recovery drills.
• Optional oracle/attestation module and governance hooks.
• Polished demos and deeper analytics dashboards.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
LineraBet
LineraBet
Experience the next evolution of online casinos.
GitHub
Updates in this Wave
This wave transforms LineraBet from a front-end prototype into a fully-featured, multi-game on-chain casino with integrated wallet support. The platform now includes three complete casino games running with Linera smart contracts and live blockchain connectivity.
• YouTube Demo: https://youtu.be/bJLw07WE0bc
• Live App: https://linerabet-ipfe.vercel.app/


Smart Contracts (Linera Testnet Conway)
 
Three on-chain game logic contracts manage all gameplay, betting, and settlement:
a) Blackjack (contracts/blackjack/)
• Full betting flow with hit/stand mechanics
• 20-second turn timers for player actions
 
b) Baccarat (contracts/baccarat/)
• Player / Banker / Tie bets
• Natural hand detection, push scenarios
• Banker commission and payout handling
 
c) Roulette (contracts/roulette/)
• American roulette wheel
• Full bet coverage: straight-up, color, parity, ranges, dozens, columns
 
Shared Contract Features:
• Multi-deck support for card games (configurable 6–8 decks for baccarat)
• Dynamic payout calculations (e.g., 8:1 tie bets, banker commission)
• GraphQL interface for frontend integration
• State persistence via Linera Views (e.g., RegisterView, LogView for history)
 
Deployed Contract Addresses (Testnet Conway):
• Baccarat: d52899cd1558f88e739daf59bb24d50da5c6b179d27e38d0d6f70c569bfe04b2
• Roulette: f56b382e9ca70912a0a31b28c654525a534318b6d6d3d19387272445c5042586
• Blackjack: e9d1d166e03b05b053dbc7f7aaa136e55159d7dea6c65ac361b7230c7758cc1b
 
Dynamic Wallet x Linera Integration
 
Core Components:
• DynamicSigner (src/lib/dynamic-signer.ts): Bridges Dynamic wallets to Linera
• LineraAdapter (src/lib/linera-adapter.ts): Singleton managing Linera connections
 
Key Capabilities:
• EIP-191-compatible message signing to satisfy Linera requirements
• Multi-step flow: wallet connection → chain connection → app connection
• Real-time connection state via React hooks
• Robust error handling for network issues and wallet disconnects
• Supports multiple Ethereum wallet types through Dynamic’s connectors
 
Frontend Application (React + TypeScript + Vite)
 
Baccarat (src/pages/baccarat.tsx):
• Animated dealing and reveal
• Live hand value and naturals
• Correct banker commission logic
 
Roulette (src/pages/roulette.tsx):
• Physics-style wheel animation
• Full betting table with chips and visual feedback
• Spin history and result animations
 
Blackjack (src/pages/blackjack.tsx):
• Turn-based play with timers
• Hit/stand decisions and dealer AI
• Bust detection and payouts
 
Blockchain Integration Layer
• GraphQL-based interaction with Linera contracts
• Real-time sync between UI and on-chain state
• Operation scheduling via Linera mutations
• Persistent on-chain game history and balances
• Bet validation, insufficient-funds checks, and automatic round resets
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Roxy
Roxy
Roxy: a real-time crypto portfolio game with a witty raccoon-walrus mascot and live markets.
GitHub
Updates in this Wave
Application ID: b69f00dde98964b2d09b4aad4c8a7162c81fe19dc176e9c1431dc8ab1b87e03c
 
 
During this wave we focused on maturing the core smart-contract functionality and improving the overall onboarding and demo experience on the frontend. Key updates and deliverables:
 
Smart-contracts & backend
 
Contract feature expansion—Added new microchain-aware features to the Linera contracts, expanding the prediction/point-trading logic and guild mechanics to support more complex gameplay flows.
 
Enhanced microchain integration—Implemented microchain coordination improvements so markets, players, and guilds operate more robustly on their own chains while synchronizing via the Master Game Chain.
 
Docker template—Added a Docker template to simplify local development, testing, and reproducible deployments for the contract runtime and test harness.
 
New contract functionality—Introduced additional operations and state fields (e.g., refined market lifecycle handling, fee distribution refinements, expanded prediction periods) to better match the intended game mechanics.
 
Automated tests—Wrote and ran comprehensive contract tests (unit + integration + fuzz test) covering registration, market creation/trading, predictions (daily/weekly/monthly), guild operations, rewards/penalties, and edge cases. These tests increase confidence in contract correctness and upgrade safety.
 
Technical walkthrough—Produced a detailed architecture and implementation walkthrough to explain the new contract changes and rationale: https://youtu.be/1MY2TVKLZUg
 
Frontend & demo
 
Public demo deployed—updated frontend demonstrating the new contract behaviors and UX improvements: https://roxy-seven.vercel.app
 
Easy onboarding—Implemented an in-app onboarding flow to help new players create accounts, claim starter points, and learn core gameplay mechanics quickly (improves demo conversion and developer testing).
 
Frontend visibility of contract changes—The UI now surfaces new contract-driven concepts (markets, fees, guild pools, prediction periods) in a way that’s easy to demo and validate against the contract tests.
 
Deliverables/Links
 
Contract architecture walkthrough: https://youtu.be/1MY2TVKLZUg
 
Live frontend demo: https://roxy-seven.vercel.app
 
Docker template and tests included in the contract repo (see branch for details; available on request)
 
Validation & testing
 
Contract tests executed locally and via the integration test harness (single-chain tests, market and prediction flows).
 
Fuzz tests executed 
 
Manual validation was performed via the frontend demo to verify UI-driven flows (registration, claim reward, create/buy/sell markets, guild contributions, and prediction resolution).
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Real-Time Onchain Counter
Hidden
Real-Time Onchain Counter
A microchain-based counter state synchronization using Linera's real-time architecture.
Updates in this Wave
Built a Real-Time Onchain Counter demonstrating Linera's microchain capabilities with instant state synchronization. This Wave 2 submission includes:
 
**Template Compliance**: Migrated entire project to use the official Linera buildathon template structure to meet Wave 2+ requirements, including proper Dockerfile, compose.yaml, and run.bash configuration.
 
**Functional Linera Contract**: Implemented a working Rust contract using Linera SDK 0.15.5 with proper Contract and Service trait implementations. The contract handles increment/decrement operations and compiles successfully to WASM target.
 
**Professional Frontend**: Created a modern web interface with gradient design, smooth animations, and intelligent fallback mode. The frontend works both with and without the Linera backend service, ensuring reliable demonstrations.
 
**Cross-platform Support**: Ensured compatibility across Windows, macOS, and Linux with proper batch files and shell scripts. Includes Docker containerization for consistent deployment.
 
**Demo Capability**: Built intelligent fallback system that allows the application to work in demo mode when backend services aren't running, making it perfect for presentations and testing.
 
**Key Features**:


✅ Template-compliant structure
✅ Functional Linera contract compilation
✅ Real-time counter interface
✅ Docker deployment support
✅ Cross-platform compatibility
 
**Deliverable URL**: https://github.com/ashitosh07/Real-Time-Onchain-Counter
 
The application demonstrates the foundation for real-time blockchain applications on Linera's microchain architecture, with plans to evolve into a Real-Time AI Prediction Exchange in future waves.
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Fairdrop
Hidden
Fairdrop
Fairdrop: descending-price auctions with uniform clearing; everyone pays the same fair price.
Updates in this Wave
Smart Contract Implementation
✅ Basic Auction Contract (basic-auction/)
Descending price (Dutch auction) mechanism with automatic price reduction
Auction initialization with validation (start_price, floor_price, decrement_rate, etc.)
Bid placement with quantity tracking
Scheduled auctions (future start times)
Auction status management (Scheduled → Active → Ended)
Current price calculation based on elapsed time intervals
GraphQL service layer for queries and mutations
 

### Frontend Implementation
 
✅ Linera React Client Library
  - Custom React Hooks:
  - useLineraClient() - Main client access with state management
  - useLineraApplication() - Application-specific operations
  - useWalletConnection() - Wallet authentication

Provider Architecture:
  - LineraProvider for blockchain connection management
  - Automatic WASM file detection and copying
  - Read-only mode with optional wallet connection
 
✅ Web Application Components
Core UI Components:
  - AuctionCard - Live auction display with real-time updates
  - WalletConnect - Wallet authentication UI
  - PriceDisplay - Dynamic price visualization
  - AuctionTimer - Countdown and interval tracking
  - CosmicLoading - Loading states
Landing Page Sections:
  - HeroSection - Value proposition
  - ProblemSolution - Problem statement and solution
  - Features - Platform capabilities showcase
  - Roadmap - Development timeline
  - Vision - Long-term goals
  - HowItWorks - User education
 
⚠️ Cross-Chain Query Challenge
Issue: Cannot directly query application state on the creator chain from subscriber chains
 
⚠️ Stage 1 Limitations
No actual token transfers (bid tracking only, no payment)
No refund mechanism for overbids
No auction finalization/settlement logic
No claim functionality for winning bidders
 
 
Milestone
0points
 
Grant
0 USDC
 
0
MazeRunner
MazeRunner
MazeRunner is a Web3 arcade concept built on the Linera blockchain.
Deliverable
Updates in this Wave
During this wave, MazeRunner advanced from just a Figma design to a fully rendered 2D game, built using Phaser for the game engine and React for the frontend interface. The game logic, UI overlays, and core mechanics were implemented to create an interactive and visually engaging experience. Onboarding is handled by integrating the Dynamic SDK, allowing players to connect their wallets and have their addresses automatically used for all contract interactions. This ensures that every player’s progress and rewards are uniquely tied to their blockchain identity.
 
On the contract side, it has been connected to the frontend via a GraphQL API, exposing key operations for gameplay. Player scores can now be submitted to the blockchain after each level.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Draw Duel
Hidden
Draw Duel
Draw. Duel. Dominate.
Updates in this Wave
🎨 Duel Draw: Wave Update 
 
We’ve made major progress transforming Duel Draw into a fully on-chain, real-time competitive drawing game powered by Linera microchains and AI scoring through an oracle system.
 
✅ Fully On-Chain 1v1 Drawing Battles
A complete challenge system is implemented—players can initiate, accept, or reject duels. Each match spawns a temporary 2-owner game microchain, giving isolated execution and ultra-low latency.
 
✅ Real-Time Drawing Sync
A stroke-based engine enables live multiplayer drawing with:
 
<500ms stroke broadcasting
Sequence ordering
Out-of-order buffering
Update rate limiting
All handled via cross-chain messaging.
 
✅ AI Judging via Oracle (Google Gemini)
We built a full oracle flow:
 
Game Chain → Oracle Chain → Oracle Client → Gemini → back on-chain
The AI scores drawings on Creativity, Prompt Adherence, and Artistic Quality, returning structured results the game chain uses to determine winners.
 
✅ Leaderboard + Player Stats
A dedicated public leaderboard chain ranks players using win rate, total games, and average score. Each player chain tracks tokens, challenges, games, and NFTs.
 
✅ Token Economy & Rewards
Automatic on-chain rewards:
🥇 Winner: 100 tokens
🥈 Loser: 25 tokens
🤝 Tie: 50 each
🏳️ Forfeit win: 75
 
✅ NFT Minting
Players can mint their final drawings as NFTs with metadata (prompt, opponent, scores). Minting costs 10 tokens.
 
🧩 UI Attempt
We also experimented with a frontend/UI, and have attached screenshots in the demo.
It works but is not fully polished yet, so we kept the focus on completing the on-chain architecture & oracle pipeline first.
 
⚙️ Current Gameplay Flow
1️⃣ Challenge another player
2️⃣ Game chain automatically created on acceptance
3️⃣ 90-second real-time drawing battle
4️⃣ AI judging through the oracle system
5️⃣ Winner decided + tokens awarded
6️⃣ Leaderboard updated, game chain closes
 
 
Milestone
0points
 
Grant
0 USDC
 
0
Poker club
Poker club
We've integrated PokerNow directly into Discord. Now players can hone their poker skills for free.
GitHub
Updates in this Wave
We integrated the PokerNow.club application directly into Discord, allowing members to create and join poker tables inside the server without leaving the platform. In addition, we developed a leaderboard module that tracks wins, losses, and chip balances for all participants. This makes training sessions seamless, keeps the community engaged, and adds transparency and motivation through performance tracking.
Deliverable URL: https://github.com/LarisaD6/discord-pokernow-integration
 
 
Milestone
0points
 
Grant
0 USDC
 
0
OddsMaker AI
OddsMaker AI
Autonomous Market Maker & Manager
Deliverable
Updates in this Wave
We successfully proved that an AI agent can autonomously create and fund a prediction market on Linera's microchain architecture.
 
Core Objective: Prove an AI can autonomously create and fund a prediction market on Linera.
 
Technical Deliverables:
 


MCP Client Skeleton
   · Established the foundation for AI agent communication using Model Context Protocol
   · Implemented basic client structure for future AI decision-making integration
   · Created the interface for autonomous agent actions on the blockchain
Single Hardcoded Action
   · Implemented a focused market creation function that demonstrates autonomous capability
   · The agent can successfully deploy a prediction market with predefined parameters
   · Example: "Will Team A win the championship?" with initial odds and liquidity
Initial Liquidity Provision
   · Integrated with Linera's economic model to fund newly created markets
   · Implemented treasury management for the autonomous agent
   · Demonstrated end-to-end market creation and funding in a single atomic operation
Proof Log & Documentation
   · Comprehensive logging system that tracks the agent's decision process
   · Transaction verification and blockchain state confirmation
   · Detailed setup instructions and technical documentation in GitHub README
 
Key Technical Implementation:
 
· Rust-based core leveraging Linera SDK
· Microchain deployment proving the dedicated chain architecture works for autonomous agents
· MCP protocol integration establishing the framework for future AI enhancements
· Blockchain operations including contract deployment, funding, and state management
 
Demonstrated Capabilities:
 
· ✅ Autonomous market creation without human intervention
· ✅ Integration with Linera's microchain architecture
· ✅ MCP client framework for future AI expansion
· ✅ End-to-end workflow from idea to funded market
· ✅ Foundation for real-time, predictable performance
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
ChainScore
Hidden
ChainScore
ChainScore turns reputation into a public good — decentralized, fair, and incentivized.
Updates in this Wave
will update before deadline
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
FlashCast
FlashCast
Real-Time Event Derivatives
Deliverable
Updates in this Wave
Based on the judges' Wave 1 feedback, we focused this period on planning and initiating the critical Rust backend integration needed to transform FlashCast from a frontend concept into a true Linera-native dApp.
 
Progress Made:
 
· Technical Specification: Completed detailed architecture plans for the microchain market factory and prediction contract system in Rust.
· Development Environment: Set up and configured the local Linera development environment for Rust contract testing.
· Learning & Prototyping: Deep-dived into the Linera Rust SDK and began implementing the core market logic.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Minable Meme Coin protocol on Linera
Minable Meme Coin protocol on Linera
Meme token protocol with emitter & DEX enabling microchains to mine, compete, and define rewards.
GitHub
Updates in this Wave

## 🚀 Phase 2 Update — Performance Optimization & Async Refactor
 
In this phase, we focused on improving the **stability and performance** of the Minable Meme backend.
 
### ✅ What’s Improved
 

**Reduced Runtime Freezes:**  
  We cooperated with core dev team to resolve several causes of block processing freezes that occurred during runtime.  
  After optimizing concurrency handling and refactoring network requests, the Linera Meme app now runs much more smoothly on Conway.
 
**Async Refactor for Funder & Maker Backends:**  
  We replaced all blocking requests calls with **asyncio-based implementations**, enabling non-blocking HTTP communication for both the **Funder** and **Maker** components.  
  This change significantly improved backend responsiveness, reliability, and throughput under concurrent load.
 
**Better Infrastructure Stability:**  
  The updated async backend now provides stronger fault tolerance and connection recovery across distributed nodes.
 

### ⚠️ Ongoing Work
 
Despite the improvements, we are still investigating **occasional block processing stalls** under specific conditions.  
Our current focus is on analyzing message propagation and state synchronization to further eliminate these bottlenecks.
 
### 🌟 Next Steps
 

**Continue Resolving Performance Bottlenecks:**  
  We will keep analyzing and resolving the occasional block processing stalls and runtime freezes to ensure smoother and more reliable execution across all chains.
 
**Develop Meme Mining Mechanism:**  
  We will implement the on-chain Meme mining logic, allowing users to mine Meme tokens directly through microchains.
 
**Design Community Participation Model:**  
  Build mechanisms for community-driven mining participation and reward distribution, laying the foundation for a decentralized Meme ecosystem.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
0 pt
Grant
0 USDC
 
1
Propel - voted platfotm on Linera
Propel - voted platfotm on Linera
decentralized venture and forecasting platform built on the Linera Protocol blockchain.
GitHub
Updates in this Wave
Wave 2: Linera Integration & Wallet
 
Authorization in the project through a Discord account
Linera Wallet integrated into the user profile.
Established connection to the Linera blockchain.
Implemented a smart contract for token transfers.
Partially enabled creation of user votes.
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
20 pt
Grant
0 USDC
 
2
Fractal Protocol
Fractal Protocol
Live Event Predictions
Deliverable
Updates in this Wave
We have transformed our foundational single-market contract into a functional ecosystem where the resolution of a parent market automatically triggers the creation of new, conditional prediction markets on separate microchains.
 
Key Technical Deliverables Completed:
 


Implemented the SpawnHandler Contract: Developed a dedicated smart contract that acts as the central engine for creating new markets. This contract listens for resolution messages and executes the logic for spawning derivative markets.
Built Cross-Chain Messaging Logic: Successfully implemented the cross-application calls that enable a root market on one microchain to send a verified message to the SpawnHandler, containing all necessary parameters (e.g., question, outcomes, liquidity) for the new derivative market. This is the foundational infrastructure for our fractal network.
Enhanced the Core Market Contract: Updated our main Market contract to include spawning conditions. Upon resolution, the contract now automatically constructs and sends a cross-chain message, initiating the entire spawning lifecycle.
Frontend Integration & Visualization: Updated our live application to visually demonstrate this new functionality. The UI now clearly shows the market relationships, allowing users to witness a derivative market appear and interact with it immediately after a root market is resolved.
 
This milestone is a critical leap from a theoretical concept to a functional prototype. We have proven that the "fractal" structure is not only possible but operational on Linera. The successful implementation of cross-chain messaging validates that Linera's microchain architecture is the ideal substrate for building complex, interconnected, and scalable application ecosystems without compromising performance or user experience.
 
With this spawning mechanism in place, we have the functional backbone to now build out multi-market demonstrations, sophisticated UI visualizations, and AI agent integration in the coming waves.
 
Live Demo: https://fractalprotocol.netlify.app
 
Github link: https://github.com/Fmsticks2/Fractal-Protocol/tree/main
 
 
Milestone
0points
 
Previous Wave Points
1st Wave
15 pt
Grant
0 USDC
 
2
TradePulse
TradePulse
Real-time micro prediction markets powered by Linera microchains.
Deliverable
Updates in this Wave
In Wave 2, I concentrated on laying the core infrastructure of TradePulse to enable real-time, on-chain prediction markets. My goal was to connect the frontend and backend seamlessly, provide a responsive interface, and ensure that micro-markets could resolve in seconds with full decentralization. This wave was critical for establishing a foundation for future features like AI-driven odds, analytics, and multi-event scalability.
 
Key Focus:
 
Built the core architecture of TradePulse by integrating the Next.js frontend with Linera blockchain smart contracts.
 
Developed a responsive, intuitive interface using Tailwind CSS.
 
Created Rust-based Linera smart contracts to securely manage market creation, user bets, and instant settlements.
 
Implemented WebSocket streams to provide live updates of odds, liquidity, and leaderboards.
 
Achievements:
 
Successfully deployed the first live version of TradePulse.
 
Enabled real-time micro-scale prediction markets, resolving short-term events in seconds or minutes.
 
Delivered a Web2-like interactive experience while remaining fully decentralized.
 
Laid the foundation for AI odds engine, analytics dashboard, and multi-event support in future waves.
 
Challenges:
 
Managing millisecond-level WebSocket updates to ensure smooth real-time data without performance issues.
 
Designing efficient Rust smart contracts capable of handling frequent micro-event resolutions without conflicts.
 
Balancing a fast, interactive UX with decentralized, deterministic blockchain logic.)