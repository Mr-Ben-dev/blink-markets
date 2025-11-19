use async_graphql::{Request, Response};
use linera_sdk::abi::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub struct BlinkMarketsAbi;

impl ContractAbi for BlinkMarketsAbi {
    type Operation = Operation;
    type Response = OperationResponse;
}

impl ServiceAbi for BlinkMarketsAbi {
    type Query = Request;
    type QueryResponse = Response;
}

/// Operations that can be executed on the Blink Markets application
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Operation {
    /// Create a new prediction market
    CreateMarket {
        question: String,
        outcomes: Vec<String>,
        description: String,
        end_time: u64,
    },
    /// Place a bet on a market outcome
    PlaceBet {
        market_id: u64,
        outcome_index: u8,
        amount: u64,
    },
    /// Resolve a market with the winning outcome
    ResolveMarket {
        market_id: u64,
        winning_outcome: u8,
    },
    /// Claim winnings from a resolved market
    ClaimWinnings {
        market_id: u64,
    },
}

/// Response type for operations
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum OperationResponse {
    MarketCreated(u64),
    BetPlaced,
    MarketResolved,
    WinningsClaimed(u64),
}

/// Messages that can be sent cross-chain
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Message {
    /// Update leaderboard with user performance
    LeaderboardUpdate {
        user: String,
        points: u64,
        wins: u32,
        total_bets: u32,
    },
    /// Credit user account with winnings
    CreditWinnings {
        user: String,
        amount: u64,
        market_id: u64,
    },
}

/// Market data structure
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Market {
    pub id: u64,
    pub creator: String,
    pub question: String,
    pub outcomes: Vec<String>,
    pub description: String,
    pub end_time: u64,
    pub resolved: bool,
    pub winning_outcome: Option<u8>,
    pub total_volume: u64,
    pub outcome_volumes: Vec<u64>,
}

/// User position in a market
#[derive(Debug, Deserialize, Serialize, Clone, Default)]
pub struct Position {
    pub market_id: u64,
    pub outcome_index: u8,
    pub amount: u64,
    pub claimed: bool,
}

/// Trade record
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Trade {
    pub market_id: u64,
    pub user: String,
    pub outcome_index: u8,
    pub amount: u64,
    pub timestamp: u64,
}

/// Leaderboard entry
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct LeaderboardEntry {
    pub user: String,
    pub points: u64,
    pub wins: u32,
    pub total_bets: u32,
    pub roi: f64,
}
