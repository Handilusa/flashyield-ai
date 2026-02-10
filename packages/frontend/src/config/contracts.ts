export const CONTRACTS = {
    USDC: '0x594725CEfb4629C0074cA373A2438dF2EC2ae8D3',
    DEX: '0x0Eb1b0A45941549e8228C6cEB26DeC7869373500',
    VAULT: '0xd7Cb692d9bE2fB8c77088bDB9473578274E1686d',
    OPTIMIZER: '0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85'
} as const;

export const MONAD_TESTNET = {
    id: 10143,
    name: "Monad Testnet",
    network: "monad-testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Monad",
        symbol: "MON",
    },
    rpcUrls: {
        default: { http: ["https://testnet-rpc.monad.xyz"] },
        public: { http: ["https://testnet-rpc.monad.xyz"] },
    },
    blockExplorers: {
        default: { name: "Monad Explorer", url: "https://testnet.monad.xyz" },
    },
    testnet: true,
};
