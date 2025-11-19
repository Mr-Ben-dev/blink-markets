use linera_sdk::test::*;
use blink_markets::{BlinkMarketsAbi, Operation, MarketType};

#[tokio::test]
async fn test_create_market() {
    let mut chain = TestChain::new().await;
    
    let operation = Operation::CreateMarket {
        title: "Test Market".to_string(),
        description: "Will BTC hit $100k by EOY?".to_string(),
        category: "crypto".to_string(),
        end_time: 1735689600, // Future timestamp
        market_type: MarketType::Binary,
        options: vec!["Yes".to_string(), "No".to_string()],
    };
    
    let result = chain.execute_operation(operation).await;
    assert!(result.is_ok());
    
    // Query markets
    let markets: Vec<_> = chain.query("query { markets { id title status } }").await;
    assert_eq!(markets.len(), 1);
    assert_eq!(markets[0].title, "Test Market");
}

#[tokio::test]
async fn test_place_bet_lifecycle() {
    let mut chain = TestChain::new().await;
    
    // 1. Create market
    let create_op = Operation::CreateMarket {
        title: "ETH Price".to_string(),
        description: "Will ETH reach $5k?".to_string(),
        category: "crypto".to_string(),
        end_time: 1735689600,
        market_type: MarketType::Binary,
        options: vec!["Yes".to_string(), "No".to_string()],
    };
    chain.execute_operation(create_op).await.unwrap();
    
    // 2. Place bet
    let bet_op = Operation::PlaceBet {
        market_id: 0,
        option: "Yes".to_string(),
        amount: 100,
    };
    chain.execute_operation(bet_op).await.unwrap();
    
    // 3. Query bets
    let bets: Vec<_> = chain.query("query { market(id: 0) { bets { amount option } } }").await;
    assert_eq!(bets.len(), 1);
    assert_eq!(bets[0].amount, 100);
    
    // 4. Resolve market
    let resolve_op = Operation::ResolveMarket {
        market_id: 0,
        winning_option: "Yes".to_string(),
    };
    chain.execute_operation(resolve_op).await.unwrap();
    
    // 5. Claim winnings
    let claim_op = Operation::ClaimWinnings {
        market_id: 0,
    };
    let result = chain.execute_operation(claim_op).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_leaderboard_updates() {
    let mut chain = TestChain::new().await;
    
    // Create market and place multiple bets
    let create_op = Operation::CreateMarket {
        title: "Test Leaderboard".to_string(),
        description: "Leaderboard test".to_string(),
        category: "test".to_string(),
        end_time: 1735689600,
        market_type: MarketType::Binary,
        options: vec!["A".to_string(), "B".to_string()],
    };
    chain.execute_operation(create_op).await.unwrap();
    
    // Place winning bet
    chain.execute_operation(Operation::PlaceBet {
        market_id: 0,
        option: "A".to_string(),
        amount: 100,
    }).await.unwrap();
    
    // Resolve and claim
    chain.execute_operation(Operation::ResolveMarket {
        market_id: 0,
        winning_option: "A".to_string(),
    }).await.unwrap();
    
    chain.execute_operation(Operation::ClaimWinnings {
        market_id: 0,
    }).await.unwrap();
    
    // Check leaderboard
    let leaderboard: Vec<_> = chain.query("query { leaderboard { points wins } }").await;
    assert!(leaderboard.len() > 0);
    assert!(leaderboard[0].points > 0);
}

#[tokio::test]
async fn test_block_height_increments() {
    let mut chain = TestChain::new().await;
    
    let initial_height: u64 = chain.query("query { blockHeight }").await;
    
    // Execute operation
    chain.execute_operation(Operation::CreateMarket {
        title: "Height Test".to_string(),
        description: "Test".to_string(),
        category: "test".to_string(),
        end_time: 1735689600,
        market_type: MarketType::Binary,
        options: vec!["A".to_string(), "B".to_string()],
    }).await.unwrap();
    
    let new_height: u64 = chain.query("query { blockHeight }").await;
    assert_eq!(new_height, initial_height + 1);
}
