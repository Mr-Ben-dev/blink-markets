# Frontend Connected to Conway Testnet ✅

## Configuration

### Environment Variables (.env)
```bash
VITE_CHAIN_ID=49213abc41992a7a9d0824b3728676eecb97ebd5676b50469866b539117b617f
VITE_APPLICATION_ID=d26c20f05fb877d5142f80698ff83cdcde832d69d9aa7e013236700e0f0425c4
VITE_CONWAY_CHAIN_ID=49213abc41992a7a9d0824b3728676eecb97ebd5676b50469866b539117b617f
VITE_CONWAY_APPLICATION_ID=d26c20f05fb877d5142f80698ff83cdcde832d69d9aa7e013236700e0f0425c4
```

## Services Running

| Service | Port | URL |
|---------|------|-----|
| Linera GraphQL | 8080 | http://localhost:8080 |
| Frontend (Vite) | 8081 | http://localhost:8081 |

## GraphQL Endpoint

**Full URL:**
```
http://localhost:8080/chains/49213abc41992a7a9d0824b3728676eecb97ebd5676b50469866b539117b617f/applications/d26c20f05fb877d5142f80698ff83cdcde832d69d9aa7e013236700e0f0425c4
```

## Available Queries

- `markets` - Get all markets
- `market(id: Int!)` - Get specific market
- `userBalance(user: String!)` - Get user balance  
- `leaderboard` - Get leaderboard
- `applicationId` - Get app ID
- `chainId` - Get chain ID
- `blockHeight` - Get current block height

## Testing

### Test GraphQL directly:
```bash
curl -X POST "http://localhost:8080/chains/49213abc41992a7a9d0824b3728676eecb97ebd5676b50469866b539117b617f/applications/d26c20f05fb877d5142f80698ff83cdcde832d69d9aa7e013236700e0f0425c4" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ markets { id question } }"}'
```

### Access Frontend:
Open http://localhost:8081 in your browser

### Access GraphiQL IDE:
Open http://localhost:8080 (root) and navigate to your application

## Status

✅ Conway deployment successful  
✅ GraphQL endpoint working  
✅ Frontend configured with correct IDs  
✅ Vite dev server running  
✅ All queries responding correctly

**The application is now fully connected to Conway testnet!**
