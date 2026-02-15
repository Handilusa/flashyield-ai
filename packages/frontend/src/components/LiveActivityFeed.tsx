"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface ActivityItem {
    id: number;
    message: string;
    timestamp: string;
    type: "rebalance" | "evaluate" | "idle";
}

interface LiveActivityFeedProps {
    activities: ActivityItem[];
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
    return (
        <div className="glass-card h-full flex flex-col max-h-[600px] rounded-2xl overflow-hidden p-1">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-3 sticky top-0 bg-[#1A1A2E]/95 backdrop-blur-md z-10 px-4 py-3 border-b border-white/5 rounded-t-xl mx-0.5 mt-0.5">
                <span className="live-dot" /> Live Agent Activity
            </h3>
            <div className="flex-1 overflow-hidden relative px-2">
                <div className="absolute inset-0 overflow-y-auto px-2 custom-scrollbar">
                    {activities.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 text-sm">
                            Waiting for season to start...
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {activities.map((activity) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: "auto" }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="mb-3 pb-3 border-b border-white/5 last:border-0 px-2"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span
                                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${activity.type === "rebalance"
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : activity.type === "evaluate"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                                }`}
                                        >
                                            {activity.type.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            {activity.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-snug">
                                        {activity.type === "rebalance" && "🔔 "}
                                        {activity.message}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
