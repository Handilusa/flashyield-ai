"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOptimizer } from "@/hooks/useOptimizer";
import { formatUnits } from "viem";
import {
    Bot,
    Zap,
    TrendingUp,
    BarChart3,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    ArrowRightLeft,
} from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

function formatTimestamp(ts: bigint): string {
    const date = new Date(Number(ts) * 1000);
    const now = Date.now();
    const diff = now - date.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function OptimizerPanel() {
    const {
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
        cumulativeROI,
        estimatedProfit,
        isLoadingAssets,
        isLoadingPool,
        isLoadingHistory,
        executeRebalance,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error,
        resetWrite,
        refetchHistory,
    } = useOptimizer();

    // Auto-reset success state after 5 seconds
    useEffect(() => {
        if (isConfirmed) {
            refetchHistory();
            const t = setTimeout(() => resetWrite(), 5000);
            return () => clearTimeout(t);
        }
    }, [isConfirmed, resetWrite, refetchHistory]);

    const isBusy = isPending || isConfirming;

    return (
        <div className="optimizer-section">
            {/* ── Header ── */}
            <div className="optimizer-header">
                <div className="optimizer-header-icon">
                    <Bot size={28} />
                </div>
                <div>
                    <h3 className="optimizer-title">AI Yield Optimizer</h3>
                    <p className="optimizer-subtitle">
                        Autonomous rebalancing between Pool A &amp; Pool B for maximum APY
                    </p>
                </div>
                <div className="optimizer-status-pill" data-active={needsRebalance ? "rebalance" : "optimal"}>
                    <span className="live-dot" />
                    {needsRebalance ? "Rebalance Available" : "Optimal"}
                </div>
            </div>

            {/* ── Stats Row ── */}
            <motion.div
                className="optimizer-stats"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div className="glass-card opt-stat" variants={fadeUp}>
                    <div className="opt-stat-icon purple"><BarChart3 size={18} /></div>
                    <span className="opt-stat-label">Current APY</span>
                    <span className="opt-stat-value">
                        {isLoadingPool ? "…" : `${currentAPY}%`}
                    </span>
                    <span className="opt-stat-sub">Pool {currentPool}</span>
                </motion.div>

                <motion.div className="glass-card opt-stat" variants={fadeUp}>
                    <div className="opt-stat-icon blue"><TrendingUp size={18} /></div>
                    <span className="opt-stat-label">Recommended</span>
                    <span className="opt-stat-value">
                        Pool {bestPool}
                    </span>
                    <span className="opt-stat-sub">
                        {bestPool === "A" ? `${poolApyA}%` : `${poolApyB}%`} APY
                    </span>
                </motion.div>

                <motion.div className="glass-card opt-stat" variants={fadeUp}>
                    <div className="opt-stat-icon green"><Zap size={18} /></div>
                    <span className="opt-stat-label">Est. Daily Profit</span>
                    <span className="opt-stat-value">
                        +{estimatedProfit} USDC
                    </span>
                    <span className="opt-stat-sub">if rebalanced now</span>
                </motion.div>

                <motion.div className="glass-card opt-stat" variants={fadeUp}>
                    <div className="opt-stat-icon orange"><AlertTriangle size={18} /></div>
                    <span className="opt-stat-label">Gas Cost</span>
                    <span className="opt-stat-value">~0.001 MON</span>
                    <span className="opt-stat-sub">estimated</span>
                </motion.div>
            </motion.div>

            {/* ── Action Button ── */}
            <div className="optimizer-action">
                <button
                    className="optimizer-btn"
                    disabled={isBusy || !needsRebalance}
                    onClick={executeRebalance}
                >
                    {isBusy ? (
                        <>
                            <Loader2 size={18} className="spin-icon" />
                            {isPending ? "Confirm in wallet…" : "Confirming…"}
                        </>
                    ) : isConfirmed ? (
                        <>
                            <CheckCircle2 size={18} />
                            Rebalance Confirmed!
                        </>
                    ) : (
                        <>
                            <ArrowRightLeft size={18} />
                            Run Optimization
                        </>
                    )}
                </button>

                {!isOwner && (
                    <p className="optimizer-warning">
                        <AlertTriangle size={14} />
                        Only the contract owner can execute rebalancing
                    </p>
                )}

                {error && (
                    <p className="optimizer-error">
                        ❌ {(error as any)?.shortMessage || error.message}
                    </p>
                )}

                {hash && (
                    <a
                        className="optimizer-tx-link"
                        href={`https://monadvision.com/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on Explorer →
                    </a>
                )}
            </div>

            {/* ── Metrics Row ── */}
            <motion.div
                className="optimizer-metrics"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <motion.div className="glass-card opt-metric" variants={fadeUp}>
                    <span className="opt-metric-value">
                        {isLoadingAssets ? "…" : `${parseFloat(totalAssets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
                    </span>
                    <span className="opt-metric-label">Total Optimized</span>
                </motion.div>
                <motion.div className="glass-card opt-metric" variants={fadeUp}>
                    <span className="opt-metric-value">{totalOperations}</span>
                    <span className="opt-metric-label">Operations</span>
                </motion.div>
                <motion.div className="glass-card opt-metric" variants={fadeUp}>
                    <span className="opt-metric-value">+{cumulativeROI} USDC</span>
                    <span className="opt-metric-label">Cumulative ROI</span>
                </motion.div>
            </motion.div>

            {/* ── History Table ── */}
            <div className="glass-card optimizer-history">
                <h4 className="optimizer-history-title">
                    <Clock size={16} />
                    Optimization History
                </h4>
                {isLoadingHistory ? (
                    <p className="optimizer-loading">Loading history…</p>
                ) : recentTrades.length === 0 ? (
                    <p className="optimizer-empty">No optimizations yet. The AI agent hasn&apos;t rebalanced.</p>
                ) : (
                    <div className="optimizer-table-wrap">
                        <table className="optimizer-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Pool</th>
                                    <th>Amount</th>
                                    <th>APY</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTrades.map((t, i) => (
                                    <tr key={i}>
                                        <td className="opt-td-time">{formatTimestamp(t.timestamp)}</td>
                                        <td>
                                            <span className={`pool-badge pool-${t.pool === 0 ? "a" : "b"}`}>
                                                Pool {t.pool === 0 ? "A" : "B"}
                                            </span>
                                        </td>
                                        <td>{parseFloat(formatUnits(t.amount, 6)).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</td>
                                        <td className="opt-td-apy">{(Number(t.apy) / 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
