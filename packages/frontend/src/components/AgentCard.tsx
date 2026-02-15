"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAgentContract } from "@/hooks/useAgentContract";

interface AgentCardProps {
    rank: number;
    name: string;
    strategy: string;
    yield: string;
    rebalances: number;
    riskLevel: number;
    lastAction?: string;
    lastActionTime?: string;
    apyDelta?: number;
    threshold?: number;
    agentAddress?: `0x${string}`;
}

export function AgentCard({
    rank,
    name,
    strategy,
    yield: agentYield,
    rebalances,
    riskLevel,
    lastAction,
    lastActionTime,
    apyDelta,
    threshold,
    agentAddress,
}: AgentCardProps) {
    const [prevRank, setPrevRank] = useState(rank);
    const [trend, setTrend] = useState<"up" | "down" | "same">("same");
    const stats = useAgentContract(agentAddress);
    console.log("📊 Reading stats from:", agentAddress);
    console.log("Stats result:", stats);

    useEffect(() => {
        if (rank < prevRank) setTrend("up");
        else if (rank > prevRank) setTrend("down");
        else setTrend("same");
        setPrevRank(rank);
    }, [rank, prevRank]);

    const getRankGradient = (r: number) => {
        switch (r) {
            case 1:
                return "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.02))";
            case 2:
                return "linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.02))";
            case 3:
                return "linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.02))";
            default:
                return "var(--surface)";
        }
    };

    const getRankBorder = (r: number) => {
        switch (r) {
            case 1:
                return "1px solid rgba(255, 215, 0, 0.3)";
            case 2:
                return "1px solid rgba(192, 192, 192, 0.3)";
            case 3:
                return "1px solid rgba(205, 127, 50, 0.3)";
            default:
                return "1px solid var(--border)";
        }
    };

    const getMedal = (r: number) => {
        if (r === 1) return "🥇";
        if (r === 2) return "🥈";
        if (r === 3) return "🥉";
        return `#${r}`;
    };

    const progressPercent =
        apyDelta && threshold ? Math.min((apyDelta / threshold) * 100, 100) : 0;

    return (
        <motion.div
            layout
            className="glass-card relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                background: getRankGradient(rank),
                borderColor: getRankBorder(rank).split(" ")[2],
            }}
            style={{
                border: getRankBorder(rank),
                marginBottom: "1rem",
            }}
        >
            {/* Pulse effect on rebalance */}
            {lastAction === "REBALANCE" && (
                <motion.div
                    className="absolute inset-0 bg-green-500/10 z-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            )}

            <div className="relative z-10 flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center w-8">
                        <span className="text-2xl font-bold">{getMedal(rank)}</span>
                        {trend === "up" && <span className="text-green-400 text-xs">▲</span>}
                        {trend === "down" && <span className="text-red-400 text-xs">▼</span>}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {name}
                            {lastAction === "REBALANCE" && (
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                                    REBALANCED
                                </span>
                            )}
                        </h3>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">
                            {strategy}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                        {parseFloat(agentYield).toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                        Simulated Yield
                        {lastActionTime && (
                            <span className="text-gray-500">• {lastActionTime}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                {/* Risk Level */}
                <div>
                    <span className="text-xs text-gray-400 block mb-1">Risk Level</span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < riskLevel ? "bg-purple-500" : "bg-gray-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Rebalance Actions */}
                <div className="text-right">
                    <span className="text-sm font-semibold text-gray-300 block">
                        {rebalances}
                    </span>
                    <span className="text-xs text-gray-400">Total Rebalances</span>
                </div>

                {/* Threshold Progress */}
                {threshold && (
                    <div className="col-span-2 mt-1">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Threshold Progress</span>
                            <span>{progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── On-Chain Stats Section ── */}
            {agentAddress && (
                <div className="relative z-10 mt-4 pt-4 border-t-2 border-green-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                            Live Contract
                        </span>
                        <a
                            href={`https://monadexplorer.com/address/${agentAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors group/link"
                        >
                            {agentAddress.slice(0, 6)}...{agentAddress.slice(-4)}
                        </a>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-center">
                            <span className="text-sm font-bold text-green-400 block">
                                {stats.isLoading ? "…" : stats.totalRebalances}
                            </span>
                            <span className="text-[10px] text-gray-400">Rebalances</span>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-center">
                            <span className="text-sm font-bold text-green-400 block">
                                {stats.isLoading ? "…" : stats.currentPool === 0 ? "A" : "B"}
                            </span>
                            <span className="text-[10px] text-gray-400">Current Pool</span>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 text-center">
                            <span className="text-sm font-bold text-green-400 block">
                                {stats.isLoading ? "…" : `${stats.lifetimeProfit}`}
                            </span>
                            <span className="text-[10px] text-gray-400">Profit (USDC)</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
