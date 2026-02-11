"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { AgentCard } from "@/components/AgentCard";
import { LiveActivityFeed, ActivityItem } from "@/components/LiveActivityFeed";
import { SeasonControls } from "@/components/SeasonControls";
// New Components
import { YieldChart } from "@/components/YieldChart";
import { AgentStats } from "@/components/AgentStats";
import { RebalanceHistory, HistoryItem } from "@/components/RebalanceHistory";
import { SeasonSummary } from "@/components/SeasonSummary";
import { RefreshCw } from "lucide-react";

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

export default function LeaderboardPage() {
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Advanced State
    const [chartData, setChartData] = useState<any[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<"rankings" | "chart" | "history" | "stats">("rankings");
    const [showSummary, setShowSummary] = useState(false);

    // Season State
    const [isSeasonActive, setIsSeasonActive] = useState(false);
    const [seasonTimer, setSeasonTimer] = useState(0);
    const [simulationCount, setSimulationCount] = useState(0);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

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
        if (isSeasonActive) return;
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

            const { results } = await res.json();

            handleSimulationResults(results);
            setSimulationCount((prev) => prev + 1);
        } catch (error) {
            console.error("Simulation run error:", error);
            showToast("❌ Simulation failed. Check console.");
            stopSeason();
        }
    };

    const handleSimulationResults = (results: any[]) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

        // Snapshot for Chart
        const chartPoint: any = { time: timestamp };

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
                                <p className="text-yellow-100 font-bold text-sm">New Leader!</p>
                                <p className="text-yellow-200 text-xs">{toast.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-4">
                            <SeasonControls
                                isActive={isSeasonActive}
                                onStart={startSeason}
                                onStop={stopSeason}
                                timer={seasonTimer}
                                simulationCount={simulationCount}
                            />

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
