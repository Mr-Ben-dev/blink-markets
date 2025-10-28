import { DemoAction } from "@/components/DemoAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Check, Code2, Copy, Terminal, Wallet } from "lucide-react";
import { useState } from "react";

export default function Developers() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const codeExamples = {
    cli: `# Install CLI
npm install -g @linera/cli

# Create wallet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Deploy your first market
linera deploy market --template prediction`,
    
    graphql: `query GetMarkets {
  markets(first: 10, status: OPEN) {
    id
    title
    volume
    probability
    endTime
  }
}

query GetUserPositions {
  user(address: "0x...") {
    positions {
      market { title }
      shares
      avgPrice
    }
  }
}`,
    
    sdk: `import { BlinkSDK } from '@blink/sdk';

const blink = new BlinkSDK({
  appId: process.env.VITE_APP_ID,
  network: 'conway-testnet'
});

// List active markets
const markets = await blink.list_markets({
  status: "open",
  category: "crypto"
});

// Place an order
const order = await blink.place_order({
  market_id: "0x123...",
  side: "YES",
  amount: 100,
  price: 0.65
});

// Get positions
const positions = await blink.get_positions({
  user: "0xabc..."
});`,
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            For Developers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Build on <span className="gradient-text">Blink Markets</span>
          </h1>
          <p className="text-xl text-foreground-secondary">
            Integrate prediction markets into your application with our comprehensive SDK, 
            GraphQL API, and agent tools powered by Linera microchains.
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Terminal className="mr-3 h-8 w-8 text-primary" />
            Quick Start
          </h2>
          
          <Card className="glass gradient-bg border-border/50 overflow-hidden">
            <div className="bg-surface/50 p-4 flex items-center justify-between border-b border-border/50">
              <span className="text-sm font-mono text-foreground-secondary">Terminal</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeExamples.cli, 'cli')}
              >
                {copiedId === 'cli' ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{codeExamples.cli}</code>
            </pre>
          </Card>
        </motion.section>

        {/* Wallet Creation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Wallet className="mr-3 h-8 w-8 text-secondary" />
            Create Your Wallet
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 glass gradient-bg border-border/50">
              <h3 className="text-xl font-bold mb-4">Faucet Wallet</h3>
              <p className="text-foreground-secondary mb-6">
                Get started instantly with testnet tokens from the Conway faucet. 
                Perfect for development and testing.
              </p>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Create Faucet Wallet
              </Button>
              <div className="mt-4 p-4 bg-surface/50 rounded-lg">
                <div className="text-xs text-foreground-muted mb-2">Wallet Address</div>
                <div className="font-mono text-sm">0x742d...bEb5</div>
                <div className="text-xs text-foreground-muted mt-2">Balance</div>
                <div className="font-bold text-primary">1000 LINERA</div>
              </div>
            </Card>

            <Card className="p-6 glass border-border/50">
              <h3 className="text-xl font-bold mb-4">Import Existing</h3>
              <p className="text-foreground-secondary mb-6">
                Already have a Linera wallet? Import your private key or seed phrase 
                to start trading immediately.
              </p>
              <Button variant="outline" className="w-full border-border">
                Import Wallet
              </Button>
              <div className="mt-4 space-y-2 text-sm text-foreground-secondary">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  Private key support
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  Seed phrase recovery
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  Hardware wallet compatible
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* GraphQL Playground */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Code2 className="mr-3 h-8 w-8 text-accent" />
            GraphQL Playground
          </h2>
          
          <Card className="glass gradient-bg border-border/50 overflow-hidden">
            <div className="bg-surface/50 p-4 flex items-center justify-between border-b border-border/50">
              <span className="text-sm font-mono text-foreground-secondary">GraphQL Query</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeExamples.graphql, 'graphql')}
              >
                {copiedId === 'graphql' ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{codeExamples.graphql}</code>
            </pre>
            <div className="p-4 bg-surface/50 border-t border-border/50">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Run Query
              </Button>
            </div>
          </Card>
        </motion.section>

        {/* Contract Addresses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Contract Addresses</h2>
          
          <Card className="p-6 glass border-border/50">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-foreground-secondary mb-1">Network</div>
                <div className="font-bold text-primary">Conway Testnet</div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">App ID</div>
                <div className="font-mono text-sm flex items-center justify-between">
                  <span>e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard('e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000', 'appid')}
                  >
                    {copiedId === 'appid' ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground-secondary mb-1">GraphQL Endpoint</div>
                <div className="font-mono text-sm flex items-center justify-between">
                  <span>http://localhost:8080</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard('http://localhost:8080', 'graphql-endpoint')}
                  >
                    {copiedId === 'graphql-endpoint' ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* SDK Example */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-success" />
            SDK Example
          </h2>
          
          <Card className="glass gradient-bg border-border/50 overflow-hidden">
            <div className="bg-surface/50 p-4 flex items-center justify-between border-b border-border/50">
              <span className="text-sm font-mono text-foreground-secondary">TypeScript</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeExamples.sdk, 'sdk')}
              >
                {copiedId === 'sdk' ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{codeExamples.sdk}</code>
            </pre>
          </Card>
        </motion.section>

        {/* Live Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Live Demo</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <p className="text-lg text-foreground-secondary mb-4">
                Try out the Blink Markets smart contract directly! This demo connects to your local 
                Linera service to query and modify the counter value in real-time.
              </p>
              <div className="space-y-3 text-sm text-foreground-secondary">
                <p>• <strong>Query:</strong> Reads the current counter value from the contract</p>
                <p>• <strong>Increment:</strong> Sends a transaction to increase the counter</p>
                <p>• <strong>Live Updates:</strong> Shows real blockchain state changes</p>
              </div>
            </div>
            <div className="lg:w-96">
              <DemoAction />
            </div>
          </div>
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Full Documentation",
                description: "Complete guides, API reference, and tutorials",
                link: "#",
              },
              {
                title: "GitHub Repository",
                description: "Open source contracts and example code",
                link: "#",
              },
              {
                title: "Discord Community",
                description: "Get help from the developer community",
                link: "#",
              },
            ].map((resource, index) => (
              <Card
                key={resource.title}
                className="p-6 glass border-border/50 hover-lift cursor-pointer"
              >
                <h3 className="font-bold mb-2">{resource.title}</h3>
                <p className="text-sm text-foreground-secondary">{resource.description}</p>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
