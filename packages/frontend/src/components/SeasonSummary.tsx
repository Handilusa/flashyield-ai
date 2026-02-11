"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Share2, RefreshCw } from "lucide-react";

interface SummaryAgent {
    id: string;
    name: string;
    finalYield: string;
    rank: number;
}

interface SeasonSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    onReset: () => void;
    winner: SummaryAgent | null;
    agents: SummaryAgent[];
}

export function SeasonSummary({
    isOpen,
    onClose,
    onReset,
    winner,
    agents,
}: SeasonSummaryProps) {
    useEffect(() => {
        if (isOpen && winner) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#F59E0B", "#A855F7", "#3B82F6"],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#F59E0B", "#A855F7", "#3B82F6"],
                });

                if (Date.now() < end) requestAnimationFrame(frame);
            };

            frame();
        }
    }, [isOpen, winner]);

    const handleShare = () => {
        const text = `🏆 Yield Wars Results:\n1. ${agents[0]?.name} (${agents[0]?.finalYield}%)\n2. ${agents[1]?.name} (${agents[1]?.finalYield}%)\n3. ${agents[2]?.name} (${agents[2]?.finalYield}%)\n\nSimulated on FlashYield AI via Monad`;
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#1A1A2E] border border-purple-500/30 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

                        <div className="p-6 text-center relative z-10">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <span className="text-6xl animate-bounce inline-block mb-2">🏆</span>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Season Complete!
                                </h2>
                                <p className="text-purple-300 font-medium">
                                    Winner: {winner?.name}
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {agents.map((agent, index) => (
                                    <div
                                        key={agent.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${index === 0
                                                ? "bg-yellow-500/10 border-yellow-500/30"
                                                : "bg-white/5 border-white/5"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold w-6">
                                                {index === 1 ? "🥇" : index === 2 ? "🥈" : "🥉"}
                                            </span>
                                            <span className={`font-medium ${index === 0 ? "text-yellow-400" : "text-gray-300"}`}>
                                                {agent.name}
                                            </span>
                                        </div>
                                        <span className="font-mono font-bold text-white">
                                            {agent.finalYield}%
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                                <button
                                    onClick={onReset}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/20"
                                >
                                    <RefreshCw size={18} />
                                    New Season
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
