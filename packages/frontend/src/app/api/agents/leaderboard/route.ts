import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import {
    AGENT_REGISTRY_ADDRESS,
    AGENT_REGISTRY_ABI,
} from "@/lib/agentContracts";

const monadChain = {
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
} as const;

export async function GET() {
    try {
        const publicClient = createPublicClient({
            chain: monadChain,
            transport: http("https://rpc.monad.xyz"),
        });

        const leaderboard = await publicClient.readContract({
            address: AGENT_REGISTRY_ADDRESS,
            abi: AGENT_REGISTRY_ABI,
            functionName: "getLeaderboard",
        });

        // Sort by totalYield descending
        const sortedLeaderboard = [...leaderboard].sort((a, b) => {
            if (a.totalYield > b.totalYield) return -1;
            if (a.totalYield < b.totalYield) return 1;
            return 0;
        });

        // Convert BigInt to string for JSON serialization
        const formattedLeaderboard = sortedLeaderboard.map((agent) => ({
            name: agent.name,
            strategy: agent.strategy,
            owner: agent.owner,
            totalYield: agent.totalYield.toString(),
            rebalanceCount: agent.rebalanceCount.toString(),
            createdAt: agent.createdAt.toString(),
            active: agent.active,
        }));

        return NextResponse.json(formattedLeaderboard);
    } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
