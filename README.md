# Blink Markets - Real-Time Microchain Prediction Markets

**Don't Be Late. Be Real-Time.**

![Blink Markets](https://img.shields.io/badge/Built%20on-Linera-5CF0D1?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-0.1.0-8B5CF6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)
![Wave 1 Complete](https://img.shields.io/badge/Wave%201-Complete-28a745?style=for-the-badge)

## 🎯 Wave 1 Status: COMPLETE ✅

**Live Demo**: [https://blink-markets.vercel.app/](https://blink-markets.vercel.app/)

Wave 1 demonstrates the foundational architecture with:
- ✅ React frontend with modern UI components
- ✅ Linera blockchain integration via GraphQL
- ✅ Real-time chain status connectivity  
- ✅ Sample prediction markets interface
- ✅ Professional deployment on Vercel

See `/wave1/` folder for complete technical evidence and verification steps.

## 🚀 Overview

Blink Markets leverages Linera's revolutionary microchain architecture to create ultra-fast, fair prediction markets with JIT oracle resolution and agent-first trading. One chain per market means infinite scalability and instant settlement.

### Key Features

- ⚡ **Instant Settlement**: Sub-second finality for real-time trading
- 🔗 **Infinite Scale**: One microchain per market, unlimited throughput
- 🤖 **Agent API**: MCP-powered automated trading
- 🔮 **JIT Oracles**: Time-bounded truth with validator attestation
- 💎 **Low Fees**: Minimal gas costs on dedicated chains

## 🏗️ Built With

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **State Management**: Zustand
- **Data Fetching**: @tanstack/react-query
- **Charts**: Recharts
- **Blockchain**: Linera Microchains

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Linera CLI (optional, for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blink-markets

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📖 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Service URL (optional for Wave 1 - if unset or unreachable, UI runs in Demo Mode)
VITE_SERVICE_URL=https://your-tunnel.trycloudflare.com

# App ID (leave empty for Wave 1 faucet service)
VITE_APP_ID=

# Wallet functionality (set to "false" for Wave 1)
VITE_ENABLE_WALLET=false

# Demo mode (set to "false" for Wave 1, "true" to force mock data)
VITE_DEMO_MODE=false
```

**Wave 1 Note**: All variables are optional. The app gracefully falls back to demo mode with sample data if backend services are unavailable.

## 🎯 Architecture

### Factory Pattern
One microchain spawned per market for elastic scalability. No shared state, no bottlenecks.

### JIT Oracles
Time-bounded HTTP queries with validator attestation. Median-of-N consensus for reliability.

### Agent API
MCP-powered SDK for programmatic trading. Build bots that react faster than humans can.

## 📚 Documentation

- [Full Documentation](https://docs.blinkmarkets.io)
- [API Reference](https://docs.blinkmarkets.io/api)
- [Developer Guide](https://docs.blinkmarkets.io/developers)
- [Roadmap](/roadmap)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## 📦 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── ui/              # shadcn UI components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── stores/              # Zustand stores
└── types/               # TypeScript type definitions
```

## 🗺️ Roadmap

### Wave 1: Foundation ✅ (Oct 20–28, 2025)
- Local devnet deployment
- Basic market contracts
- GraphQL service
- Frontend with faucet wallet creation

### Wave 2: Temporary Chains � (Nov 3–12, 2025)
- Market Factory implementation
- Cross-chain messaging
- Order matching engine

### Wave 3: JIT Oracle Mesh 📅 (Nov 17–26, 2025)
- Time-bounded queries
- Validator attestation
- Median-of-N consensus

[View Full Roadmap](https://blink-markets.vercel.app/roadmap)

## 📦 Wave 1 Technical Evidence

Complete technical documentation, verification steps, and evidence files for Wave 1 submission:

**[View Wave 1 Deliverables →](https://github.com/Mr-Ben-dev/blink-markets/tree/main/wave1)**

### Evidence Files:
- `README.md` – Complete Wave 1 documentation and verification guide
- `info.txt` – System versions, timestamps, and commit hash (560c87f)
- `site_http.txt` – HTTP 200 response verification from live site
- `gql_typename.json` – GraphQL basic connectivity test result
- `gql_schema.json` – GraphQL schema introspection data
- `gql_version.json` – Backend service version information
- `smoke_test_results.log` – Automated test suite output with PASS status

### How to Run Smoke Tests:
```bash
# Default (Wave 1 - GraphQL optional)
./smoke.sh

# Force Wave 2 rules (GraphQL required)
WAVE=2 ./smoke.sh

# Override URLs if needed
SITE_URL="https://your-site.com" SERVICE_URL="https://your-tunnel.com" ./smoke.sh
```

### Optional: Quick Live Demo
```bash
# Temporarily bring up GraphQL service (not required for Wave 1)
cloudflared tunnel --url http://localhost:8080
# Copy the tunnel URL to Vercel as VITE_SERVICE_URL and redeploy
# Remove after recording; Wave 1 does not require live GraphQL
```

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website**: [blinkmarkets.io](https://blinkmarkets.io)
- **Documentation**: [docs.blinkmarkets.io](https://docs.blinkmarkets.io)
- **Twitter**: [@BlinkMarkets](https://twitter.com/BlinkMarkets)
- **Discord**: [Join our community](https://discord.gg/blinkmarkets)
- **GitHub**: [github.com/blink-markets](https://github.com/blink-markets)

## 🙏 Acknowledgments

- Built on [Linera](https://linera.io) - The first blockchain infrastructure designed for elastic scalability
- Inspired by prediction markets like Polymarket and Augur
- UI components from [shadcn/ui](https://ui.shadcn.com)

---

**⚠️ WAVE 1 DISCLAIMER**: Blink Markets Wave 1 is running on local devnet with sample data. All markets are for demonstration purposes only. The Cloudflare tunnel for the GraphQL service is ephemeral and may be offline; the app falls back to mock data. Wave 2 will introduce live trading functionality.

Made with ⚡ by the Blink Markets team
