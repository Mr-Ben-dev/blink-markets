use linera_sdk::views::{
    linera_views, LogView, MapView, RegisterView, RootView, ViewStorageContext,
};
use blink_markets::{Market, Position, Trade, LeaderboardEntry};

/// The application state for Blink Markets
#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct BlinkMarketsState {
    /// Block height counter for performance metrics
    pub block_height: RegisterView<u64>,
    
    /// Counter for generating unique market IDs
    pub next_market_id: RegisterView<u64>,
    
    /// All markets stored by ID
    pub markets: MapView<u64, Market>,
    
    /// User positions: user address -> list of positions (stored as MapView for simplicity)
    pub positions: MapView<String, Position>,
    
    /// Trade history log
    pub trades: LogView<Trade>,
    
    /// User balances: user address -> balance
    pub balances: MapView<String, u64>,
    
    /// Leaderboard data: user address -> stats
    pub leaderboard: MapView<String, LeaderboardEntry>,
    
    /// Application creator (admin)
    pub creator: RegisterView<String>,
}
