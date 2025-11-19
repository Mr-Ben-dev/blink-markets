#!/bin/bash
set -e

# Script to create markets on Conway testnet using Linera CLI
# Usage: ./scripts/create-market-cli.sh

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

APP_ID="${VITE_APPLICATION_ID}"
CHAIN_ID="${VITE_CHAIN_ID}"

if [ -z "$APP_ID" ] || [ -z "$CHAIN_ID" ]; then
  echo -e "${RED}Error: Could not load APP_ID or CHAIN_ID from .env${NC}"
  exit 1
fi

echo -e "${BLUE}=== Blink Markets - Create Market (Conway Testnet) ===${NC}\n"

# Get input
read -p "Market Question: " QUESTION
read -p "Description: " DESCRIPTION
read -p "Outcome 1 (e.g., Yes): " OUTCOME1
read -p "Outcome 2 (e.g., No): " OUTCOME2
read -p "Duration in days: " DAYS

# Calculate end time
CURRENT_TIME=$(date +%s)
DURATION_SECONDS=$((DAYS * 24 * 60 * 60))
END_TIME=$((CURRENT_TIME + DURATION_SECONDS))

echo -e "\n${YELLOW}Market Details:${NC}"
echo "  Question: $QUESTION"
echo "  Outcomes: [$OUTCOME1, $OUTCOME2]"
echo "  End Time: $(date -d @$END_TIME 2>/dev/null || date -r $END_TIME)"
echo ""

# Execute operation using Linera CLI
echo -e "${BLUE}Executing operation...${NC}"
linera execute-operation \
  --application-id "$APP_ID" \
  --operation "{
    \"CreateMarket\": {
      \"question\": \"$QUESTION\",
      \"outcomes\": [\"$OUTCOME1\", \"$OUTCOME2\"],
      \"description\": \"$DESCRIPTION\",
      \"end_time\": $END_TIME
    }
  }"

echo -e "\n${GREEN}✅ Market created successfully!${NC}"
echo -e "View at: ${BLUE}http://localhost:8081/markets${NC}"

# Try the system-level GraphQL API
curl -s -X POST "http://localhost:8080/" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name: \"MutationRoot\") { fields { name description args { name type { name kind ofType { name } } } } } }"}' | python3 -m json.tool | grep -A20 "executeOperation\|submitOperation\|publishOperation"

echo ""
echo "=== Current State ==="
curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ markets { id question } }"}' | python3 -m json.tool
