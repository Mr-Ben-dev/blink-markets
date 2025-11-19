#!/usr/bin/env bash
set -euo pipefail

echo "🌱 Seeding Blink Markets with demo data..."

# Get the default chain ID
CHAIN_ID=$(linera wallet show | grep 'Public Key' -A 1 | tail -1 | awk '{print $2}')

if [ -z "$CHAIN_ID" ]; then
    echo "❌ Failed to get chain ID. Is linera wallet initialized?"
    exit 1
fi

echo "📍 Using chain: $CHAIN_ID"

# Create Market 1: Bitcoin
echo "📊 Creating Market 1: Bitcoin Price Prediction..."
linera project publish-and-create blink_markets \
    --json-argument '{
        "CreateMarket": {
            "title": "Bitcoin to $100K by Dec 2024?",
            "description": "Will Bitcoin (BTC) reach or exceed $100,000 USD by December 31, 2024?",
            "category": "cryptocurrency",
            "end_time": 1735689600,
            "market_type": "Binary",
            "options": ["Yes", "No"]
        }
    }'

# Create Market 2: Ethereum
echo "📊 Creating Market 2: Ethereum Upgrade..."
linera project publish-and-create blink_markets \
    --json-argument '{
        "CreateMarket": {
            "title": "ETH 2.0 Full Launch in 2024?",
            "description": "Will Ethereum complete its full transition to proof-of-stake by EOY 2024?",
            "category": "cryptocurrency",
            "end_time": 1735689600,
            "market_type": "Binary",
            "options": ["Yes", "No"]
        }
    }'

# Create Market 3: AI Prediction
echo "📊 Creating Market 3: AI Milestone..."
linera project publish-and-create blink_markets \
    --json-argument '{
        "CreateMarket": {
            "title": "GPT-5 Release in 2024?",
            "description": "Will OpenAI release GPT-5 or equivalent model before December 31, 2024?",
            "category": "technology",
            "end_time": 1735689600,
            "market_type": "Binary",
            "options": ["Yes", "No"]
        }
    }'

# Place some demo bets
echo "💰 Placing demo bets..."

# Bet on Market 0
linera project publish-and-create blink_markets \
    --json-argument '{
        "PlaceBet": {
            "market_id": 0,
            "option": "Yes",
            "amount": 100
        }
    }'

linera project publish-and-create blink_markets \
    --json-argument '{
        "PlaceBet": {
            "market_id": 0,
            "option": "No",
            "amount": 50
        }
    }'

# Bet on Market 1
linera project publish-and-create blink_markets \
    --json-argument '{
        "PlaceBet": {
            "market_id": 1,
            "option": "Yes",
            "amount": 75
        }
    }'

echo "✅ Demo data seeded successfully!"
echo "🔍 Query markets: linera service --port 8080"
echo "🌐 Open frontend: http://localhost:5173/markets"
