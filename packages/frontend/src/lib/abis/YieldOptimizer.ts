export const YieldOptimizerABI = [
    {
        type: "function",
        name: "checkBestPool",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "currentPool",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getTotalAssets",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getTradeHistory",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "tuple[]",
                components: [
                    { name: "timestamp", type: "uint256" },
                    { name: "pool", type: "uint8" },
                    { name: "amount", type: "uint256" },
                    { name: "apy", type: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "poolAPY_A",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "poolAPY_B",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "totalAssets",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "vault",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "executeRebalance",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "setAPYs",
        inputs: [
            { name: "apyA", type: "uint256" },
            { name: "apyB", type: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "Rebalanced",
        inputs: [
            { name: "oldPool", type: "uint8", indexed: false },
            { name: "newPool", type: "uint8", indexed: false },
            { name: "amount", type: "uint256", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
    {
        type: "event",
        name: "FundsDeposited",
        inputs: [
            { name: "amount", type: "uint256", indexed: false },
        ],
    },
    {
        type: "event",
        name: "FundsWithdrawn",
        inputs: [
            { name: "amount", type: "uint256", indexed: false },
        ],
    },
] as const;
