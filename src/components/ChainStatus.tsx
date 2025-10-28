import { getServiceStatus, type ServiceStatus } from '@/lib/lineraClient';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export function ChainStatus() {
  const [status, setStatus] = useState<ServiceStatus>({
    connected: false,
    url: 'http://localhost:8080'
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const network = import.meta.env.VITE_NETWORK || 'testnet';

  const checkStatus = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const serviceStatus = await getServiceStatus(signal);
      setStatus(serviceStatus);
      setLastUpdate(new Date());
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Failed to check chain status:', error);
        setStatus(prev => ({
          ...prev,
          connected: false,
          error: error.message
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    // Initial check
    checkStatus(controller.signal);
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (!controller.signal.aborted) {
        checkStatus(controller.signal);
      }
    }, 10000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const getStatusBadge = () => {
    if (loading) {
      return <Badge variant="outline">Checking...</Badge>;
    }
    
    if (status.connected) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">✅ Connected</Badge>;
    }
    
    return <Badge variant="destructive">❌ Disconnected</Badge>;
  };

  const getNetworkBadge = () => {
    const isDemoMode = !status.connected;
    
    if (isDemoMode) {
      return <Badge variant="secondary">Demo Mode</Badge>;
    }
    
    const variant = network === 'testnet' ? 'default' : 'outline';
    return <Badge variant={variant as "default" | "outline"}>{network}</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          Chain Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Network:</span>
          {getNetworkBadge()}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Service:</span>
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {status.url}
          </code>
        </div>

        {status.chainInfo && (
          <>
            <Separator />
            <div className="space-y-2">
              {status.chainInfo.balance && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">State:</span>
                  <span className="font-mono text-xs">{status.chainInfo.balance}</span>
                </div>
              )}
              
              {status.chainInfo.chainId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {status.chainInfo.chainId.slice(0, 8)}...
                  </code>
                </div>
              )}
            </div>
          </>
        )}

        {status.error && (
          <>
            <Separator />
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
              {status.error}
            </div>
          </>
        )}

        {!status.connected && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              Service unreachable. Using mock data for demo.
            </div>
          </>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Last updated:</span>
          <span>{lastUpdate.toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}