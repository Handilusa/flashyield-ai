"use client";

import { useState, useEffect } from "react";
import { useYieldVault } from "@/hooks/useYieldVault";
import { motion } from "framer-motion"; // Assuming framer-motion is available based on other files

/**
 * DepositForm — Manage Vault (Deposit & Withdraw)
 *
 * Flow:
 *   Deposit: Approve (if needed) -> Deposit
 *   Withdraw: Withdraw (no approval needed for shares usually)
 */
export function DepositForm() {
    const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"idle" | "approving" | "depositing" | "withdrawing">("idle");

    const {
        isConnected,
        usdcBalance,
        userVaultBalance,
        totalDeposits,
        currentAPY,
        needsApproval,
        approveUSDC,
        deposit,
        withdraw,
        mintTestUSDC,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error,
        resetWrite,
        refetchAll,
        explorerUrl,
    } = useYieldVault();

    // Reset input when mode changes
    useEffect(() => {
        setAmount("");
        setStep("idle");
        resetWrite();
    }, [mode, resetWrite]);

    // Transaction lifecycle management
    useEffect(() => {
        if (isConfirmed) {
            if (step === "approving") {
                // Approval done — proceed to deposit
                resetWrite();
                refetchAll();
                setTimeout(() => {
                    setStep("depositing");
                    deposit(amount);
                }, 1000);
            } else if (step === "depositing" || step === "withdrawing") {
                // Transaction done — clean up
                refetchAll();
                const timer = setTimeout(() => {
                    setAmount("");
                    setStep("idle");
                    resetWrite();
                }, 4000);
                return () => clearTimeout(timer);
            } else {
                // Mint or other
                refetchAll();
                const timer = setTimeout(() => {
                    resetWrite();
                }, 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [isConfirmed]);

    const handleTransaction = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        if (mode === "deposit") {
            if (needsApproval(amount)) {
                setStep("approving");
                approveUSDC(amount);
            } else {
                setStep("depositing");
                deposit(amount);
            }
        } else {
            // Withdraw
            setStep("withdrawing");
            withdraw(amount);
        }
    };

    const handleMint = () => {
        setStep("idle");
        resetWrite();
        mintTestUSDC();
    };

    const getMaxAmount = () => {
        return mode === "deposit" ? usdcBalance : userVaultBalance;
    };

    // Determine button state
    const getButtonState = () => {
        if (!isConnected) return { text: "Connect Wallet First", disabled: true };

        // Pending States
        if (isPending) return { text: "Confirm in Wallet...", disabled: true };
        if (isConfirming) {
            if (step === "approving") return { text: "Approving USDC...", disabled: true };
            if (step === "depositing") return { text: "Depositing...", disabled: true };
            if (step === "withdrawing") return { text: "Withdrawing...", disabled: true };
            return { text: "Confirming...", disabled: true };
        }

        // Input Validation
        if (!amount || parseFloat(amount) <= 0) return { text: "Enter Amount", disabled: true };

        const max = parseFloat(getMaxAmount());
        if (parseFloat(amount) > max) return { text: `Insufficient ${mode === "deposit" ? "USDC" : "Balance"}`, disabled: true };

        // Ready State
        if (mode === "deposit") {
            return needsApproval(amount)
                ? { text: `Approve & Deposit ${amount} USDC`, disabled: false }
                : { text: `Deposit ${amount} USDC`, disabled: false };
        } else {
            return { text: `Withdraw ${amount} USDC`, disabled: false };
        }
    };

    const btnState = getButtonState();

    return (
        <div className="deposit-form relative overflow-hidden">
            {/* Mode Tabs */}
            <div className="flex bg-black/20 p-1 rounded-xl mb-6 relative z-10">
                <button
                    onClick={() => setMode("deposit")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "deposit"
                        ? "bg-purple-600/80 text-white shadow-lg shadow-purple-900/40"
                        : "text-gray-400 hover:text-white/80"
                        }`}
                >
                    Deposit
                </button>
                <button
                    onClick={() => setMode("withdraw")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "withdraw"
                        ? "bg-purple-600/80 text-white shadow-lg shadow-purple-900/40"
                        : "text-gray-400 hover:text-white/80"
                        }`}
                >
                    Withdraw
                </button>
            </div>

            {/* APY Badge */}
            <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/20 text-xs text-purple-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Current APY: <strong className="text-emerald-400">{currentAPY}%</strong>
                </span>
            </div>

            {/* Balances */}
            {isConnected && (
                <div className="flex justify-between gap-4 mb-3 text-sm">
                    <div className={`flex flex-col p-2 rounded-lg transition-colors ${mode === "deposit" ? "bg-white/5 border border-white/10" : ""}`}>
                        <span className="text-gray-400 text-xs">Wallet USDC</span>
                        <span className="font-mono text-white">{parseFloat(usdcBalance).toFixed(2)}</span>
                    </div>
                    <div className={`flex flex-col p-2 rounded-lg transition-colors ${mode === "withdraw" ? "bg-white/5 border border-white/10" : ""}`}>
                        <span className="text-gray-400 text-xs">Vault Balance</span>
                        <span className="font-mono text-white">{parseFloat(userVaultBalance).toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* Amount Input */}
            <div className={`deposit-input-wrap transition-all duration-300 ${mode === "withdraw" ? "border-purple-500/50" : ""}`}>
                <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="deposit-input"
                    min="0"
                    step="0.01"
                    disabled={!isConnected || isPending || isConfirming}
                />
                <span className="deposit-currency">USDC</span>
            </div>

            {/* Quick-fill Buttons */}
            {isConnected && (
                <div className="deposit-quick-fills">
                    {["10", "50", "100", "500"].map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className="deposit-quick-btn hover:bg-white/10"
                            type="button"
                        >
                            {val}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setAmount(Math.floor(parseFloat(getMaxAmount()) * 100) / 100 + "");
                        }}
                        className="deposit-quick-btn text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                        type="button"
                    >
                        MAX
                    </button>
                </div>
            )}

            {/* Step Indicator (Deposit Only) */}
            {(isPending || isConfirming) && step !== "idle" && mode === "deposit" && (
                <div className="flex justify-center gap-2 mb-2 text-xs">
                    <span className={step === "approving" ? "text-purple-400 font-bold" : "text-emerald-500"}>
                        ① Approve
                    </span>
                    <span className="text-gray-600">→</span>
                    <span className={step === "depositing" ? "text-purple-400 font-bold" : "text-gray-500"}>
                        ② Deposit
                    </span>
                </div>
            )}

            {/* Main Action Button */}
            <button
                onClick={handleTransaction}
                disabled={btnState.disabled}
                className="deposit-btn relative overflow-hidden group"
                type="button"
            >
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-opacity duration-300 ${btnState.disabled ? "opacity-50" : "opacity-100 group-hover:opacity-90"}`} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {(isPending || isConfirming) && (
                        <span className="deposit-spinner" />
                    )}
                    {btnState.text}
                </span>
            </button>

            {/* Mint Test USDC (Only show in Deposit mode or always?) -> Always good to have */}
            {isConnected && (
                <button
                    onClick={handleMint}
                    disabled={isPending || isConfirming}
                    className="w-full mt-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors"
                    type="button"
                >
                    🪙 Mint 1,000 Mock USDC
                </button>
            )}

            {/* Quick Actions */}
            {isConnected && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/15">
                    <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        ⚡ Quick Actions
                    </h4>
                    <div className="flex flex-col gap-2">
                        <a
                            href="/leaderboard"
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600/60 to-indigo-600/60 border border-purple-500/20 hover:from-purple-600/80 hover:to-indigo-600/80 transition-all flex items-center justify-center gap-2 no-underline"
                        >
                            🏆 Enter Yield Wars Arena
                        </a>
                        <a
                            href={`${explorerUrl}/address/${require("@/config/contracts").CONTRACTS.VAULT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 no-underline"
                        >
                            🔍 View Vault on Explorer
                        </a>
                    </div>
                </div>
            )}

            {/* Transaction Status */}
            {hash && (
                <div className="deposit-tx mt-4">
                    <span className="deposit-tx-label">
                        {isConfirmed
                            ? "✅ Transaction Confirmed"
                            : "⏳ Transaction Pending..."}
                    </span>
                    <a
                        href={`${explorerUrl}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="deposit-tx-link block mt-1 text-xs text-purple-400 hover:underline"
                    >
                        View on Explorer ↗
                    </a>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="deposit-error mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
                    <p className="text-red-400 text-xs mb-2">
                        {(error as Error).message?.slice(0, 80) || "Transaction failed"}...
                    </p>
                    <button
                        onClick={() => {
                            resetWrite();
                            setStep("idle");
                        }}
                        className="text-xs text-white bg-red-600/50 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        type="button"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
