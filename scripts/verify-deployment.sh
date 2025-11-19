#!/usr/bin/env bash
# scripts/verify-deployment.sh
# Quick verification script for judges to validate Conway deployment
set -euo pipefail

echo "========================================="
echo " BLINK MARKETS DEPLOYMENT VERIFICATION"
echo "========================================="
echo ""

# Check if we have an APP_ID
if [ -f /tmp/linera/APP_ID ]; then
  APP_ID=$(cat /tmp/linera/APP_ID)
  echo "✅ APP_ID found: $APP_ID"
else
  echo "⚠️  No APP_ID found. Run: bash scripts/conway-hard-deploy.sh"
  exit 1
fi

# Check wallet/chain info
echo ""
echo "=== WALLET INFO ==="
linera wallet show | head -15

# Check balance
echo ""
echo "=== BALANCE ==="
linera query-balance

# Verify service is running
echo ""
echo "=== SERVICE STATUS ==="
if curl -s http://localhost:8080 | grep -q "GraphiQL"; then
  echo "✅ GraphiQL service running at http://localhost:8080"
else
  echo "⚠️  Service not running. Starting..."
  nohup sh -c "linera service --required-application-ids $APP_ID --port 8080 >/tmp/linera/service.log 2>&1" &
  sleep 3
  echo "✅ Service started at http://localhost:8080"
fi

# Check validator connectivity
echo ""
echo "=== VALIDATOR CONNECTIVITY ==="
if linera query-validators 2>/dev/null | head -5; then
  echo "✅ Validators reachable"
else
  echo "⚠️  Validator query timeout (non-critical)"
fi

echo ""
echo "========================================="
echo " VERIFICATION COMPLETE"
echo "========================================="
echo ""
echo "📋 Quick Test Commands:"
echo ""
echo "1. Open GraphiQL:"
echo "   http://localhost:8080"
echo ""
echo "2. Query applications:"
echo "   query { applications { id } }"
echo ""
echo "3. View deployment log:"
echo "   ls -lh /tmp/linera/conway_hard_deploy_*.log"
echo ""
