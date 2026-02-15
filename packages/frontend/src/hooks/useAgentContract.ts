import { useReadContract } from "wagmi";
import { BASE_AGENT_ABI } from "@/lib/abis/BaseAgent";

const REFETCH_INTERVAL = 12_000;

export interface AgentOnChainStats {
    totalRebalances: number;
    currentPool: number;
    lifetimeProfit: number;
    threshold: number;
    isLoading: boolean;
}

export function useAgentContract(address?: `0x${string}`): AgentOnChainStats {
    const { data, isLoading } = useReadContract({
        address: address,
        abi: BASE_AGENT_ABI,
        functionName: "getStats",
        query: {
            enabled: !!address,
            refetchInterval: REFETCH_INTERVAL,
        },
    });

    if (!data || !address) {
        return {
            totalRebalances: 0,
            currentPool: 0,
            lifetimeProfit: 0,
            threshold: 0,
            isLoading,
        };
    }

    const [totalRebalances, currentPool, lifetimeProfit, threshold] = data as [bigint, number, bigint, bigint];

    return {
        totalRebalances: Number(totalRebalances),
        currentPool: Number(currentPool),
        lifetimeProfit: Number(lifetimeProfit),
        threshold: Number(threshold),
        isLoading,
    };
}
