#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{Object, Schema, SimpleObject, Subscription};
use futures::stream::{Stream};
use linera_sdk::{
    abi::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};

use blink_markets::{Market, Operation, LeaderboardEntry};

use self::state::BlinkMarketsState;

pub struct BlinkMarketsService {
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(BlinkMarketsService);

impl WithServiceAbi for BlinkMarketsService {
    type Abi = blink_markets::BlinkMarketsAbi;
}

impl Service for BlinkMarketsService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        BlinkMarketsService {
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                runtime: self.runtime.clone(),
            },
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            SubscriptionRoot {
                runtime: self.runtime.clone(),
            },
        )
        .finish();
        
        schema.execute(query).await
    }
}

/// GraphQL query root
struct QueryRoot {
    runtime: Arc<ServiceRuntime<BlinkMarketsService>>,
}

#[Object]
impl QueryRoot {
    /// Get all markets
    async fn markets(&self) -> Vec<MarketView> {
        let state = BlinkMarketsState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        let mut markets = Vec::new();
        let indices = state.markets.indices().await.expect("Failed to get indices");
        
        for id in indices {
            if let Ok(Some(market)) = state.markets.get(&id).await {
                markets.push(MarketView::from(market));
            }
        }
        
        markets
    }

    /// Get a specific market by ID
    async fn market(&self, id: u64) -> Option<MarketView> {
        let state = BlinkMarketsState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        state.markets
            .get(&id)
            .await
            .ok()
            .flatten()
            .map(MarketView::from)
    }

    /// Get user balance
    async fn user_balance(&self, user: String) -> u64 {
        let state = BlinkMarketsState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        state.balances
            .get(&user)
            .await
            .ok()
            .flatten()
            .unwrap_or(1000) // Default balance for testing
    }

    /// Get leaderboard
    async fn leaderboard(&self) -> Vec<LeaderboardView> {
        let state = BlinkMarketsState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        let mut entries = Vec::new();
        let keys = state.leaderboard.indices().await.expect("Failed to get indices");
        
        for user in keys {
            if let Ok(Some(entry)) = state.leaderboard.get(&user).await {
                entries.push(LeaderboardView::from(entry));
            }
        }
        
        // Sort by points descending
        entries.sort_by(|a, b| b.points.cmp(&a.points));
        entries
    }

    /// Get application ID
    async fn application_id(&self) -> String {
        format!("{:?}", self.runtime.application_id())
    }
    
    /// Get chain ID
    async fn chain_id(&self) -> String {
        format!("{:?}", self.runtime.chain_id())
    }

    /// Get current block height
    async fn block_height(&self) -> u64 {
        let state = BlinkMarketsState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        *state.block_height.get()
    }
}

/// GraphQL mutation root
struct MutationRoot {
    runtime: Arc<ServiceRuntime<BlinkMarketsService>>,
}

#[Object]
impl MutationRoot {
    /// Create a new market
    async fn create_market(
        &self,
        question: String,
        outcomes: Vec<String>,
        description: String,
        end_time: u64,
    ) -> Vec<u8> {
        let operation = Operation::CreateMarket {
            question,
            outcomes,
            description,
            end_time,
        };
        
        self.runtime.schedule_operation(&operation);
        vec![]
    }

    /// Place a bet on a market
    async fn place_bet(
        &self,
        market_id: u64,
        outcome_index: u8,
        amount: u64,
    ) -> Vec<u8> {
        let operation = Operation::PlaceBet {
            market_id,
            outcome_index,
            amount,
        };
        
        self.runtime.schedule_operation(&operation);
        vec![]
    }

    /// Resolve a market
    async fn resolve_market(
        &self,
        market_id: u64,
        winning_outcome: u8,
    ) -> Vec<u8> {
        let operation = Operation::ResolveMarket {
            market_id,
            winning_outcome,
        };
        
        self.runtime.schedule_operation(&operation);
        vec![]
    }

    /// Claim winnings
    async fn claim_winnings(&self, market_id: u64) -> Vec<u8> {
        let operation = Operation::ClaimWinnings { market_id };
        
        self.runtime.schedule_operation(&operation);
        vec![]
    }
}

/// GraphQL subscription root for real-time updates
struct SubscriptionRoot {
    runtime: Arc<ServiceRuntime<BlinkMarketsService>>,
}

#[Subscription]
impl SubscriptionRoot {
    /// Subscribe to market updates
    /// Returns market state every 2 seconds for real-time dashboard
    async fn market_updates(&self) -> impl Stream<Item = Vec<MarketView>> {
        let runtime = self.runtime.clone();
        
        async_stream::stream! {
            loop {
                let state = BlinkMarketsState::load(runtime.root_view_storage_context())
                    .await
                    .expect("Failed to load state");
                
                let mut markets = Vec::new();
                let indices = state.markets.indices().await.expect("Failed to get indices");
                
                for id in indices {
                    if let Ok(Some(market)) = state.markets.get(&id).await {
                        markets.push(MarketView::from(market));
                    }
                }
                
                yield markets;
                
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            }
        }
    }

    /// Subscribe to leaderboard updates  
    /// Returns leaderboard every 2 seconds for real-time rankings
    async fn leaderboard_updates(&self) -> impl Stream<Item = Vec<LeaderboardView>> {
        let runtime = self.runtime.clone();
        
        async_stream::stream! {
            loop {
                let state = BlinkMarketsState::load(runtime.root_view_storage_context())
                    .await
                    .expect("Failed to load state");
                
                let mut entries = Vec::new();
                let keys = state.leaderboard.indices().await.expect("Failed to get indices");
                
                for user in keys {
                    if let Ok(Some(entry)) = state.leaderboard.get(&user).await {
                        entries.push(LeaderboardView::from(entry));
                    }
                }
                
                // Sort by points descending
                entries.sort_by(|a, b| b.points.cmp(&a.points));
                
                yield entries;
                
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            }
        }
    }

    /// Subscribe to block height for performance monitoring
    async fn block_height_updates(&self) -> impl Stream<Item = u64> {
        let runtime = self.runtime.clone();
        
        async_stream::stream! {
            loop {
                let state = BlinkMarketsState::load(runtime.root_view_storage_context())
                    .await
                    .expect("Failed to load state");
                
                yield *state.block_height.get();
                
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            }
        }
    }
}

/// GraphQL view of a Market
#[derive(SimpleObject)]
struct MarketView {
    id: u64,
    creator: String,
    question: String,
    outcomes: Vec<String>,
    description: String,
    end_time: u64,
    resolved: bool,
    winning_outcome: Option<u8>,
    total_volume: u64,
    outcome_volumes: Vec<u64>,
}

impl From<Market> for MarketView {
    fn from(market: Market) -> Self {
        MarketView {
            id: market.id,
            creator: market.creator,
            question: market.question,
            outcomes: market.outcomes,
            description: market.description,
            end_time: market.end_time,
            resolved: market.resolved,
            winning_outcome: market.winning_outcome,
            total_volume: market.total_volume,
            outcome_volumes: market.outcome_volumes,
        }
    }
}

/// GraphQL view of a LeaderboardEntry
#[derive(SimpleObject)]
struct LeaderboardView {
    user: String,
    points: u64,
    wins: u32,
    total_bets: u32,
    roi: f64,
}

impl From<LeaderboardEntry> for LeaderboardView {
    fn from(entry: LeaderboardEntry) -> Self {
        LeaderboardView {
            user: entry.user,
            points: entry.points,
            wins: entry.wins,
            total_bets: entry.total_bets,
            roi: entry.roi,
        }
    }
}
