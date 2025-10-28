import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Network, Bot, BarChart3, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { stats } from "@/utils/mockData";

export default function Home() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [counters, setCounters] = useState({
    markets: 0,
    volume: 0,
    traders: 0,
    queries: 0,
  });

  // Animated counters
  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          markets: Math.floor(stats.marketsCreated * progress),
          volume: Math.floor(stats.totalVolume * progress),
          traders: Math.floor(stats.activeTraders * progress),
          queries: Math.floor(stats.oracleQueries * progress),
        });

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [inView]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return num >= 10000 ? `${(num / 1000).toFixed(1)}K` : num.toLocaleString();
    return num.toString();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6 px-4 py-2 rounded-full glass border border-primary/20"
            >
              <span className="text-sm font-medium gradient-text">
                Microchain-Native Prediction Markets
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Don't Be Late.
              <br />
              <span className="gradient-text">Be Real-Time.</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Ultra-fast prediction markets powered by Linera's microchain technology. 
              One chain per market for infinite scale and instant settlement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
              >
                <Link to="/markets">
                  Explore Markets
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-border hover:bg-surface"
              >
                <Link to="/developers">
                  Read Docs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-16 border-y border-border/50 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {counters.markets.toLocaleString()}
              </div>
              <div className="text-sm text-foreground-secondary">Markets Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {formatNumber(counters.volume)}
              </div>
              <div className="text-sm text-foreground-secondary">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {counters.traders.toLocaleString()}
              </div>
              <div className="text-sm text-foreground-secondary">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {counters.queries.toLocaleString()}
              </div>
              <div className="text-sm text-foreground-secondary">Oracle Queries</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text">Blink</span> Works
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Three revolutionary concepts power the fastest prediction markets ever built
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: "Factory Pattern",
                description: "One microchain per market for infinite scale. No shared state, no bottlenecks.",
                color: "text-primary",
              },
              {
                icon: Clock,
                title: "JIT Oracles",
                description: "Time-bounded truth with validator attestation. Median-of-N consensus for reliability.",
                color: "text-secondary",
              },
              {
                icon: Bot,
                title: "Agent API",
                description: "MCP-powered automated trading. Build bots that react faster than humans can.",
                color: "text-accent",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full glass hover-lift gradient-bg border-border/50">
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-foreground-secondary">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Linera */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Linera</span>?
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Built for elastic scalability with microchains that spawn and close on demand
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Settlement",
                description: "Sub-second finality for real-time trading",
              },
              {
                icon: Network,
                title: "Infinite Scale",
                description: "One chain per market, unlimited throughput",
              },
              {
                icon: Shield,
                title: "Validator Security",
                description: "Attestation-based oracle consensus",
              },
              {
                icon: BarChart3,
                title: "Low Fees",
                description: "Minimal gas costs on dedicated chains",
              },
              {
                icon: Bot,
                title: "Agent First",
                description: "Built for programmatic trading from day one",
              },
              {
                icon: Clock,
                title: "JIT Architecture",
                description: "Temporary chains that spawn and close as needed",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 glass border-border/50 hover-lift">
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground-secondary">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="glass gradient-bg border-border/50 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to trade at the speed of <span className="gradient-text">light</span>?
            </h2>
            <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Join the fastest prediction market platform. Create a wallet in seconds.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
            >
              <Link to="/markets">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
