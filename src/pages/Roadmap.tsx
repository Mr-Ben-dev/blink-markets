import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface Wave {
  number: number;
  title: string;
  dates: string;
  status: "completed" | "in-progress" | "upcoming";
  progress: number;
  items: {
    label: string;
    completed: boolean;
  }[];
}

export default function Roadmap() {
  const waves: Wave[] = [
    {
      number: 1,
      title: "Foundation",
      dates: "Oct 20–28, 2025",
      status: "completed",
      progress: 100,
      items: [
        { label: "Vercel deployment (live)", completed: true },
        { label: "GraphQL client integration (optional for W1)", completed: true },
        { label: "Graceful fallback to sample data", completed: true },
        { label: "Chain status indicator (real-time UI state)", completed: true },
        { label: "Sample market UI (mock data)", completed: true },
        { label: "Documentation + evidence package", completed: true },
      ],
    },
    {
      number: 2,
      title: "Temporary Chains",
      dates: "Nov 3–12, 2025",
      status: "upcoming",
      progress: 0,
      items: [
        { label: "Conway Testnet deployment", completed: true },
        { label: "Custom market contract deployment", completed: false },
        { label: "Wallet operations (faucet/tx signing)", completed: false },
        { label: "Market Factory implementation", completed: false },
        { label: "One chain per market pattern", completed: false },
        { label: "Cross-chain message routing", completed: false },
        { label: "Order matching engine", completed: false },
        { label: "Real market creation flow", completed: false },
        { label: "Chain lifecycle management", completed: false },
      ],
    },
    {
      number: 3,
      title: "JIT Oracle Mesh",
      dates: "Nov 17–26, 2025",
      status: "upcoming",
      progress: 0,
      items: [
        { label: "Time-bounded HTTP queries", completed: false },
        { label: "Validator attestation system", completed: false },
        { label: "Median-of-N consensus", completed: false },
        { label: "Custom resolution policies", completed: false },
        { label: "Attestation visualization UI", completed: false },
        { label: "Oracle reputation tracking", completed: false },
      ],
    },
    {
      number: 4,
      title: "Agent API & Wallets",
      dates: "Dec 1–10, 2025",
      status: "upcoming",
      progress: 0,
      items: [
        { label: "MCP server deployment", completed: false },
        { label: "Trading bot examples", completed: false },
        { label: "Dynamic wallet integration", completed: false },
        { label: "MetaMask snap support", completed: false },
        { label: "Data blobs for rich media", completed: false },
        { label: "Agent performance analytics", completed: false },
      ],
    },
    {
      number: 5,
      title: "Scale & Analytics",
      dates: "Dec 15, 2025 – Jan 7, 2026",
      status: "upcoming",
      progress: 0,
      items: [
        { label: "Stress testing suite (10K TPS target)", completed: false },
        { label: "Analytics dashboard", completed: false },
        { label: "Copy trading feature", completed: false },
        { label: "Space and Time integration", completed: false },
        { label: "Atoma AI oracle integration", completed: false },
        { label: "Sentiment feed as oracle source", completed: false },
      ],
    },
    {
      number: 6,
      title: "Production Ready",
      dates: "Jan 12–21, 2026",
      status: "upcoming",
      progress: 0,
      items: [
        { label: "Dispute resolution system", completed: false },
        { label: "Graceful chain closure", completed: false },
        { label: "Full documentation site", completed: false },
        { label: "Security audit (CertiK)", completed: false },
        { label: "Mainnet migration plan", completed: false },
        { label: "Demo Day preparation", completed: false },
      ],
    },
  ];

  const getStatusBadge = (status: Wave["status"]) => {
    const styles = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-warning/10 text-warning border-warning/20",
      upcoming: "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20",
    };

    const labels = {
      completed: "✅ COMPLETED",
      "in-progress": "🚧 IN PROGRESS",
      upcoming: "📅 UPCOMING",
    };

    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What's <span className="gradient-text">Next</span>
          </h1>
          <p className="text-xl text-foreground-secondary">
            Our roadmap to building the fastest, most scalable prediction market platform. 
            Follow our progress from prototype to production.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

          {/* Waves */}
          <div className="space-y-12">
            {waves.map((wave, index) => (
              <motion.div
                key={wave.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="ml-0 md:ml-20 p-6 glass gradient-bg border-border/50 hover-lift">
                  {/* Wave Indicator */}
                  <div className="absolute -left-4 md:-left-16 top-6 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background">
                    {wave.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : wave.status === "in-progress" ? (
                      <Clock className="h-6 w-6 text-white" />
                    ) : (
                      <Circle className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div>
                      <div className="text-sm text-foreground-secondary mb-1">
                        WAVE {wave.number}
                      </div>
                      <h3 className="text-2xl font-bold">{wave.title}</h3>
                      <div className="text-sm text-foreground-muted mt-1">{wave.dates}</div>
                    </div>
                    {getStatusBadge(wave.status)}
                  </div>

                  {/* Progress */}
                  {wave.status !== "upcoming" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground-secondary">Progress</span>
                        <span className="text-sm font-bold text-primary">{wave.progress}%</span>
                      </div>
                      <Progress value={wave.progress} className="h-2" />
                    </div>
                  )}

                  {/* Items */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {wave.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                        className="flex items-start space-x-2"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-foreground-muted flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${item.completed ? "text-foreground" : "text-foreground-secondary"}`}>
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 glass gradient-bg border-border/50">
            <h2 className="text-2xl font-bold mb-4">
              Want to stay updated?
            </h2>
            <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified about major milestones, 
              new features, and development updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-surface/50 border border-border focus:border-primary focus:outline-none focus-glow"
              />
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-medium">
                Subscribe
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
