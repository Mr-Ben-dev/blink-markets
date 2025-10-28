import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockMarkets } from "@/utils/mockData";

export default function MarketDetail() {
  const { id } = useParams();
  const market = mockMarkets.find((m) => m.id === id);

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

        <Card className="p-8 glass gradient-bg border-border/50">
          <h1 className="text-3xl font-bold mb-4">{market.title}</h1>
          <p className="text-foreground-secondary mb-6">{market.description}</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-foreground-secondary mb-1">Current Probability</div>
              <div className="text-3xl font-bold text-primary">
                {(market.probability * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary mb-1">Total Volume</div>
              <div className="text-3xl font-bold">
                ${(market.volume / 1000).toFixed(0)}K
              </div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary mb-1">Total Trades</div>
              <div className="text-3xl font-bold">
                {market.trades}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
