"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

export interface HistoryItem {
    id: string;
    time: string;
    agentName: string;
    fromPool: string;
    toPool: string;
    delta: number;
    yieldImpact: number;
}

interface RebalanceHistoryProps {
    history: HistoryItem[];
}

export function RebalanceHistory({ history }: RebalanceHistoryProps) {
    const exportCSV = () => {
        const headers = "Time,Agent,From,To,Delta (bps),Yield Impact (%)\n";
        const rows = history
            .map(
                (h) =>
                    `${h.time},${h.agentName},${h.fromPool},${h.toPool},${h.delta},${h.yieldImpact}`
            )
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "yield_wars_history.csv";
        a.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full flex flex-col h-[500px]"
        >
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg">Rebalance Log</h3>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                    <Download size={14} />
                    Export CSV
                </button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            <th className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                            <th className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Agent</th>
                            <th className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                            <th className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Delta</th>
                            <th className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Yield</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                                    No rebalance events yet. Start the season!
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-sm text-gray-400 font-mono">{item.time}</td>
                                    <td className="p-3 text-sm font-medium text-white">{item.agentName}</td>
                                    <td className="p-3 text-xs">
                                        <span className="text-gray-400">{item.fromPool}</span>
                                        <span className="mx-2 text-gray-600">→</span>
                                        <span className="text-green-400 font-bold">{item.toPool}</span>
                                    </td>
                                    <td className="p-3 text-sm text-right font-mono text-blue-300">
                                        +{item.delta.toFixed(0)} bps
                                    </td>
                                    <td className="p-3 text-sm text-right font-mono text-green-400">
                                        +{item.yieldImpact.toFixed(4)}%
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
