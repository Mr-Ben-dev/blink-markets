#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting Blink Markets Docker Stack..."

# Check if WASM is built
if [ ! -f "blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm" ]; then
    echo "⚠️  WASM not found. Building..."
    npm run wasm:build
fi

# Start services
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
docker-compose ps

echo "✅ Services started!"
echo "📊 Frontend: http://localhost:5173"
echo "🔗 GraphQL: http://localhost:8080/graphql"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
