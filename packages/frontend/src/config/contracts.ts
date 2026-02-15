// Core Contracts on Monad Mainnet (Chain ID: 143)
// Deployed at: Sat Feb 15 2026 12:30 UTC
export const CONTRACTS = {
  USDC: "0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67",
  DEX: "0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61",
  VAULT: "0x8418185C4750957A6661eDe2d740272Ea22C140f",
  OPTIMIZER: "0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3",
  // Agents (From 143 deployment logs)
  AGENT_REGISTRY: "0xb439530927b63de50d39bd786ec919d0edd96a68",
  AGENT_SIMULATOR: "0x8bab6b132afb57cc3be5731ce7bb89e60e4f3344",
  AGENT_ALPHA: "0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09",
  AGENT_BETA: "0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8",
  AGENT_GAMMA: "0xb2902956785b53ff2717d7b1117df05b8bfc506c",
} as const;

// Agent contract addresses array for easy indexing by agent ID (0=Alpha, 1=Beta, 2=Gamma)
export const AGENT_ADDRESSES: `0x${string}`[] = [
  CONTRACTS.AGENT_ALPHA as `0x${string}`,
  CONTRACTS.AGENT_BETA as `0x${string}`,
  CONTRACTS.AGENT_GAMMA as `0x${string}`,
];

export const MONAD_MAINNET = {
  id: 143,
  name: "Monad Mainnet",
  network: "monad",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: { http: ["https://rpc.monad.xyz"] },
    public: { http: ["https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://monadexplorer.com" },
  },
};
