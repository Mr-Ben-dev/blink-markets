#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    abi::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};
use thiserror::Error;

use blink_markets::{Market, Message, Operation, OperationResponse, Position, Trade};

use self::state::BlinkMarketsState;

pub struct BlinkMarketsContract {
    state: BlinkMarketsState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(BlinkMarketsContract);

impl WithContractAbi for BlinkMarketsContract {
    type Abi = blink_markets::BlinkMarketsAbi;
}

/// Error type for Blink Markets contract
#[derive(Debug, Error)]
pub enum BlinkError {
    #[error("Market not found: {0}")]
    MarketNotFound(u64),
    
    #[error("Invalid outcome index: {0}")]
    InvalidOutcome(u8),
    
    #[error("Market already resolved")]
    MarketAlreadyResolved,
    
    #[error("Market not yet ended")]
    MarketNotEnded,
    
    #[error("Insufficient balance: have {have}, need {need}")]
    InsufficientBalance { have: u64, need: u64 },
    
    #[error("Unauthorized: only creator can perform this action")]
    Unauthorized,
    
    #[error("No winnings to claim")]
    NoWinnings,
    
    #[error("Winnings already claimed")]
    AlreadyClaimed,
}

impl Contract for BlinkMarketsContract {
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = String;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = BlinkMarketsState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        BlinkMarketsContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        
        // Set the creator
        let creator = self.runtime
            .authenticated_signer()
            .expect("Instantiation must be authenticated");
        self.state.creator.set(creator.to_string());
        
        // Initialize market counter and block height
        self.state.next_market_id.set(0);
        self.state.block_height.set(0);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        // Increment block height for performance tracking
        let current_height = self.state.block_height.get();
        self.state.block_height.set(current_height + 1);
        
        let result = match operation {
            Operation::CreateMarket {
                question,
                outcomes,
                description,
                end_time,
            } => self.create_market(question, outcomes, description, end_time).await,
            
            Operation::PlaceBet {
                market_id,
                outcome_index,
                amount,
            } => self.place_bet(market_id, outcome_index, amount).await,
            
            Operation::ResolveMarket {
                market_id,
                winning_outcome,
            } => self.resolve_market(market_id, winning_outcome).await,
            
            Operation::ClaimWinnings { market_id } => {
                self.claim_winnings(market_id).await
            }
        };

        result.expect("Operation failed")
    }

    async fn execute_message(&mut self, message: Self::Message) {
        match message {
            Message::LeaderboardUpdate {
                user,
                points,
                wins,
                total_bets,
            } => {
                self.update_leaderboard(user, points, wins, total_bets).await;
            }
            Message::CreditWinnings {
                user,
                amount,
                market_id: _,
            } => {
                self.credit_user(user, amount).await;
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl BlinkMarketsContract {
    /// Create a new prediction market
    async fn create_market(
        &mut self,
        question: String,
        outcomes: Vec<String>,
        description: String,
        end_time: u64,
    ) -> Result<OperationResponse, BlinkError> {
        let signer = self.runtime
            .authenticated_signer()
            .ok_or(BlinkError::Unauthorized)?;
        
        let market_id = *self.state.next_market_id.get();
        self.state.next_market_id.set(market_id + 1);
        
        let outcome_volumes = vec![0u64; outcomes.len()];
        
        let market = Market {
            id: market_id,
            creator: signer.to_string(),
            question,
            outcomes,
            description,
            end_time,
            resolved: false,
            winning_outcome: None,
            total_volume: 0,
            outcome_volumes,
        };
        
        self.state.markets.insert(&market_id, market).expect("Failed to insert market");
        
        // Emit event
        self.runtime.emit("MarketCreated".into(), &format!("{}", market_id));
        
        Ok(OperationResponse::MarketCreated(market_id))
    }

    /// Place a bet on a market outcome
    async fn place_bet(
        &mut self,
        market_id: u64,
        outcome_index: u8,
        amount: u64,
    ) -> Result<OperationResponse, BlinkError> {
        let signer = self.runtime
            .authenticated_signer()
            .ok_or(BlinkError::Unauthorized)?;
        let user = signer.to_string();
        
        // Get and update market
        let mut market = self.state.markets
            .get(&market_id)
            .await
            .ok()
            .flatten()
            .ok_or(BlinkError::MarketNotFound(market_id))?;
        
        if market.resolved {
            return Err(BlinkError::MarketAlreadyResolved);
        }
        
        if outcome_index as usize >= market.outcomes.len() {
            return Err(BlinkError::InvalidOutcome(outcome_index));
        }
        
        // Check balance
        let balance = self.state.balances
            .get(&user)
            .await
            .ok()
            .flatten()
            .unwrap_or(1000); // Default balance for testing
        
        if balance < amount {
            return Err(BlinkError::InsufficientBalance {
                have: balance,
                need: amount,
            });
        }
        
        // Update balance
        self.state.balances.insert(&user, balance - amount).expect("Failed to update balance");
        
        // Update market volumes
        market.total_volume += amount;
        market.outcome_volumes[outcome_index as usize] += amount;
        self.state.markets.insert(&market_id, market).expect("Failed to update market");
        
        // Record position
        let position = Position {
            market_id,
            outcome_index,
            amount,
            claimed: false,
        };
        self.state.positions.insert(&user, position).expect("Failed to record position");
        
        // Record trade
        let trade = Trade {
            market_id,
            user: user.clone(),
            outcome_index,
            amount,
            timestamp: self.runtime.system_time().micros(),
        };
        self.state.trades.push(trade);
        
        // Emit event
        self.runtime.emit("BetPlaced".into(), &format!("{}:{}:{}", market_id, user, amount));
        
        Ok(OperationResponse::BetPlaced)
    }

    /// Resolve a market with the winning outcome
    async fn resolve_market(
        &mut self,
        market_id: u64,
        winning_outcome: u8,
    ) -> Result<OperationResponse, BlinkError> {
        let signer = self.runtime
            .authenticated_signer()
            .ok_or(BlinkError::Unauthorized)?;
        
        let mut market = self.state.markets
            .get(&market_id)
            .await
            .ok()
            .flatten()
            .ok_or(BlinkError::MarketNotFound(market_id))?;
        
        // Only creator can resolve
        if market.creator != signer.to_string() {
            return Err(BlinkError::Unauthorized);
        }
        
        if market.resolved {
            return Err(BlinkError::MarketAlreadyResolved);
        }
        
        // Check if market has ended
        let current_time = self.runtime.system_time().micros();
        if current_time < market.end_time {
            return Err(BlinkError::MarketNotEnded);
        }
        
        if winning_outcome as usize >= market.outcomes.len() {
            return Err(BlinkError::InvalidOutcome(winning_outcome));
        }
        
        market.resolved = true;
        market.winning_outcome = Some(winning_outcome);
        self.state.markets.insert(&market_id, market).expect("Failed to update market");
        
        // Emit event
        self.runtime.emit("MarketResolved".into(), &format!("{}:{}", market_id, winning_outcome));
        
        Ok(OperationResponse::MarketResolved)
    }

    /// Claim winnings from a resolved market
    async fn claim_winnings(&mut self, market_id: u64) -> Result<OperationResponse, BlinkError> {
        let signer = self.runtime
            .authenticated_signer()
            .ok_or(BlinkError::Unauthorized)?;
        let user = signer.to_string();
        
        let market = self.state.markets
            .get(&market_id)
            .await
            .ok()
            .flatten()
            .ok_or(BlinkError::MarketNotFound(market_id))?;
        
        if !market.resolved {
            return Err(BlinkError::MarketNotEnded);
        }
        
        // Find user's position
        let position_opt = self.state.positions.get(&user).await.ok().flatten();
        
        if let Some(mut position) = position_opt {
            if position.market_id != market_id {
                return Err(BlinkError::NoWinnings);
            }
            
            if position.claimed {
                return Err(BlinkError::AlreadyClaimed);
            }
            
            let winning_outcome = market.winning_outcome.unwrap();
            
            if position.outcome_index != winning_outcome {
                return Err(BlinkError::NoWinnings);
            }
            
            // Calculate winnings (proportional to bet size relative to winning pool)
            let winning_pool = market.outcome_volumes[winning_outcome as usize];
            let winnings = if winning_pool > 0 {
                (position.amount * market.total_volume) / winning_pool
            } else {
                0
            };
            
            // Mark as claimed
            position.claimed = true;
            self.state.positions.insert(&user, position).expect("Failed to update position");
            
            // Credit user
            let balance = self.state.balances
                .get(&user)
                .await
                .ok()
                .flatten()
                .unwrap_or(0);
            self.state.balances.insert(&user, balance + winnings).expect("Failed to credit winnings");
            
            // Emit event
            self.runtime.emit("WinningsClaimed".into(), &format!("{}:{}:{}", market_id, user, winnings));
            
            Ok(OperationResponse::WinningsClaimed(winnings))
        } else {
            Err(BlinkError::NoWinnings)
        }
    }

    /// Update leaderboard stats
    async fn update_leaderboard(&mut self, user: String, points: u64, wins: u32, total_bets: u32) {
        use blink_markets::LeaderboardEntry;
        
        let roi = if total_bets > 0 {
            (wins as f64 / total_bets as f64) * 100.0
        } else {
            0.0
        };
        
        let entry = LeaderboardEntry {
            user: user.clone(),
            points,
            wins,
            total_bets,
            roi,
        };
        
        self.state.leaderboard.insert(&user, entry).expect("Failed to update leaderboard");
    }

    /// Credit user account
    async fn credit_user(&mut self, user: String, amount: u64) {
        let balance = self.state.balances
            .get(&user)
            .await
            .ok()
            .flatten()
            .unwrap_or(0);
        self.state.balances.insert(&user, balance + amount).expect("Failed to credit user");
    }
}
