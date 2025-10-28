import { incrementValue, queryValue } from '@/lib/lineraClient';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function DemoAction() {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [incrementAmount, setIncrementAmount] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const value = await queryValue();
      setCurrentValue(value);
      setLastAction('Queried current value');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query value');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    const amount = parseInt(incrementAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const success = await incrementValue(amount);
      if (success) {
        setLastAction(`Incremented by ${amount}`);
        // Refresh the current value after increment
        setTimeout(async () => {
          const newValue = await queryValue();
          setCurrentValue(newValue);
        }, 1000);
      } else {
        setError('Failed to increment value');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment value');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Demo Action
          <Badge variant="outline">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Value Display */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <Label>Current Value:</Label>
            <div className="font-mono text-lg">
              {currentValue !== null ? currentValue : '?'}
            </div>
          </div>
        </div>

        {/* Query Button */}
        <Button 
          onClick={handleQuery} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Querying...' : 'Query Current Value'}
        </Button>

        {/* Increment Section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="increment-amount">Increment Amount:</Label>
            <Input
              id="increment-amount"
              type="number"
              min="1"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
              placeholder="Enter amount to increment"
            />
          </div>
          
          <Button 
            onClick={handleIncrement} 
            disabled={loading || !incrementAmount}
            className="w-full"
          >
            {loading ? 'Incrementing...' : `Increment by ${incrementAmount}`}
          </Button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        {lastAction && !error && (
          <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
            ✅ {lastAction}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p>This demo interacts with the Blink Markets smart contract deployed on Linera. 
          It queries and modifies a simple counter value to demonstrate end-to-end functionality.</p>
        </div>
      </CardContent>
    </Card>
  );
}