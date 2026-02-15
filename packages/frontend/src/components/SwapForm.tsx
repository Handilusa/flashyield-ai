"use client";

import { useState, useEffect } from "react";
import { useSwap } from "@/hooks/useSwap";
import { ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";

export function SwapForm() {
    const [direction, setDirection] = useState<"MON_TO_USDC" | "USDC_TO_MON">("MON_TO_USDC");
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"idle" | "approving" | "swapping">("idle");
    const explorerUrl = "https://monadexplorer.com";

    const {
        swapMONForUSDC,
        swapUSDCForMON,
        approveUSDC,
        needsApproval,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        resetWrite,
        refetchAllowance,
    } = useSwap();

    // Auto-proceed after approval
    useEffect(() => {
        if (isConfirmed && step === "approving") {
            resetWrite();
            refetchAllowance();
            setTimeout(() => {
                setStep("swapping");
                swapUSDCForMON(amount);
            }, 1000);
        } else if (isConfirmed && step === "swapping") {
            const timer = setTimeout(() => {
                setAmount("");
                setStep("idle");
                resetWrite();
            }, 10000); // Keep success message longer to let them click link
            return () => clearTimeout(timer);
        }
    }, [isConfirmed, step, amount, resetWrite, refetchAllowance, swapUSDCForMON]);

    const handleSwap = () => {
        if (!amount) return;

        if (direction === "MON_TO_USDC") {
            setStep("swapping");
            swapMONForUSDC(amount);
        } else {
            // USDC -> MON requires approval
            if (needsApproval(amount)) {
                setStep("approving");
                approveUSDC(amount);
            } else {
                setStep("swapping");
                swapUSDCForMON(amount);
            }
        }
    };

    const toggleDirection = () => {
        setDirection(d => d === "MON_TO_USDC" ? "USDC_TO_MON" : "MON_TO_USDC");
        setAmount("");
        setStep("idle");
        resetWrite();
    };

    return (
        <div className="glass-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                    💱 Simple Swap
                </h3>
                <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded border border-purple-500/20">
                    Monad Mainnet
                </span>
            </div>

            <div className="space-y-1">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 transition-colors focus-within:border-purple-500/30">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <label>From</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-xl font-mono text-white placeholder-gray-600 focus:outline-none w-full"
                        />
                        <span className="flex items-center gap-1 font-bold text-sm bg-white/10 px-2 py-1 rounded-lg text-white">
                            {direction === "MON_TO_USDC" ? "MON" : "USDC"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                    <button
                        onClick={toggleDirection}
                        className="bg-gray-800 border border-gray-700 p-1.5 rounded-full text-purple-400 hover:text-white hover:bg-purple-600 transition-all shadow-lg"
                    >
                        <ArrowDownUp size={14} />
                    </button>
                </div>

                <div className="bg-black/20 p-3 rounded-xl border border-white/5 opacity-80">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <label>To (Estimated)</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="0.0"
                            readOnly
                            value={amount} // 1:1 echo for demo
                            className="bg-transparent text-xl font-mono text-white/70 placeholder-gray-600 focus:outline-none w-full cursor-default"
                        />
                        <span className="flex items-center gap-1 font-bold text-sm bg-white/5 px-2 py-1 rounded-lg text-white/70">
                            {direction === "MON_TO_USDC" ? "USDC" : "MON"}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSwap}
                disabled={!amount || isPending || isConfirming}
                className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                    ${!amount || isPending || isConfirming
                        ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/25 hover:scale-[1.02]"
                    }`}
            >
                {isPending || isConfirming ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {step === "approving" ? "Approving USDC..." : "Swap Now"}
            </button>

            {hash && (
                <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-center animate-fade-in">
                    <p className="text-emerald-400 text-xs font-bold mb-1">
                        {isConfirmed ? "✅ Swap Successful!" : "⏳ Processing Swap..."}
                    </p>
                    <a
                        href={`${explorerUrl}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/70 hover:text-white hover:underline flex items-center justify-center gap-1"
                    >
                        View on Explorer ↗
                    </a>
                </div>
            )}
        </div>
    );
}
