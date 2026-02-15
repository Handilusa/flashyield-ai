"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWriteContract } from "wagmi"; // [NEW] Wagmi hooks
import { waitForTransactionReceipt, readContract } from "wagmi/actions";
import { useQueryClient } from "@tanstack/react-query"; // [NEW] // [NEW] for waiting & reading
import { config } from "@/components/Providers"; // [NEW] Imported from Providers
import { Navbar } from "@/components/Navbar";
import { AgentCard } from "@/components/AgentCard";
import { LiveActivityFeed, ActivityItem } from "@/components/LiveActivityFeed";
import { SeasonControls } from "@/components/SeasonControls";
// New Components
import { YieldChart } from "@/components/YieldChart";
import { AgentStats } from "@/components/AgentStats";
import { RebalanceHistory, HistoryItem } from "@/components/RebalanceHistory";
import { SeasonSummary } from "@/components/SeasonSummary";
import { RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react"; // [NEW] Icons
import { AGENT_SIMULATOR_ADDRESS, AGENT_SIMULATOR_ABI } from "@/lib/agentContracts"; // [NEW] ABI
import { AGENT_ADDRESSES } from "@/config/contracts";
import { BASE_AGENT_ABI } from "@/lib/abis/BaseAgent";
import { MarketTicker } from "@/components/MarketTicker"; // [NEW]

interface AgentData {
    id: string;
    name: string;
    strategy: string;
    rebalanceThreshold: string;
    riskLevel: string;
    currentPool: string;
    simulatedYield: string;
    simulationCount: string;
    lastAction?: string;
    lastActionTime?: string;
    apyDelta?: number;
    // Stats tracking
    totalRebalances?: number;
    successfulRebalances?: number;
    bestMove?: number;
    totalDeltaCaptured?: number;
    poolEntryTime?: number;
}

interface PendingRebalance {
    agentId: number;
    agentName: string;
    fromPool: string;
    toPool: string;
    expectedProfit: number;
    apyDelta: number;
    timestamp: Date;
    rawArgs: {
        poolABps: bigint;
        poolBBps: bigint;
        profitScaled: bigint;
    };
}

export default function LeaderboardPage() {
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    // Advanced State
    const [chartData, setChartData] = useState<any[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<"rankings" | "chart" | "history" | "stats">("rankings");
    const [showSummary, setShowSummary] = useState(false);
    const [marketData, setMarketData] = useState<{ [key: string]: number } | null>(null); // [NEW]

    // Season State
    const [isSeasonActive, setIsSeasonActive] = useState(false);
    const [seasonTimer, setSeasonTimer] = useState(0);
    const [simulationCount, setSimulationCount] = useState(0);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

    // [NEW] On-Chain Recording State
    const [enableOnChain, setEnableOnChain] = useState(false);
    const [pendingRebalances, setPendingRebalances] = useState<PendingRebalance[]>([]);
    const [approvedTxCount, setApprovedTxCount] = useState(0);
    const { writeContract, writeContractAsync } = useWriteContract(); // Use Async for await
    const { isConnected } = useAccount();
    const MAX_DEMO_TXS = 3;

    // Agent name → contract address mapping
    const getAgentAddress = (agentName: string): `0x${string}` | undefined => {
        if (agentName.includes("Alpha")) return AGENT_ADDRESSES[0];
        if (agentName.includes("Beta")) return AGENT_ADDRESSES[1];
        if (agentName.includes("Gamma")) return AGENT_ADDRESSES[2];
        return undefined;
    };

    // Execute strategy on individual agent contract
    const executeAgentStrategy = (agentId: number, poolABps: bigint, poolBBps: bigint, profitScaled: bigint) => {
        const contractAddress = AGENT_ADDRESSES[agentId];
        if (!contractAddress) return;

        console.log("🔥 REBALANCE DETECTED for Agent:", agentId);
        console.log("Agent ID:", agentId);
        console.log("Wallet connected:", isConnected);
        console.log("Toggle enabled:", enableOnChain);
        console.log("Contract address:", contractAddress);

        console.log("Contract address:", contractAddress);

        // Args are already BigInt when called from approval
        console.log("🚨 CALLING executeAgentStrategy NOW");
        console.log("Args to contract (BPS/Scaled):", poolABps, poolBBps, profitScaled);

        try {
            writeContract({
                address: contractAddress,
                abi: BASE_AGENT_ABI,
                functionName: "executeStrategy",
                args: [poolABps, poolBBps, profitScaled],
                gas: 500000n, // Ensure enough gas
            }, {
                onSuccess: (data) => {
                    console.log("✅ COMMAND SENT. TX HASH:", data);
                    showToast(`🔗 Agent ${["Alpha", "Beta", "Gamma"][agentId]} strategy executed on-chain!`);
                },
                onError: (err) => {
                    console.error("❌ TX FAILED:", err);
                    console.error("Error message:", err.message);
                }
            });
        } catch (e: any) {
            console.error("❌ executeAgentStrategy EXCEPTION:", e);
            console.error("Exception message:", e.message);
        }
    };

    const prevLeaderRef = useRef<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const simRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Initial Fetch
    useEffect(() => {
        fetchInitialData();
        return () => stopSeason();
    }, []);

    const fetchInitialData = async () => {
        try {
            const res = await fetch("/api/agents/simulate");
            if (res.ok) {
                const data = await res.json();
                // Initialize dynamic stats
                const hydratedData = data.map((a: any) => ({
                    ...a,
                    totalRebalances: 0,
                    successfulRebalances: 0,
                    bestMove: 0,
                    totalDeltaCaptured: 0,
                    poolEntryTime: Date.now()
                }));

                const sorted = hydratedData.sort(
                    (a: any, b: any) => Number(b.simulatedYield) - Number(a.simulatedYield)
                );
                setAgents(sorted);
                if (sorted.length > 0) prevLeaderRef.current = sorted[0].id;
            }
        } catch (e) {
            console.error("Initial fetch failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Season Logic
    const startSeason = () => {
        if (isSeasonActive) {
            showToast("Season already running!");
            return;
        }

        console.log(`🎮 Starting season with mode: ${enableOnChain ? 'ON-CHAIN ⛓️' : 'OFF-CHAIN 💨'}`);
        setIsSeasonActive(true);
        setSeasonTimer(0);
        setSimulationCount(0);
        setActivities([]);
        setChartData([]);
        setHistory([]);
        setShowSummary(false);

        // Reset agent stats visual only (keep base config)
        setAgents(prev => prev.map(a => ({
            ...a,
            simulatedYield: "0.0000",
            simulationCount: "0",
            totalRebalances: 0,
            successfulRebalances: 0,
            bestMove: 0,
            totalDeltaCaptured: 0,
            poolEntryTime: Date.now()
        })));

        timerRef.current = setInterval(() => {
            setSeasonTimer((prev) => prev + 1);
        }, 1000);

        runSimulation();
        simRef.current = setInterval(runSimulation, 10000);
    };

    const stopSeason = () => {
        setIsSeasonActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (simRef.current) clearInterval(simRef.current);
        timerRef.current = null;
        simRef.current = null;

        // Show summary only if we actually ran something
        if (simulationCount > 0) {
            setShowSummary(true);
        }
    };

    const resetSeason = () => {
        stopSeason();
        setShowSummary(false);
        fetchInitialData(); // Hard reset
        setChartData([]);
        setHistory([]);
        setActivities([]);
        setSeasonTimer(0);
        setSimulationCount(0);
    };

    const runSimulation = async () => {
        try {
            const res = await fetch("/api/agents/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agents }),
            });

            if (!res.ok) throw new Error("Simulation API failed");

            const { results, marketData: newMarketData } = await res.json(); // [NEW] destructure marketData

            if (newMarketData) setMarketData(newMarketData); // [NEW] update state

            handleSimulationResults(results, newMarketData || null);
            setSimulationCount((prev) => prev + 1);
        } catch (error) {
            console.error("Simulation run error:", error);
            showToast("❌ Simulation failed. Check console.");
            stopSeason();
        }
    };

    const handleSimulationResults = (results: any[], simMarketData: any) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

        // Snapshot for Chart
        const chartPoint: any = { time: timestamp };

        // [NEW] Check for on-chain recording — execute on each agent's individual contract
        if (enableOnChain && isConnected) {
            console.log("✅ Conditions met for on-chain execution. Processing results...");
            results.forEach((r: any) => {
                // Only execute if action is REBALANCE
                if (r.action === "REBALANCE") {
                    let agentIndex = 0;
                    if (r.name?.includes("Beta")) agentIndex = 1;
                    if (r.name?.includes("Gamma")) agentIndex = 2;

                    // Use market APY data if available, else defaults
                    const poolAApy = simMarketData?.poolA_apy ? Math.floor(simMarketData.poolA_apy * 100) : 500;
                    const poolBApy = simMarketData?.poolB_apy ? Math.floor(simMarketData.poolB_apy * 100) : 800;
                    const profitRaw = (r.yieldGain || 0) * 1000000;

                    const poolABps = BigInt(poolAApy);
                    const poolBBps = BigInt(poolBApy);
                    const profitScaled = BigInt(Math.floor(profitRaw));

                    // Add to Pending Queue instead of executing
                    setPendingRebalances(prev => {
                        // FIX: Remove any existing pending rebalance for this agent (replace with new one)
                        const filtered = prev.filter(p => p.agentId !== agentIndex);

                        return [...filtered, {
                            agentId: agentIndex,
                            agentName: r.name,
                            fromPool: r.fromPool,
                            toPool: r.toPool,
                            expectedProfit: profitRaw / 1000000,
                            apyDelta: r.apyDelta,
                            timestamp: new Date(),
                            rawArgs: { poolABps, poolBBps, profitScaled }
                        }]
                    });

                    showToast(`💡 New Rebalance Proposal for ${r.name}`);

                    showToast(`💡 New Rebalance Proposal for ${r.name}`);
                }
            });
        } else {
            if (results.some((r: any) => r.action === "REBALANCE")) {
                console.log("ℹ️ Rebalance detected but not executing on-chain.");
                console.log("- Toggle enabled:", enableOnChain);
                console.log("- Wallet connected:", isConnected);
            }
        }

        setAgents((prevAgents) => {
            const updatedAgents = prevAgents.map((agent) => {
                const result = results.find((r: any) => r.agentId === agent.id);
                if (!result) return agent;

                const newYield = parseFloat(agent.simulatedYield) + result.yieldGain;
                const newCount = parseInt(agent.simulationCount) + 1;
                const isRebalance = result.action === "REBALANCE";

                // Update Chart Point
                const shortName = agent.name.replace("Agent ", ""); // "Alpha", "Beta"
                chartPoint[shortName] = newYield;

                // Stats tracking
                const totalRebalances = (agent.totalRebalances || 0) + (isRebalance ? 1 : 0);
                const successfulRebalances = (agent.successfulRebalances || 0) + (isRebalance && result.yieldGain > 0 ? 1 : 0); // Simplified success check
                const bestMove = Math.max((agent.bestMove || 0), isRebalance ? result.yieldGain * 10000 : 0); // approx bps
                const totalDeltaCaptured = (agent.totalDeltaCaptured || 0) + (isRebalance ? result.apyDelta : 0);
                let poolEntryTime = agent.poolEntryTime || Date.now();
                if (isRebalance) poolEntryTime = Date.now();

                // History Log
                if (isRebalance) {
                    setHistory(prev => [{
                        id: Date.now().toString() + agent.id,
                        time: timestamp,
                        agentName: agent.name,
                        fromPool: result.fromPool,
                        toPool: result.toPool,
                        delta: result.apyDelta,
                        yieldImpact: result.yieldGain
                    }, ...prev].slice(0, 50));
                }

                return {
                    ...agent,
                    simulatedYield: newYield.toFixed(4),
                    simulationCount: newCount.toString(),
                    currentPool: isRebalance ? result.toPool : agent.currentPool,
                    lastAction: result.action,
                    lastActionTime: "Just now",
                    apyDelta: result.apyDelta,
                    totalRebalances,
                    successfulRebalances,
                    bestMove,
                    totalDeltaCaptured,
                    poolEntryTime
                };
            });

            const sorted = updatedAgents.sort(
                (a, b) => Number(b.simulatedYield) - Number(a.simulatedYield)
            );

            // Check leader change
            if (sorted.length > 0) {
                const newLeader = sorted[0];
                if (prevLeaderRef.current && prevLeaderRef.current !== newLeader.id) {
                    showToast(
                        `🏆 ${newLeader.name} takes the lead with ${newLeader.simulatedYield}% yield!`
                    );
                }
                prevLeaderRef.current = newLeader.id;
            }

            return sorted;
        });

        setChartData(prev => [...prev, chartPoint].slice(-20)); // Keep last 20

        // Update Activity Log
        const newActivities = results
            .filter((r: any) => r.action === "REBALANCE") // Only show rebalances to reduce spam
            .map((r: any) => {
                const time = new Date().toLocaleTimeString();
                return {
                    id: Date.now() + Math.random(),
                    message: `${r.name} rebalanced to ${r.toPool} (Delta: ${r.apyDelta.toFixed(
                        0
                    )}bps)`,
                    timestamp: time,
                    type: "rebalance",
                } as ActivityItem;
            });

        if (newActivities.length > 0) {
            setActivities((prev) => [...newActivities, ...prev].slice(0, 50));
        }
    };

    const showToast = (msg: string) => {
        setToast({ message: msg, visible: true });
        setTimeout(() => setToast(null), 3000);
    };

    const handleApproveRebalance = async (rebalance: PendingRebalance, index: number) => {
        try {
            const agentAddress = AGENT_ADDRESSES[rebalance.agentId];
            // Polyfill poolAApy/poolBapy from rawArgs to satisfy user logic (reversing BPS)
            const poolAApy = Number(rebalance.rawArgs.poolABps) / 10000;
            const poolBapy = Number(rebalance.rawArgs.poolBBps) / 10000;

            console.log("🚀 ========================================");
            console.log("🚀 STARTING REBALANCE #" + (approvedTxCount + 1));
            console.log("🚀 Agent:", rebalance.agentName);
            console.log("🚀 Address:", agentAddress);

            // ========================================
            // 1️⃣ LEER ESTADO ANTES DE TX
            // ========================================
            const statsBefore = await readContract(config, {
                address: agentAddress as `0x${string}`,
                abi: BASE_AGENT_ABI,
                functionName: 'getStats'
            });

            // Cast to array as per ABI
            const statsArray = statsBefore as unknown as any[];

            console.log("📊 BEFORE TX:");
            console.log("  - totalRebalances:", Number(statsArray[0]));
            // Use logical field names in log for clarity
            console.log("  - currentPool:", statsArray[1]);
            console.log("  - lifetimeProfit:", Number(statsArray[2]));
            console.log("  - threshold:", Number(statsArray[3]));

            // ========================================
            // 2️⃣ CALCULAR ARGS
            // ========================================
            // User formula logic preserved
            const poolABps = Math.floor(poolAApy * 10000);
            const poolBBps = Math.floor(poolBapy * 10000);
            const deltaBps = Math.abs(poolBBps - poolABps);
            const thresholdBps = Number(statsArray[3]); // Usar threshold del contrato
            const profitScaled = Math.floor(Math.abs(rebalance.expectedProfit) * 1e6);

            console.log("🔢 TX ARGS:");
            console.log("  - poolAApy:", poolAApy, "→", poolABps, "bps");
            console.log("  - poolBapy:", poolBapy, "→", poolBBps, "bps");
            console.log("  - Delta:", deltaBps, "bps");
            console.log("  - Threshold:", thresholdBps, "bps");
            console.log("  - Profit:", profitScaled);
            console.log("  - Will increment?", deltaBps >= thresholdBps ? "✅ YES" : "❌ NO");

            if (deltaBps < thresholdBps) {
                console.error("❌ DELTA TOO SMALL! Contract will NOT increment!");
                alert(`Delta (${deltaBps}) < Threshold (${thresholdBps}). Contract won't increment!`);
                return;
            }

            // ========================================
            // 3️⃣ ENVIAR TX
            // ========================================
            console.log("📤 Sending TX...");
            const hash = await writeContractAsync({
                address: agentAddress as `0x${string}`,
                abi: BASE_AGENT_ABI,
                functionName: 'executeStrategy',
                args: [BigInt(poolABps), BigInt(poolBBps), BigInt(profitScaled)]
            });

            console.log("✅ TX SENT:", hash);

            // ========================================
            // 4️⃣ ESPERAR 6 SEGUNDOS
            // ========================================
            console.log("⏳ Waiting 6 seconds for Monad to process...");
            await new Promise(resolve => setTimeout(resolve, 6000));

            // ========================================
            // 5️⃣ LEER ESTADO DESPUÉS DE TX
            // ========================================
            console.log("🔄 Reading stats AFTER TX...");
            const statsAfter = await readContract(config, {
                address: agentAddress as `0x${string}`,
                abi: BASE_AGENT_ABI,
                functionName: 'getStats'
            });
            const statsAfterArray = statsAfter as unknown as any[];

            console.log("📊 AFTER TX:");
            console.log("  - totalRebalances:", Number(statsAfterArray[0]));
            console.log("  - currentPool:", statsAfterArray[1]);
            console.log("  - lifetimeProfit:", Number(statsAfterArray[2]));

            // ========================================
            // 6️⃣ COMPARAR
            // ========================================
            const beforeCount = Number(statsArray[0]);
            const afterCount = Number(statsAfterArray[0]);

            console.log("🔍 COMPARISON:");
            console.log("  - Before:", beforeCount);
            console.log("  - After:", afterCount);
            console.log("  - Changed?", afterCount > beforeCount ? "✅ YES!" : "❌ NO!");

            if (afterCount > beforeCount) {
                console.log("✅✅✅ SUCCESS! INCREMENT WORKED!");
                showToast(`✅ Rebalance recorded! ${beforeCount} → ${afterCount}`);
            } else {
                console.error("❌❌❌ FAILED! NO INCREMENT!");
                console.error("Check if delta >= threshold in contract!");
                showToast("❌ Rebalance did not increment on-chain");
            }

            // ========================================
            // 7️⃣ FORCE REFETCH
            // ========================================
            queryClient.invalidateQueries();
            setApprovedTxCount(prev => prev + 1);

            console.log("🚀 ========================================");

        } catch (error: any) {
            console.error("❌ ERROR:", error);
            showToast("❌ TX failed: " + (error.message || "Unknown error"));
        }
    };

    const handleDismissRebalance = (index: number) => {
        setPendingRebalances(prev => prev.filter((_, i) => i !== index));
    };

    // Helper for Stats
    const getAgentStats = () => {
        return agents.map(a => ({
            id: a.id,
            name: a.name,
            totalRebalances: a.totalRebalances || 0,
            successRate: a.totalRebalances ? (a.successfulRebalances || 0) / a.totalRebalances : 0,
            avgDelta: a.totalRebalances ? (a.totalDeltaCaptured || 0) / a.totalRebalances : 0,
            bestMove: a.bestMove || 0,
            currentPool: a.currentPool,
            timeInPool: Math.floor((Date.now() - (a.poolEntryTime || Date.now())) / 1000) + "s"
        }));
    }

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-gray-100 font-sans selection:bg-purple-500/30">
            <div className="bg-animated">
                <div className="bg-grid" />
                <div className="bg-mesh" />
                <div className="bg-noise" />
            </div>

            <div className="page-content relative z-10">
                <Navbar />

                {/* Season Summary Modal */}
                <SeasonSummary
                    isOpen={showSummary}
                    onClose={() => setShowSummary(false)}
                    onReset={resetSeason}
                    winner={agents.length > 0 ? { id: agents[0].id, name: agents[0].name, finalYield: agents[0].simulatedYield, rank: 1 } : null}
                    agents={agents.map((a, i) => ({ id: a.id, name: a.name, finalYield: a.simulatedYield, rank: i + 1 }))}
                />

                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, x: 20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-24 right-4 z-50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl flex items-center gap-3"
                        >
                            <span className="text-2xl">🏆</span>
                            <div>
                                <p className="text-yellow-100 font-bold text-sm">Update</p>
                                <p className="text-yellow-200 text-xs">{toast.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* [NEW] Active Mode Badge */}
                {isSeasonActive && (
                    <div className="fixed top-24 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 px-4 py-2 rounded-full shadow-lg animate-pulse backdrop-blur-md border border-white/10">
                        <div className={`
                            flex items-center gap-2 
                            ${enableOnChain ? 'text-emerald-400' : 'text-blue-400'} 
                            font-bold text-sm tracking-wider
                        `}>
                            {enableOnChain ? '⛓️ ON-CHAIN MODE' : '💨 OFF-CHAIN MODE'}
                            <span className="text-xs opacity-75 font-normal">(Active)</span>
                        </div>
                    </div>
                )}

                {/* Pending Rebalances Notification Stack */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                    <AnimatePresence>
                        {pendingRebalances.map((rebalance, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="pointer-events-auto bg-gray-900/95 border border-purple-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-xl w-80"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">Better Route Found!</p>
                                        <p className="text-xs text-purple-300 font-medium mb-1">Agent {rebalance.agentName}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{rebalance.fromPool === "0" ? "Pool A" : rebalance.fromPool === "1" ? "Pool B" : rebalance.fromPool}</span>
                                            <span className="text-gray-600">→</span>
                                            <span className="text-white font-bold">{rebalance.toPool === "0" ? "Pool A" : rebalance.toPool === "1" ? "Pool B" : rebalance.toPool}</span>
                                        </div>
                                        <p className="text-xs text-emerald-400 mt-1 font-mono">
                                            +{rebalance.expectedProfit.toFixed(4)} USDC
                                            <span className="opacity-75 ml-1">({rebalance.apyDelta.toFixed(0)}bps)</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApproveRebalance(rebalance, index)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                    >
                                        Approve & Exec ({approvedTxCount}/{MAX_DEMO_TXS})
                                    </button>
                                    <button
                                        onClick={() => handleDismissRebalance(index)}
                                        className="px-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <main className="section pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 font-medium mb-4 backdrop-blur-md">
                            <span className="live-dot" /> Live Season
                        </div>
                        <h1 className="hero-title mb-4 max-w-3xl mx-auto">
                            <span className="gradient-text">Agent Simulation Arena</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                            Start the season to watch autonomous AI agents compete for yield in real-time.
                        </p>

                        {/* [NEW] Market Ticker */}
                        <MarketTicker marketData={marketData} />

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-4">
                            <SeasonControls
                                isActive={isSeasonActive}
                                onStart={startSeason}
                                onStop={stopSeason}
                                timer={seasonTimer}
                                simulationCount={simulationCount}
                            />

                            {/* [NEW] On-Chain Toggle */}
                            <div className="flex items-center gap-2 mt-4 relative" title={isSeasonActive ? "Cannot change mode during active season" : "Toggle On-Chain recording"}>
                                <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${isSeasonActive ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-800' :
                                    enableOnChain
                                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                        : "bg-gray-800/50 border-gray-700 text-gray-500 hover:text-gray-300"
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={enableOnChain}
                                        onChange={(e) => {
                                            if (isSeasonActive) {
                                                showToast("⚠️ Cannot change On-Chain mode during active season!");
                                                return;
                                            }
                                            const newValue = e.target.checked;
                                            console.log("🔘 Toggle clicked. Previous:", enableOnChain);
                                            setEnableOnChain(newValue);

                                            if (newValue) {
                                                showToast("✅ On-Chain mode enabled. Next season will record on Monad.");
                                            } else {
                                                showToast("ℹ️ Off-Chain mode. Next season will be simulated only.");
                                            }
                                        }}
                                        disabled={isSeasonActive}
                                        className="hidden"
                                    />
                                    {enableOnChain ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                                    <span>{enableOnChain ? "On-Chain Recording: ON" : "Enable On-Chain Recording"}</span>
                                    {isSeasonActive && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">LOCKED</span>}
                                </label>

                                {enableOnChain && !isConnected && !isSeasonActive && (
                                    <span className="text-xs text-red-400 animate-pulse font-bold">Connect Wallet!</span>
                                )}
                            </div>

                            {/* Reset Button (only when stopped & has data) */}
                            {!isSeasonActive && simulationCount > 0 && (
                                <button
                                    onClick={resetSeason}
                                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
                                >
                                    <RefreshCw size={14} /> Reset Season Stats
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="max-w-7xl mx-auto px-4">

                        {/* Tabs */}
                        <div className="flex justify-center mb-8 border-b border-white/10">
                            <div className="flex gap-8">
                                {["rankings", "chart", "history", "stats"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "rankings" && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-4">
                                            {isLoading ? (
                                                <div className="text-center py-10 text-gray-500">Loading agents...</div>
                                            ) : (
                                                agents.map((agent, index) => (
                                                    <AgentCard
                                                        key={agent.id}
                                                        rank={index + 1}
                                                        name={agent.name}
                                                        strategy={agent.strategy}
                                                        yield={agent.simulatedYield}
                                                        rebalances={parseInt(agent.simulationCount)}
                                                        riskLevel={Number(agent.riskLevel)}
                                                        lastAction={agent.lastAction}
                                                        lastActionTime={agent.lastActionTime}
                                                        apyDelta={agent.apyDelta}
                                                        threshold={parseFloat(agent.rebalanceThreshold)}
                                                        agentAddress={getAgentAddress(agent.name)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <div className="lg:col-span-1">
                                            <LiveActivityFeed activities={activities} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "chart" && (
                                    <div>
                                        <YieldChart data={chartData} />
                                        {chartData.length === 0 && (
                                            <div className="text-center text-gray-500 mt-4 text-sm">
                                                Start the season to see yield progression data.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "history" && (
                                    <RebalanceHistory history={history} />
                                )}

                                {activeTab === "stats" && (
                                    <AgentStats stats={getAgentStats()} />
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </main>
            </div>
        </div>
    );
}
