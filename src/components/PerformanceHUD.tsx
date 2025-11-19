import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  blockHeight: number;
  latency: number;
  appId: string;
  chainId: string;
  lastUpdate: Date;
  isConnected: boolean;
}

export function PerformanceHUD() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    blockHeight: 0,
    latency: 0,
    appId: 'Loading...',
    chainId: 'Loading...',
    lastUpdate: new Date(),
    isConnected: false,
  });

  useEffect(() => {
    const queryMetrics = async () => {
      try {
        const start = Date.now();
        
        // Use the full GraphQL endpoint URL from environment
        const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080';
        
        const response = await fetch(graphqlUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                blockHeight
                applicationId
                chainId
              }
            `,
          }),
        });

        const latency = Date.now() - start;
        
        if (response.ok) {
          const data = await response.json();
          
          setMetrics({
            blockHeight: data.data?.blockHeight || 0,
            latency,
            appId: data.data?.applicationId || 'N/A',
            chainId: data.data?.chainId || 'N/A',
            lastUpdate: new Date(),
            isConnected: true,
          });
        } else {
          setMetrics(prev => ({ ...prev, isConnected: false }));
        }
      } catch (error) {
        console.error('Failed to query metrics:', error);
        setMetrics(prev => ({ ...prev, isConnected: false }));
      }
    };

    // Query immediately
    queryMetrics();

    // Poll every 2 seconds
    const interval = setInterval(queryMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const truncateId = (id: string, length: number = 12) => {
    if (id.length <= length) return id;
    return `${id.slice(0, length)}...`;
  };

  return (
    <Card className="fixed top-4 right-4 z-50 bg-black/90 text-green-400 p-4 rounded-lg font-mono text-sm border-green-500/50 shadow-lg backdrop-blur-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2 border-b border-green-500/30 pb-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${metrics.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-green-300 font-bold">PERFORMANCE HUD</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-green-500/70">Block:</span>
            <span className="text-green-400 font-bold">#{metrics.blockHeight}</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span className="text-green-500/70">Latency:</span>
            <span className={`font-bold ${metrics.latency < 100 ? 'text-green-400' : metrics.latency < 500 ? 'text-yellow-400' : 'text-red-400'}`}>
              {metrics.latency}ms
            </span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span className="text-green-500/70">App ID:</span>
            <span className="text-green-400 text-xs" title={metrics.appId}>
              {truncateId(metrics.appId)}
            </span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span className="text-green-500/70">Chain ID:</span>
            <span className="text-green-400 text-xs" title={metrics.chainId}>
              {truncateId(metrics.chainId)}
            </span>
          </div>
          
          <div className="flex justify-between gap-4 pt-1 border-t border-green-500/30 mt-2">
            <span className="text-green-500/70">Updated:</span>
            <span className="text-green-400 text-xs">{formatTime(metrics.lastUpdate)}</span>
          </div>
        </div>
        
        {!metrics.isConnected && (
          <div className="text-red-400 text-xs mt-2 text-center">
            ⚠ Disconnected
          </div>
        )}
      </div>
    </Card>
  );
}
