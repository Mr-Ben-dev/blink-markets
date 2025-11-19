#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{Context, EmptySubscription, Object, Schema, SimpleObject};
use linera_sdk::{
    abi::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};

use blink_markets::{Market, Operation, OperationResponse, LeaderboardEntry};

use self::state::BlinkMarketsState;

pub struct BlinkMarketsService {
    state: BlinkMarketsState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(BlinkMarketsService);

impl WithServiceAbi for BlinkMarketsService {
    type Abi = blink_markets::BlinkMarketsAbi;
}

impl Service for BlinkMarketsService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = BlinkMarketsState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        BlinkMarketsService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                service: self.clone(),
            },
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            EmptySubscription,
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
        let mut markets = Vec::new();
        let indices: Vec<_> = self.service.state.markets.indices().await.expect("Failed to get indices").collect();
        
        for id in indices {
            if let Ok(Some(market)) = self.service.state.markets.get(&id).await {
                markets.push(MarketView::from(market));
            }
        }
        
        markets
    }

    /// Get a specific market by ID
    async fn market(&self, id: u64) -> Option<MarketView> {
        self.service.state.markets
            .get(&id)
            .await
            .ok()
            .flatten()
            .map(MarketView::from)
    }

    /// Get user balance
    async fn user_balance(&self, user: String) -> u64 {
        self.service.state.balances
            .get(&user)
            .await
            .ok()
            .flatten()
            .unwrap_or(1000) // Default balance for testing
    }

    /// Get leaderboard
    async fn leaderboard(&self) -> Vec<LeaderboardView> {
        let mut entries = Vec::new();
        let keys: Vec<_> = self.service.state.leaderboard.indices().await.expect("Failed to get indices").collect();
        
        for user in keys {
            if let Ok(Some(entry)) = self.service.state.leaderboard.get(&user).await {
                entries.push(LeaderboardView::from(entry));
            }
        }
        
        // Sort by points descending
        entries.sort_by(|a, b| b.points.cmp(&a.points));
        entries
    }

    /// Get chain ID
    async fn chain_id(&self, ctx: &Context<'_>) -> String {
        ctx.data_opt::<String>()
            .cloned()
            .unwrap_or_else(|| "unknown".to_string())
    }

    /// Get application ID
    async fn application_id(&self) -> String {
        format!("{:?}", self.service.runtime.application_id())
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
        
        bcs::to_bytes(&operation).expect("Failed to serialize operation")
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
        
        bcs::to_bytes(&operation).expect("Failed to serialize operation")
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
        
        bcs::to_bytes(&operation).expect("Failed to serialize operation")
    }

    /// Claim winnings
    async fn claim_winnings(&self, market_id: u64) -> Vec<u8> {
        let operation = Operation::ClaimWinnings { market_id };
        
        bcs::to_bytes(&operation).expect("Failed to serialize operation")
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
