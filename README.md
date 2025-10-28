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
# Service URL (for production, set to your Cloudflare tunnel)
VITE_SERVICE_URL=https://your-tunnel.trycloudflare.com

# App ID (leave empty for Wave 1 faucet service)
VITE_APP_ID=

# Wallet functionality (set to "false" for Wave 1)
VITE_ENABLE_WALLET=false

# Demo mode (set to "false" for Wave 1)
VITE_DEMO_MODE=false
```

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

[View Full Roadmap](/roadmap)

## � Deploy to Vercel (Wave 1)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mr-Ben-dev/blink-markets)

### Deployment Steps

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**:
   - Sign up at [vercel.com](https://vercel.com)
   - Import your forked repository
   - Vercel will auto-detect the Vite framework

3. **Environment Variables** (Optional):
   ```bash
   VITE_SERVICE_URL=https://your-tunnel.trycloudflare.com
   VITE_ENABLE_WALLET=false
   VITE_DEMO_MODE=false
   ```
   
   - If you don't set `VITE_SERVICE_URL`, the app will run in **Demo Mode** with mock data
   - For live chain data, you'll need a publicly accessible Linera service via Cloudflare tunnel

4. **Deploy**: Vercel handles the build automatically using `npm run build`

### Local Development with Live Chain

For local development with real blockchain integration:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Install dependencies
npm ci

# 3. Initialize local devnet
npm run local:up       # Local devnet

# 4. Build and deploy contract
npm run wasm:build
npm run local:publish

# 5. Start services with Cloudflare tunnel
npm run linera:service  # Terminal 1 (port 8080)
# In another terminal, start tunnel:
cloudflared tunnel --url http://localhost:8080

# 6. Start frontend
npm run dev            # Terminal 3 (port 5173)
```

### Production Considerations

- **Static Deployment**: The frontend is a static Vite app that works without a backend
- **Chain Integration**: Set `VITE_LINERA_SERVICE_URL` to your public Linera service for live data
- **Demo Mode**: App gracefully falls back to mock data if service is unreachable
- **Performance**: All chain interactions are non-blocking and cached

See [docs/README-wave1.md](./docs/README-wave1.md) for detailed setup instructions.

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

**⚠️ WAVE 1 DISCLAIMER**: Blink Markets Wave 1 is running on local devnet with sample data. All markets are for demonstration purposes only. Wave 2 will introduce live trading functionality.

Made with ⚡ by the Blink Markets team
