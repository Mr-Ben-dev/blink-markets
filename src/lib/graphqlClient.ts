import { cacheExchange, Client, createClient, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';

// Application-specific endpoint configuration
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'ec77531fa6d42ef1b2726b6c674ea5c99f7d075c5330692c4d3f1758ef25fe9f';
const APP_ID = import.meta.env.VITE_APPLICATION_ID || 'e48d3909d562d5ec69f307d12908762bea6f6d43aa81b35b37438a8717b4528c';
const BASE_URL = import.meta.env.VITE_LINERA_SERVICE_URL || 'http://localhost:8080';

const GRAPHQL_URL = `${BASE_URL}/chains/${CHAIN_ID}/applications/${APP_ID}`;
const WS_GRAPHQL_URL = `${BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://')}/ws`;

// WebSocket client for subscriptions
const wsClient = createWSClient({
  url: WS_GRAPHQL_URL,
  retryAttempts: 5,
  shouldRetry: () => true,
  connectionParams: {
    // Add authentication if needed
  },
});

// Main GraphQL client
export const client: Client = createClient({
  url: GRAPHQL_URL,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
  requestPolicy: 'cache-and-network',
  preferGetMethod: false, // Force POST for all operations
  fetchOptions: () => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }),
  fetch: (url, options) => {
    return fetch(url, options).then(async (response) => {
      const text = await response.text();
      // Return a new response with JSON content-type
      return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'content-type': 'application/json',
        },
      });
    });
  },
});

// Type definitions matching actual backend schema
export interface Market {
  id: number;
  creator: string;
  question: string;
  outcomes: string[];
  description: string;
  endTime: number;
  resolved: boolean;
  winningOutcome: number | null;
  totalVolume: number;
  outcomeVolumes: number[];
}

export interface Bet {
  user: string;
  marketId: number;
  outcomeIndex: number;
  amount: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  user: string;
  points: number;
  wins: number;
  totalBets: number;
  roi: number;
}

export interface PerformanceMetrics {
  blockHeight: number;
  applicationId: string;
  chainId: string;
}

// Query operations
export const MARKETS_QUERY = `
  query Markets {
    markets {
      id
      creator
      question
      outcomes
      description
      endTime
      resolved
      winningOutcome
      totalVolume
      outcomeVolumes
    }
  }
`;

export const MARKET_QUERY = `
  query Market($id: Int!) {
    market(id: $id) {
      id
      creator
      question
      outcomes
      description
      endTime
      resolved
      winningOutcome
      totalVolume
      outcomeVolumes
      bets {
        user
        marketId
        outcomeIndex
        amount
        timestamp
      }
    }
  }
`;

export const LEADERBOARD_QUERY = `
  query Leaderboard {
    leaderboard {
      user
      points
      wins
      totalBets
      roi
    }
  }
`;

export const PERFORMANCE_QUERY = `
  query Performance {
    blockHeight
    applicationId
    chainId
  }
`;

// Subscription operations
export const MARKET_UPDATES_SUBSCRIPTION = `
  subscription MarketUpdates {
    marketUpdates {
      id
      creator
      question
      outcomes
      description
      endTime
      resolved
      winningOutcome
      totalVolume
      outcomeVolumes
    }
  }
`;

export const LEADERBOARD_UPDATES_SUBSCRIPTION = `
  subscription LeaderboardUpdates {
    leaderboardUpdates {
      user
      points
      wins
      totalBets
      roi
    }
  }
`;

export const BLOCK_HEIGHT_SUBSCRIPTION = `
  subscription BlockHeightUpdates {
    blockHeightUpdates
  }
`;

// Mutation operations
export const CREATE_MARKET_MUTATION = `
  mutation CreateMarket(
    $question: String!
    $outcomes: [String!]!
    $description: String!
    $endTime: Int!
  ) {
    createMarket(
      question: $question
      outcomes: $outcomes
      description: $description
      endTime: $endTime
    )
  }
`;

export const PLACE_BET_MUTATION = `
  mutation PlaceBet(
    $marketId: Int!
    $outcomeIndex: Int!
    $amount: Int!
  ) {
    placeBet(
      marketId: $marketId
      outcomeIndex: $outcomeIndex
      amount: $amount
    )
  }
`;

export const RESOLVE_MARKET_MUTATION = `
  mutation ResolveMarket(
    $marketId: Int!
    $winningOutcome: Int!
  ) {
    resolveMarket(
      marketId: $marketId
      winningOutcome: $winningOutcome
    )
  }
`;

export const CLAIM_WINNINGS_MUTATION = `
  mutation ClaimWinnings($marketId: Int!) {
    claimWinnings(marketId: $marketId)
  }
`;

// Helper function to execute queries
export async function query<T = any>(
  queryString: string,
  variables?: Record<string, any>
): Promise<T> {
  const result = await client.query(queryString, variables).toPromise();
  
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.data as T;
}

// Helper function to execute mutations
export async function mutate<T = any>(
  mutationString: string,
  variables?: Record<string, any>
): Promise<T> {
  const result = await client.mutation(mutationString, variables).toPromise();
  
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.data as T;
}

// Helper function to subscribe
export function subscribe<T = any>(
  subscriptionString: string,
  variables?: Record<string, any>,
  callback?: (data: T) => void
) {
  const { unsubscribe } = client
    .subscription(subscriptionString, variables)
    .subscribe((result) => {
      if (result.data && callback) {
        callback(result.data as T);
      }
    });
  
  return unsubscribe;
}

export default client;
