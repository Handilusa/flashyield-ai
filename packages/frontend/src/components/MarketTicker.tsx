"use client";

import { motion } from "framer-motion";
import { Info, ExternalLink } from "lucide-react";

interface MarketTickerProps {
    marketData: { [key: string]: number } | null;
}

export function MarketTicker({ marketData }: MarketTickerProps) {
    if (!marketData) return null;

    const pools = [
        {
            id: "Pool A",
            label: "Conservative",
            protocol: "Curvance",
            apy: marketData["Pool A"],
            color: "bg-blue-500"
        },
        {
            id: "Pool B",
            label: "Aggressive LP",
            protocol: "Fastlane",
            apy: marketData["Pool B"],
            color: "bg-purple-500"
        }
    ];

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Monad Ecosystem Data</span>
                    <div className="group relative">
                        <Info size={12} className="text-gray-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black/90 text-gray-300 text-xs p-3 rounded-lg border border-white/10 shadow-xl hidden group-hover:block z-50">
                            Real-time simulation using data ranges from Curvance (Lending) and Fastlane (DEX) on Monad Mainnet.
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pools.map(pool => (
                        <motion.div
                            key={pool.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-8 rounded-full ${pool.color}`} />
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-bold text-white">{pool.id}</span>
                                        <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded border border-white/5">
                                            {pool.protocol}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{pool.label}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xl font-bold font-mono text-green-400">
                                    {pool.apy?.toFixed(2)}%
                                </div>
                                <div className="text-[10px] text-gray-500">Current APY</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
