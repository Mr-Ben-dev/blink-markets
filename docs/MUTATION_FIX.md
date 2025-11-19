# Fixed Mutations with schedule_operation()

## ✅ What Was Fixed

The root cause was discovered in the Linera documentation (`linera-docs.md` line 1151-1157):

```rust
impl MutationRoot {
    async fn increment(&self, value: u64) -> [u8; 0] {
        self.runtime.schedule_operation(&value);  // <-- THIS IS THE KEY!
        []
    }
}
```

### The Problem

Our mutations were doing:
```rust
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    bcs::to_bytes(&operation).expect("Failed to serialize operation")  // ❌ Just returns bytes
}
```

This **only serialized** the operation but **never executed** it!

### The Solution

Updated all mutations to use `runtime.schedule_operation()`:

```rust
async fn create_market(...) -> Vec<u8> {
    let operation = Operation::CreateMarket { ... };
    self.runtime.schedule_operation(&operation);  // ✅ Actually executes!
    vec![]
}
```

## 🔧 Changes Made

Updated in `/root/dev/blink-markets/blink_markets/src/service.rs`:

1. ✅ `create_market` - Now uses `schedule_operation()`
2. ✅ `place_bet` - Now uses `schedule_operation()`  
3. ✅ `resolve_market` - Now uses `schedule_operation()`
4. ✅ `claim_winnings` - Now uses `schedule_operation()`

## 📦 WASM Rebuilt

```bash
npm run wasm:build
```

✅ New WASM artifacts generated with the fix

## 🚀 Deployment Status

### Attempt 1: Failed ❌
- Tried to deploy new app to Conway
- Validators timed out with blob propagation issues
- Same "Blobs not found" errors as before

### Current State
- **Old deployment still active**: App ID `d26c20f05fb877d5142f80698ff83cdcde832d69d9aa7e013236700e0f0425c4`
- **Fixed WASM ready**: Sitting in `target/wasm32-unknown-unknown/release/`
- **Need to**: Either retry deployment or use existing app with CLI workaround

## 🎯 Next Steps

### Option 1: Retry Conway Deployment (Recommended)
Wait longer (10-15 minutes after chain activity) and retry:
```bash
linera publish-and-create \
  blink_markets/target/wasm32-unknown-unknown/release/blink_markets_contract.wasm \
  blink_markets/target/wasm32-unknown-unknown/release/blink_markets_service.wasm \
  --json-argument "null"
```

### Option 2: Continue with CLI Script
The CLI script still works for creating markets:
```bash
./scripts/create-market-cli.sh
```

### Option 3: Local Testing
Test the fixed WASM locally before redeploying:
```bash
# Start local network
npm run local:up

# Deploy locally
npm run local:publish

# Test creating markets
```

## 📝 What schedule_operation() Does

From the Linera architecture:
1. **Schedules** the operation to be included in the next block
2. **Authenticates** it with the current signer
3. **Executes** it through the contract's `execute_operation()` method
4. **Persists** state changes to the blockchain

Without `schedule_operation()`, mutations just return bytes that never get executed!

## ✅ Verification

Once deployed with the fix, markets created through the UI will:
- ✅ Actually execute on the blockchain
- ✅ Appear in the markets list immediately  
- ✅ Be queryable via GraphQL
- ✅ Persist across service restarts

## 🐛 Why It Seemed to Work Before

The mutations appeared successful because:
1. GraphQL mutation completed ✅
2. Returned success response ✅  
3. Toast showed "Market created" ✅

But the operation **never reached the contract** to actually create the market!

---

**Status**: Code fixed ✅ | WASM built ✅ | Awaiting successful Conway deployment ⏳
