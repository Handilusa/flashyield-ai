export const SimpleDEXABI = [
    {
        type: "function",
        name: "addLiquidity",
        inputs: [{ name: "usdcAmount", type: "uint256" }],
        outputs: [],
        stateMutability: "payable",
    },
    {
        type: "function",
        name: "getPrice",
        inputs: [{ name: "amountIn", type: "uint256" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "reserveMON",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "reserveUSDC",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "swapMONForUSDC",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
    },
    {
        type: "function",
        name: "swapUSDCForMON",
        inputs: [{ name: "amountIn", type: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "Swapped",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "direction", type: "string", indexed: false },
            { name: "inputAmount", type: "uint256", indexed: false },
            { name: "outputAmount", type: "uint256", indexed: false },
        ],
    },
] as const;
