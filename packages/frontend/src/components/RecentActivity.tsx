"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Zap } from "lucide-react";

interface ActivityItem {
    id: string;
    message: string;
    timestamp: string;
    agentName: string;
    type: "rebalance" | "optimization";
}

export function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        // Initial mock data to start with
        const initialActivities: ActivityItem[] = [
            { id: "1", message: "Alpha rebalanced to Pool B (+12bps)", timestamp: "Just now", agentName: "Alpha", type: "rebalance" },
            { id: "2", message: "Beta optimized position", timestamp: "2m ago", agentName: "Beta", type: "optimization" },
            { id: "3", message: "Gamma switched strategy", timestamp: "5m ago", agentName: "Gamma", type: "rebalance" },
        ];
        setActivities(initialActivities);

        // Simulate live feed
        const interval = setInterval(() => {
            const agents = ["Alpha", "Beta", "Gamma"];
            const actions = ["rebalanced to Pool A", "rebalanced to Pool B", "harvested yield", "optimized gas"];
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const isRebalance = randomAction.includes("rebalanced");

            const newActivity: ActivityItem = {
                id: Date.now().toString(),
                message: `${randomAgent} ${randomAction} ${isRebalance ? `(+${Math.floor(Math.random() * 50)}bps)` : ""}`,
                timestamp: "Just now",
                agentName: randomAgent,
                type: isRebalance ? "rebalance" : "optimization"
            };

            setActivities(prev => [newActivity, ...prev].slice(0, 5));
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
                {activities.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, x: -20 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className={`p-2 rounded-full ${item.agentName === "Alpha" ? "bg-yellow-500/20 text-yellow-400" :
                                item.agentName === "Beta" ? "bg-blue-500/20 text-blue-400" :
                                    "bg-purple-500/20 text-purple-400"
                            }`}>
                            {item.type === "rebalance" ? <Zap size={14} /> : <Activity size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 font-medium truncate">
                                {item.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className={
                                    item.agentName === "Alpha" ? "text-yellow-500/70" :
                                        item.agentName === "Beta" ? "text-blue-500/70" :
                                            "text-purple-500/70"
                                }>
                                    {item.agentName} Agent
                                </span>
                                <span>•</span>
                                <span>{item.timestamp}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
