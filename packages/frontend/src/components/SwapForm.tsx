"use client";

import { useState, useEffect } from "react";
import { useSwap } from "@/hooks/useSwap";
import { ArrowDownUp } from "lucide-react";

export function SwapForm() {
    const [direction, setDirection] = useState<"MON_TO_USDC" | "USDC_TO_MON">("MON_TO_USDC");
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"idle" | "approving" | "swapping">("idle");

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
            }, 4000);
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
        <div className="swap-form glass-card">
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                💱 Simple Swap
            </h3>

            <div className="swap-input-container">
                <label className="swap-label">From</label>
                <div className="swap-input-row">
                    <input
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="deposit-input"
                    />
                    <span className="swap-currency">
                        {direction === "MON_TO_USDC" ? "MON" : "USDC"}
                    </span>
                </div>
            </div>

            <div className="swap-divider">
                <button onClick={toggleDirection} className="swap-toggle-btn">
                    <ArrowDownUp size={16} />
                </button>
            </div>

            <div className="swap-input-container">
                <label className="swap-label">To (Estimated)</label>
                <div className="swap-input-row">
                    <input
                        type="text"
                        placeholder="0.0"
                        readOnly
                        value={amount} // For now just 1:1 echo, since we assume stable-ish for demo
                        className="deposit-input"
                        style={{ opacity: 0.7 }}
                    />
                    <span className="swap-currency">
                        {direction === "MON_TO_USDC" ? "USDC" : "MON"}
                    </span>
                </div>
            </div>

            <button
                onClick={handleSwap}
                disabled={!amount || isPending || isConfirming}
                className="deposit-btn"
                style={{ marginTop: "1rem" }}
            >
                {isPending || isConfirming ? (
                    <span className="deposit-spinner" />
                ) : null}
                {step === "approving" ? "Approving USDC..." : "Swap"}
            </button>

            {hash && isConfirmed && (
                <p className="tx-success">✅ Swap Confirmed!</p>
            )}
        </div>
    );
}
