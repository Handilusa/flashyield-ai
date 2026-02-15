"use client";

import { useYieldVault } from "@/hooks/useYieldVault";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, Clock, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function PositionSummary() {
    const { isConnected, userVaultBalance, totalDeposits, currentAPY } = useYieldVault();
    const [timeInVault, setTimeInVault] = useState("0h 0m");
    const [depositTimestamp] = useState(() => Date.now());

    // Simulated time tracker
    useEffect(() => {
        if (!isConnected || parseFloat(userVaultBalance) <= 0) return;

        const update = () => {
            const elapsed = Date.now() - depositTimestamp;
            const hours = Math.floor(elapsed / 3_600_000);
            const minutes = Math.floor((elapsed % 3_600_000) / 60_000);
            setTimeInVault(`${hours}h ${minutes}m`);
        };

        update();
        const interval = setInterval(update, 60_000);
        return () => clearInterval(interval);
    }, [isConnected, userVaultBalance, depositTimestamp]);

    if (!isConnected || parseFloat(userVaultBalance) <= 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                    <PieChart size={20} className="text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">No Active Position</p>
                <p className="text-gray-500 text-xs">Deposit USDC to see your position summary</p>
            </div>
        );
    }

    const vaultBalance = parseFloat(userVaultBalance);
    const tvl = parseFloat(totalDeposits);
    const apy = parseFloat(currentAPY);
    const vaultShare = tvl > 0 ? (vaultBalance / tvl) * 100 : 0;
    const dailyEarnings = (vaultBalance * apy) / 100 / 365;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = vaultBalance * apy / 100;

    const stats = [
        {
            icon: <PieChart size={16} />,
            label: "Vault Share",
            value: `${vaultShare.toFixed(2)}%`,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
        },
        {
            icon: <TrendingUp size={16} />,
            label: "Est. Daily",
            value: `+${dailyEarnings.toFixed(4)}`,
            suffix: "USDC",
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
        },
        {
            icon: <Zap size={16} />,
            label: "Est. Monthly",
            value: `+${monthlyEarnings.toFixed(2)}`,
            suffix: "USDC",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
        },
        {
            icon: <Clock size={16} />,
            label: "Time in Vault",
            value: timeInVault,
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
        },
    ];

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}
                    >
                        <div className={`flex items-center gap-2 mb-1.5 ${stat.color}`}>
                            {stat.icon}
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                {stat.label}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-lg font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                            {stat.suffix && (
                                <span className="text-[10px] text-gray-500">{stat.suffix}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Yearly Projection */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield size={14} className="text-purple-400" />
                        <span className="text-xs text-gray-400">Annual Projection</span>
                    </div>
                    <span className="text-sm font-bold text-purple-300">
                        +{yearlyEarnings.toFixed(2)} USDC
                    </span>
                </div>
            </div>

            {/* Active Agents Indicator */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                <span>Balance: {vaultBalance.toFixed(2)} USDC</span>
                <span className="flex items-center gap-1.5 text-emerald-500/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    3 Agents Optimizing
                </span>
            </div>
        </div>
    );
}
