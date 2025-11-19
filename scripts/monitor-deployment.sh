#!/bin/bash

echo "========================================="
echo " CONWAY DEPLOYMENT MONITOR"
echo "========================================="
echo ""

# Check if extended retry is running
if ps aux | grep -E "conway-extended-retry" | grep -v grep > /dev/null; then
    echo "✓ Extended retry deployment is RUNNING"
    echo ""
    
    # Show current progress
    if [ -f /tmp/conway_extended_retry.log ]; then
        echo "Latest log output:"
        echo "----------------------------------------"
        tail -20 /tmp/conway_extended_retry.log
        echo "----------------------------------------"
        echo ""
        
        # Count attempts
        ATTEMPTS=$(grep -c "^ATTEMPT" /tmp/conway_extended_retry.log || echo "0")
        SUCCESSES=$(grep -c "✅ SUCCESS" /tmp/conway_extended_retry.log || echo "0")
        FAILURES=$(grep -c "❌ Attempt" /tmp/conway_extended_retry.log || echo "0")
        
        echo "Statistics:"
        echo "  Total attempts started: $ATTEMPTS"
        echo "  Failures: $FAILURES"
        echo "  Successes: $SUCCESSES"
        echo ""
        
        if [ "$SUCCESSES" -gt 0 ]; then
            echo "🎉 DEPLOYMENT SUCCESSFUL!"
            echo ""
            echo "Application ID:"
            grep -A 2 "✅ SUCCESS" /tmp/conway_extended_retry.log | grep -oP "Application ID: \K[a-f0-9]{64,}"
        elif [ "$ATTEMPTS" -ge 12 ]; then
            echo "⚠️  All 12 attempts completed - check log for results"
        else
            echo "⏳ Deployment in progress (attempt $ATTEMPTS/12)..."
            echo "   Time per attempt: ~5 minutes"
            echo "   Estimated remaining: $((( 12 - ATTEMPTS ) * 5)) minutes"
        fi
    fi
else
    echo "❌ No deployment process running"
    echo ""
    echo "To start deployment:"
    echo "  bash scripts/conway-extended-retry.sh"
fi

echo ""
echo "========================================="
echo " Commands"
echo "========================================="
echo "View full log:     tail -f /tmp/conway_extended_retry.log"
echo "Check balance:     linera query-balance"
echo "View wallet:       linera wallet show"
echo "Stop deployment:   pkill -f conway-extended-retry"
echo ""
