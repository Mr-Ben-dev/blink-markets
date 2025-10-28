/**
 * Linera Service Client
 * Handles communication with the Linera service GraphQL endpoint
 */

export interface ChainInfo {
  chainId?: string;
  balance?: string;
  blockHeight?: number;
}

export interface ServiceStatus {
  connected: boolean;
  url: string;
  chainInfo?: ChainInfo | null;
  error?: string;
}

/**
 * Get the configured service URL from environment or default
 */
export function getServiceUrl(): string {
  return import.meta.env.VITE_LINERA_SERVICE_URL || 'http://localhost:8080';
}

/**
 * Ping the Linera service to check connectivity
 * Returns true if service responds, false otherwise
 */
export async function ping(signal?: AbortSignal): Promise<boolean> {
  try {
    const url = getServiceUrl();
    const response = await fetch(`${url}/`, { 
      method: 'GET',
      signal,
      // Short timeout for ping
      headers: { 'Accept': 'application/json' }
    });
    
    // Accept any 2xx response as "alive"
    return response.ok;
  } catch (error) {
    console.warn('Service ping failed:', error);
    return false;
  }
}

/**
 * Query the current value from the Blink Markets contract
 * This uses the GraphQL query defined in service.rs
 */
export async function queryValue(signal?: AbortSignal): Promise<number | null> {
  try {
    const url = getServiceUrl();
    const query = '{ value }';
    
    const response = await fetch(`${url}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query }),
      signal
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data?.value ?? null;
  } catch (error) {
    console.warn('Failed to query value:', error);
    return null;
  }
}

/**
 * Increment the value using the mutation
 * This calls the Increment operation defined in contract.rs
 */
export async function incrementValue(amount: number, signal?: AbortSignal): Promise<boolean> {
  try {
    const url = getServiceUrl();
    const mutation = `
      mutation IncrementValue($value: String!) {
        increment(value: $value)
      }
    `;
    
    const response = await fetch(`${url}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: { value: amount.toString() }
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Mutation request failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`Mutation errors: ${JSON.stringify(result.errors)}`);
    }

    return true;
  } catch (error) {
    console.warn('Failed to increment value:', error);
    return false;
  }
}

/**
 * Get comprehensive service status including chain info if available
 */
export async function getServiceStatus(signal?: AbortSignal): Promise<ServiceStatus> {
  const url = getServiceUrl();
  const status: ServiceStatus = {
    connected: false,
    url
  };

  try {
    // First check basic connectivity
    status.connected = await ping(signal);
    
    if (status.connected) {
      // Try to get current value which confirms GraphQL is working
      const value = await queryValue(signal);
      
      if (value !== null) {
        status.chainInfo = {
          // We don't have direct chain ID access in this simple contract
          // but we can show the current counter value as proof of connection
          balance: `Counter: ${value}`
        };
      }
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown error';
    status.connected = false;
  }

  return status;
}