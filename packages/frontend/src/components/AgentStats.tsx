"use client";

import { motion } from "framer-motion";

interface AgentMetrics {
    id: string;
    name: string;
    totalRebalances: number;
    successRate: number; // e.g. 0.85 for 85%
    avgDelta: number; // in bps
    bestMove: number; // in bps
    currentPool: string;
    timeInPool: string;
}

interface AgentStatsProps {
    stats: AgentMetrics[];
}

export function AgentStats({ stats }: AgentStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((agent, index) => (
                <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-5 relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                        <h3 className="font-bold text-lg">{agent.name}</h3>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                            {agent.currentPool}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Total Rebalances</p>
                            <p className="text-xl font-bold text-white">{agent.totalRebalances}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Success Rate</p>
                            <p className="text-xl font-bold text-green-400">
                                {(agent.successRate * 100).toFixed(0)}%
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Avg Delta Capture</p>
                            <p className="text-base font-semibold text-blue-300">
                                {agent.avgDelta.toFixed(0)} bps
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Best Move</p>
                            <p className="text-base font-semibold text-purple-300">
                                +{agent.bestMove.toFixed(0)} bps
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Time in Current Pool</span>
                            <span className="font-mono text-gray-400">{agent.timeInPool}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
