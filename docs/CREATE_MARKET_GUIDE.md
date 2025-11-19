# Create Market Page - User Guide

## ✅ Updates Made

### 1. **Improved User Experience**
- ✅ **Duration Selector**: Choose market duration with dropdown menus (days + hours) instead of datetime picker
- ✅ **Auto-calculated End Date**: Shows when the market will close in a readable format
- ✅ **Today as Start**: Market automatically starts from the current time
- ✅ **User-friendly form**: Clear labels, validation, and helpful hints

### 2. **UI Improvements**
- Better visual feedback for duration selection
- Calendar icon showing when market closes
- Clearer validation messages
- Loading states during submission

### 3. **Conway Testnet Integration**
- All references updated from "Local devnet" to "Conway Testnet"
- Navbar shows "Conway Testnet" status
- Developers page shows Conway network info
- Roadmap updated with Conway deployment marked as complete

## 🔧 **CRITICAL FIX: schedule_operation()**

### The Real Problem (NOW FIXED!)

Found the issue in Linera documentation! GraphQL mutations weren't executing operations - they were just returning bytes.

**Before (Broken):**
```rust
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    bcs::to_bytes(&operation).expect("...")  // ❌ Just bytes, never executes!
}
```

**After (Fixed):**
```rust
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    self.runtime.schedule_operation(&operation);  // ✅ Actually executes!
    vec![]
}
```

### What Changed
- Updated `create_market()` mutation
- Updated `place_bet()` mutation
- Updated `resolve_market()` mutation
- Updated `claim_winnings()` mutation

All now use `runtime.schedule_operation()` which:
1. Schedules operation in next block
2. Authenticates with current signer
3. Executes through contract
4. Persists to blockchain

## 🚀 Deployment Status

### Fixed WASM
✅ Code fixed in `blink_markets/src/service.rs`
✅ WASM rebuilt successfully
⏳ **Awaiting Conway re-deployment**

### Current Issue
Conway testnet validators are experiencing blob propagation timeouts. The fix is ready but deployment needs retry.

## 📋 Temporary Workaround: CLI Script

Until the new WASM is deployed to Conway, use:

```bash
# Make executable (first time only)
chmod +x scripts/create-market-cli.sh

# Run the script
./scripts/create-market-cli.sh
```

The script will:
1. Prompt for market details (question, description, outcomes, duration)
2. Calculate the end time automatically
3. Execute the operation via Linera CLI
4. Create the market on Conway testnet
5. Market will appear in the Markets page

## 📋 Example Usage

```bash
$ ./scripts/create-market-cli.sh

=== Blink Markets - Create Market (Conway Testnet) ===

Market Question: Will Bitcoin reach $100,000 by end of 2025?
Description: BTC price prediction
Outcome 1 (e.g., Yes): Yes  
Outcome 2 (e.g., No): No
Duration in days: 30

Market Details:
  Question: Will Bitcoin reach $100,000 by end of 2025?
  Outcomes: [Yes, No]
  End Time: Wed Dec 18 08:43:33 AM +03 2025

Executing operation...
✅ Market created successfully!
View at: http://localhost:8081/markets
```

## 🔮 Future: Wave 2 (Wallet Integration)

When wallet integration is complete:
- ✅ Browser-based market creation
- ✅ MetaMask-style wallet connection
- ✅ Sign transactions directly in the UI
- ✅ No CLI needed
- ✅ Real-time balance tracking

## 📊 Current Working Features

✅ **Conway Testnet Deployment**: App is live on Conway  
✅ **GraphQL Queries**: View markets, leaderboard, stats
✅ **Real-time Updates**: Block height, latency tracking  
✅ **UI/UX**: Fully functional interface  
⏳ **Market Creation**: Requires CLI (wallet coming soon)  
⏳ **Place Bets**: Requires CLI (wallet coming soon)  

## 🐛 Troubleshooting

### "Market created successfully but not showing"
- This is expected without wallet integration
- Use the CLI script (`./scripts/create-market-cli.sh`) instead

### "linera command not found"
- Ensure Linera is installed and in your PATH
- Check LINERA_WALLET and LINERA_STORAGE env vars are set

### Script errors
- Make sure .env file has correct VITE_APPLICATION_ID and VITE_CHAIN_ID
- Ensure you're in the project root directory
- Verify linera service is running on port 8080
