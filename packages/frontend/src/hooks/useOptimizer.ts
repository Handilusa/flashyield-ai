import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { YieldOptimizerABI } from "@/lib/abis/YieldOptimizer";

const OPTIMIZER = CONTRACTS.OPTIMIZER as `0x${string}`;
const USDC_DECIMALS = 6;
const REFETCH_INTERVAL = 10_000;

type Trade = {
    timestamp: bigint;
    pool: number;
    amount: bigint;
    apy: bigint;
};

export function useOptimizer() {
    const { address } = useAccount();

    // ── Reads ────────────────────────────────────────────────

    const { data: totalAssetsRaw, isLoading: isLoadingAssets } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "getTotalAssets",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    const { data: currentPoolRaw, isLoading: isLoadingPool } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "currentPool",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    const { data: bestPoolRaw } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "checkBestPool",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    const { data: apyARaw } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "poolAPY_A",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    const { data: apyBRaw } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "poolAPY_B",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    const { data: ownerAddr } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "owner",
    });

    const { data: tradeHistoryRaw, isLoading: isLoadingHistory, refetch: refetchHistory } = useReadContract({
        address: OPTIMIZER,
        abi: YieldOptimizerABI,
        functionName: "getTradeHistory",
        query: { refetchInterval: REFETCH_INTERVAL },
    });

    // ── Write (Rebalance) ────────────────────────────────────

    const {
        writeContract,
        data: hash,
        isPending,
        error: writeError,
        reset: resetWrite,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: txError,
    } = useWaitForTransactionReceipt({ hash });

    const executeRebalance = () => {
        writeContract({
            address: OPTIMIZER,
            abi: YieldOptimizerABI,
            functionName: "executeRebalance",
        });
    };

    // ── Derived values ───────────────────────────────────────

    const totalAssets = totalAssetsRaw
        ? formatUnits(totalAssetsRaw as bigint, USDC_DECIMALS)
        : "0";

    const currentPool = currentPoolRaw !== undefined
        ? Number(currentPoolRaw) === 0 ? "A" : "B"
        : "—";

    const bestPool = bestPoolRaw !== undefined
        ? Number(bestPoolRaw) === 0 ? "A" : "B"
        : "—";

    const poolApyA = apyARaw
        ? (Number(apyARaw) / 100).toFixed(2)
        : "0";

    const poolApyB = apyBRaw
        ? (Number(apyBRaw) / 100).toFixed(2)
        : "0";

    const currentAPY = currentPool === "A" ? poolApyA : currentPool === "B" ? poolApyB : "0";

    const needsRebalance = bestPool !== "—" && currentPool !== "—" && bestPool !== currentPool;

    const isOwner = address && ownerAddr
        ? address.toLowerCase() === (ownerAddr as string).toLowerCase()
        : false;

    // Parse trade history
    const trades: Trade[] = tradeHistoryRaw
        ? (tradeHistoryRaw as any[]).map((t: any) => ({
            timestamp: t.timestamp,
            pool: Number(t.pool),
            amount: t.amount,
            apy: t.apy,
        }))
        : [];

    const recentTrades = trades.slice(-5).reverse();
    const totalOperations = trades.length;

    // Estimate profit: sum of (amount * apy / 10000 / 365) as rough daily yield
    const cumulativeROI = trades.reduce((acc, t) => {
        const apy = Number(t.apy) / 100; // e.g. 8.00
        const amount = parseFloat(formatUnits(t.amount, USDC_DECIMALS));
        return acc + (amount * apy / 100 / 365); // daily approx
    }, 0);

    // Estimated profit if rebalance happens now
    const bestAPY = bestPool === "A" ? parseFloat(poolApyA) : parseFloat(poolApyB);
    const currentAPYNum = parseFloat(currentAPY);
    const apyDelta = bestAPY - currentAPYNum;
    const totalAssetsNum = parseFloat(totalAssets);
    const estimatedProfit = totalAssetsNum > 0 && apyDelta > 0
        ? ((totalAssetsNum * apyDelta) / 100 / 365).toFixed(4)
        : "0.0000";

    return {
        // Data
        totalAssets,
        currentPool,
        bestPool,
        poolApyA,
        poolApyB,
        currentAPY,
        needsRebalance,
        isOwner,
        recentTrades,
        totalOperations,
        cumulativeROI: cumulativeROI.toFixed(4),
        estimatedProfit,
        // Loading
        isLoadingAssets,
        isLoadingPool,
        isLoadingHistory,
        // Write
        executeRebalance,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error: writeError || txError,
        resetWrite,
        refetchHistory,
    };
}
