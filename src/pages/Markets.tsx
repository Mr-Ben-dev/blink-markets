import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, mockMarkets, stats } from "@/utils/mockData";
import { motion } from "framer-motion";
import { Clock, DollarSign, Filter, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Markets() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("volume");

  const filteredMarkets = mockMarkets
    .filter((market) => {
      const matchesCategory = selectedCategory === "all" || market.category === selectedCategory;
      const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           market.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "newest") return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
      if (sortBy === "ending") return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      return 0;
    });

  return (
    <div className="min-h-screen py-8">
      {/* Stats Bar */}
      <div className="sticky top-16 z-40 glass border-b border-border/50 mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-foreground-secondary">Total Markets</div>
              <div className="text-xl font-bold text-primary">{stats.totalMarkets}</div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary">24h Volume</div>
              <div className="text-xl font-bold text-secondary">${(stats.volume24h / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary">Active Now</div>
              <div className="text-xl font-bold text-success">{stats.activeNow}</div>
            </div>
            <div>
              <div className="text-sm text-foreground-secondary">Gas Price</div>
              <div className="text-xl font-bold text-accent">{stats.gasPrice} LINERA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Wave 1 Demo Banner */}
        <div className="mb-6">
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Wave 1 demo: markets and prices are sample data; trading is disabled.
          </Badge>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Explore <span className="gradient-text">Markets</span>
          </h1>
          <p className="text-foreground-secondary">
            Trade on real-time prediction markets with instant settlement
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface/50 border-border focus-glow"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-surface/50 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Highest Volume</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market, index) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/markets/${market.id}`}>
                <Card className="p-6 h-full glass gradient-bg border-border/50 hover-lift cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {market.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-foreground-muted">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {new Date(market.endTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {market.title}
                  </h3>

                  {/* Probability Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground-secondary">Probability</span>
                      <span className="text-lg font-bold text-primary">
                        {(market.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${market.probability * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-foreground-secondary">
                      <DollarSign className="h-4 w-4" />
                      <span>${(market.volume / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center space-x-1 text-foreground-secondary">
                      <TrendingUp className="h-4 w-4" />
                      <span>{market.trades} trades</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      className="bg-success/10 text-success hover:bg-success/20 border border-success/20"
                      onClick={(e) => e.preventDefault()}
                    >
                      YES {(market.probability * 100).toFixed(0)}%
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                      onClick={(e) => e.preventDefault()}
                    >
                      NO {((1 - market.probability) * 100).toFixed(0)}%
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 mx-auto mb-4 text-foreground-muted" />
            <h3 className="text-xl font-bold mb-2">No markets found</h3>
            <p className="text-foreground-secondary mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
