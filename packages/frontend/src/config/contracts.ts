export const CONTRACTS = {
  USDC: "0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67",
  DEX: "0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61",
  VAULT: "0x8418185C4750957A6661eDe2d740272Ea22C140f",
  OPTIMIZER: "0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3"
} as const;

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
    default: { name: "Monad Explorer", url: "https://explorer.monad.xyz" },
  },
};
