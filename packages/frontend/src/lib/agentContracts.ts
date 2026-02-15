export const AGENT_REGISTRY_ADDRESS =
    (process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS as `0x${string}`) ||
    "0xb439530927b63de50d39bd786ec919d0edd96a68";

export const AGENT_SIMULATOR_ADDRESS =
    (process.env.NEXT_PUBLIC_AGENT_SIMULATOR_ADDRESS as `0x${string}`) ||
    "0x8bab6b132afb57cc3be5731ce7bb89e60e4f3344";

export const AGENT_REGISTRY_ABI = [
    {
        type: "function",
        name: "getLeaderboard",
        inputs: [],
        outputs: [
            {
                type: "tuple[]",
                components: [
                    { name: "name", type: "string" },
                    { name: "strategy", type: "string" },
                    { name: "owner", type: "address" },
                    { name: "totalYield", type: "uint256" },
                    { name: "rebalanceCount", type: "uint256" },
                    { name: "createdAt", type: "uint256" },
                    { name: "active", type: "bool" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getAgent",
        inputs: [{ name: "agent", type: "address" }],
        outputs: [
            {
                type: "tuple",
                components: [
                    { name: "name", type: "string" },
                    { name: "strategy", type: "string" },
                    { name: "owner", type: "address" },
                    { name: "totalYield", type: "uint256" },
                    { name: "rebalanceCount", type: "uint256" },
                    { name: "createdAt", type: "uint256" },
                    { name: "active", type: "bool" },
                ],
            },
        ],
        stateMutability: "view",
    },
] as const;

export const AGENT_SIMULATOR_ABI = [
    {
        type: "function",
        name: "getAllSimAgents",
        inputs: [],
        outputs: [
            {
                type: "tuple[3]",
                components: [
                    { name: "id", type: "address" },
                    { name: "name", type: "string" },
                    { name: "strategy", type: "string" },
                    { name: "rebalanceThreshold", type: "uint256" },
                    { name: "riskLevel", type: "uint256" },
                    { name: "currentPool", type: "uint8" },
                    { name: "simulatedYield", type: "uint256" },
                    { name: "simulationCount", type: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getSimAgent",
        inputs: [{ name: "index", type: "uint256" }],
        outputs: [
            {
                type: "tuple",
                components: [
                    { name: "id", type: "address" },
                    { name: "name", type: "string" },
                    { name: "strategy", type: "string" },
                    { name: "rebalanceThreshold", type: "uint256" },
                    { name: "riskLevel", type: "uint256" },
                    { name: "currentPool", type: "uint8" },
                    { name: "simulatedYield", type: "uint256" },
                    { name: "simulationCount", type: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "recordSimulationDecision",
        inputs: [
            { name: "agentIndex", type: "uint256" },
            { name: "rebalanced", type: "bool" },
            { name: "chosenPool", type: "uint8" },
            { name: "yieldEarned", type: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
] as const;
