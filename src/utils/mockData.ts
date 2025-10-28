export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  volume: number;
  probability: number;
  endTime: string;
  status: "open" | "resolving" | "resolved" | "disputed";
  liquidity: number;
  trades: number;
  creator: string;
  oracle: string[];
  tags: string[];
}

export const categories = [
  "Sports",
  "Crypto",
  "Politics",
  "Entertainment",
  "Science",
  "Technology",
  "Finance",
  "Weather",
];

export const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin reach $100,000 by end of 2024?",
    description: "Market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before December 31, 2024 23:59:59 UTC.",
    category: "Crypto",
    volume: 847230,
    probability: 0.67,
    endTime: "2024-12-31T23:59:59Z",
    status: "open",
    liquidity: 125000,
    trades: 1847,
    creator: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
    oracle: ["CoinGecko", "Binance API", "Coinbase"],
    tags: ["crypto", "bitcoin", "price"],
  },
  {
    id: "2",
    title: "Lakers to win NBA Championship 2024-2025?",
    description: "Market resolves YES if Los Angeles Lakers win the 2024-2025 NBA Championship title.",
    category: "Sports",
    volume: 324560,
    probability: 0.34,
    endTime: "2025-06-30T23:59:59Z",
    status: "open",
    liquidity: 89000,
    trades: 923,
    creator: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    oracle: ["ESPN API", "NBA Official", "Sports Data"],
    tags: ["basketball", "nba", "lakers"],
  },
  {
    id: "3",
    title: "Ethereum 2.0 Dencun upgrade before Feb 2025?",
    description: "Will Ethereum successfully deploy the Dencun upgrade on mainnet before February 1, 2025?",
    category: "Crypto",
    volume: 567890,
    probability: 0.89,
    endTime: "2025-02-01T00:00:00Z",
    status: "open",
    liquidity: 145000,
    trades: 2341,
    creator: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    oracle: ["Etherscan", "Ethereum Foundation", "BeaconChain"],
    tags: ["ethereum", "upgrade", "dencun"],
  },
  {
    id: "4",
    title: "OpenAI to release GPT-5 in 2024?",
    description: "Market resolves YES if OpenAI officially announces and releases GPT-5 (or equivalent successor to GPT-4) in 2024.",
    category: "Technology",
    volume: 892340,
    probability: 0.42,
    endTime: "2024-12-31T23:59:59Z",
    status: "open",
    liquidity: 234000,
    trades: 3127,
    creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    oracle: ["News Aggregator", "OpenAI Blog", "Tech Crunch"],
    tags: ["ai", "openai", "gpt"],
  },
  {
    id: "5",
    title: "Temperature in NYC exceeds 100°F this summer?",
    description: "Will the temperature in New York City reach or exceed 100°F (37.8°C) at any official weather station between June 1 - September 1, 2024?",
    category: "Weather",
    volume: 156780,
    probability: 0.28,
    endTime: "2024-09-01T23:59:59Z",
    status: "open",
    liquidity: 45000,
    trades: 567,
    creator: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    oracle: ["NOAA", "Weather.gov", "AccuWeather"],
    tags: ["weather", "temperature", "nyc"],
  },
  {
    id: "6",
    title: "SpaceX Starship to reach orbit in Q1 2025?",
    description: "Will SpaceX successfully complete a full orbital flight test of Starship before March 31, 2025?",
    category: "Science",
    volume: 423890,
    probability: 0.73,
    endTime: "2025-03-31T23:59:59Z",
    status: "open",
    liquidity: 98000,
    trades: 1456,
    creator: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    oracle: ["SpaceX Official", "NASA", "Space.com"],
    tags: ["spacex", "starship", "space"],
  },
  {
    id: "7",
    title: "S&P 500 above 6000 by year end?",
    description: "Will the S&P 500 index close above 6000 points on any trading day before December 31, 2024?",
    category: "Finance",
    volume: 1234560,
    probability: 0.56,
    endTime: "2024-12-31T23:59:59Z",
    status: "open",
    liquidity: 345000,
    trades: 4123,
    creator: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
    oracle: ["Yahoo Finance", "Bloomberg", "Market Data"],
    tags: ["stocks", "sp500", "finance"],
  },
  {
    id: "8",
    title: "Taylor Swift to release new album in 2024?",
    description: "Will Taylor Swift officially release a new studio album in 2024?",
    category: "Entertainment",
    volume: 234890,
    probability: 0.61,
    endTime: "2024-12-31T23:59:59Z",
    status: "open",
    liquidity: 67000,
    trades: 892,
    creator: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
    oracle: ["Spotify API", "Billboard", "Taylor Swift Official"],
    tags: ["music", "taylor-swift", "entertainment"],
  },
];

export const stats = {
  marketsCreated: 1247,
  totalVolume: 3200000,
  activeTraders: 8431,
  oracleQueries: 42156,
  totalMarkets: 1247,
  volume24h: 847000,
  activeNow: 423,
  gasPrice: 0.001,
};
