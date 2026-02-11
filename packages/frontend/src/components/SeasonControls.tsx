"use client";

import { motion } from "framer-motion";
import { Play, Square, Timer } from "lucide-react";

interface SeasonControlsProps {
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
    timer: number;
    simulationCount: number;
}

export function SeasonControls({
    isActive,
    onStart,
    onStop,
    timer,
    simulationCount,
}: SeasonControlsProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-8 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
            <div className="flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive
                            ? "bg-green-500/20 text-green-400 animate-pulse"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                >
                    <Timer size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Season Control</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{isActive ? "🟢 Season Active" : "⚪ Season Idle"}</span>
                        <span>•</span>
                        <span>Duration: {formatTime(timer)}</span>
                        <span>•</span>
                        <span>Simulations: {simulationCount}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                {!isActive ? (
                    <button
                        onClick={onStart}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Play size={20} fill="currentColor" />
                        Start Season
                    </button>
                ) : (
                    <button
                        onClick={onStop}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Square size={20} fill="currentColor" />
                        Stop Season
                    </button>
                )}
            </div>
        </motion.div>
    );
}
