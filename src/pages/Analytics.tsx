import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-foreground-secondary">
            Platform metrics and market insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: "Total Volume", value: "$3.2M", change: "+12.5%" },
            { icon: Users, label: "Active Traders", value: "8,431", change: "+8.3%" },
            { icon: Activity, label: "Markets", value: "1,247", change: "+23" },
            { icon: TrendingUp, label: "24h Volume", value: "$847K", change: "+15.2%" },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 glass gradient-bg border-border/50">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="text-sm text-success">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-foreground-secondary">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Card className="p-8 glass border-border/50 text-center">
          <Activity className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
          <p className="text-foreground-secondary">
            Detailed analytics dashboard with charts, trends, and insights
          </p>
        </Card>
      </div>
    </div>
  );
}
