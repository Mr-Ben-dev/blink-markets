import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bet, Market, MARKET_QUERY, MARKET_UPDATES_SUBSCRIPTION, mutate, PLACE_BET_MUTATION, query, subscribe } from "@/lib/graphqlClient";
import { ArrowLeft, Clock, DollarSign, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function MarketDetail() {
  const { id } = useParams();
  const [market, setMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutcomeIndex, setSelectedOutcomeIndex] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("100");
  const [placing, setPlacing] = useState(false);
  const { toast } = useToast();

  // Fetch market details
  useEffect(() => {
    async function fetchMarket() {
      if (!id) return;
      try {
        const data = await query<{ market: Market & { bets: Bet[] } }>(
          MARKET_QUERY,
          { id: parseInt(id) }
        );
        setMarket(data.market);
        setBets(data.market.bets || []);
        setSelectedOutcomeIndex(0); // Default to first outcome
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch market:", error);
        toast({
          title: "Failed to load market",
          description: "Make sure linera service is running.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
    fetchMarket();
  }, [id, toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribe<{ marketUpdates: Market[] }>(
      MARKET_UPDATES_SUBSCRIPTION,
      {},
      (data) => {
        const updatedMarket = data.marketUpdates.find(m => m.id === parseInt(id!));
        if (updatedMarket) {
          setMarket(updatedMarket);
        }
      }
    );
    return () => unsubscribe();
  }, [id]);

  // Place bet handler
  const handlePlaceBet = async () => {
    if (!market || selectedOutcomeIndex === undefined || !betAmount) return;
    
    setPlacing(true);
    try {
      await mutate(PLACE_BET_MUTATION, {
        marketId: market.id,
        outcomeIndex: selectedOutcomeIndex,
        amount: parseInt(betAmount),
      });
      
      toast({
        title: "Bet placed successfully!",
        description: `You bet ${betAmount} on ${market.outcomes[selectedOutcomeIndex]}`,
      });
      
      // Refresh market data
      const data = await query<{ market: Market & { bets: Bet[] } }>(
        MARKET_QUERY,
        { id: market.id }
      );
      setMarket(data.market);
      setBets(data.market.bets || []);
    } catch (error) {
      console.error("Failed to place bet:", error);
      toast({
        title: "Failed to place bet",
        description: "Make sure you have sufficient balance and the market is active.",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading market...</h2>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Market not found</h2>
          <Button asChild>
            <Link to="/markets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Markets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/markets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Markets
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Market Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 glass gradient-bg border-border/50">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {market.outcomes.length} outcomes
                </Badge>
                <Badge className={
                  !market.resolved ? 'bg-success/10 text-success border-success/20' :
                  'bg-primary/10 text-primary border-primary/20'
                }>
                  {market.resolved ? 'Resolved' : 'Active'}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{market.question}</h1>
              <p className="text-foreground-secondary mb-6">{market.description}</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Total Volume
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {market.totalVolume} tokens
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Outcomes
                  </div>
                  <div className="text-3xl font-bold">
                    {market.outcomes.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground-secondary mb-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    End Date
                  </div>
                  <div className="text-xl font-bold">
                    {new Date(market.endTime * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {market.resolved && market.winningOutcome !== null && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="text-sm text-success mb-1">Winning Outcome</div>
                  <div className="text-xl font-bold text-success">{market.outcomes[market.winningOutcome]}</div>
                </div>
              )}
            </Card>

            {/* Betting History */}
            <Card className="p-6 glass gradient-bg border-border/50">
              <h2 className="text-xl font-bold mb-4">Recent Bets</h2>
              {bets.length > 0 ? (
                <div className="space-y-3">
                  {bets.slice(0, 10).map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-foreground-muted" />
                        <div>
                          <div className="font-mono text-sm">
                            {bet.user.slice(0, 12)}...{bet.user.slice(-8)}
                          </div>
                          <div className="text-xs text-foreground-secondary">
                            {new Date(bet.timestamp * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{bet.amount} tokens</div>
                        <div className="text-sm text-foreground-secondary">on {market.outcomes[bet.outcomeIndex]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground-secondary">
                  No bets yet. Be the first to bet!
                </div>
              )}
            </Card>
          </div>

          {/* Betting Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 glass gradient-bg border-border/50 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>
              
              {!market.resolved ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Outcome</label>
                    <div className="grid gap-2">
                      {market.outcomes.map((outcome, index) => {
                        const volume = market.outcomeVolumes[index] || 0;
                        const percentage = market.totalVolume > 0 ? (volume / market.totalVolume * 100).toFixed(0) : 0;
                        return (
                          <Button
                            key={index}
                            variant={selectedOutcomeIndex === index ? "default" : "outline"}
                            className={selectedOutcomeIndex === index ? "bg-gradient-to-r from-primary to-secondary" : ""}
                            onClick={() => setSelectedOutcomeIndex(index)}
                          >
                            {outcome} ({percentage}%)
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount (LINERA)</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                      className="bg-surface/50 border-border"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={handlePlaceBet}
                    disabled={placing || selectedOutcomeIndex === undefined || !betAmount}
                  >
                    {placing ? "Placing Bet..." : `Bet ${betAmount} on ${market.outcomes[selectedOutcomeIndex]}`}
                  </Button>

                  <div className="text-xs text-foreground-secondary text-center">
                    Live betting powered by Linera blockchain
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Badge variant="secondary" className="mb-4">
                    Market Resolved
                  </Badge>
                  <p className="text-sm text-foreground-secondary">
                    {market.winningOutcome !== null
                      ? `Winning outcome: ${market.outcomes[market.winningOutcome]}`
                      : 'This market has been resolved'}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
