"use client";

import { useState, useEffect } from "react";
import { useYieldVault } from "@/hooks/useYieldVault";

/**
 * DepositForm — Deposit USDC into the FlashYield Vault
 *
 * Flow:
 *   1. User enters USDC amount
 *   2. If allowance is insufficient → Approve step
 *   3. Once approved → Deposit step
 *   4. Mint test USDC button for getting testnet tokens
 */
export function DepositForm() {
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"idle" | "approving" | "depositing">("idle");
    const {
        isConnected,
        usdcBalance,
        userVaultBalance,
        currentAPY,
        needsApproval,
        approveUSDC,
        deposit,
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

    // After successful tx, decide what happens next
    useEffect(() => {
        if (isConfirmed) {
            if (step === "approving") {
                // Approval done — now auto-deposit
                resetWrite();
                refetchAll();
                setTimeout(() => {
                    setStep("depositing");
                    deposit(amount);
                }, 1000);
            } else if (step === "depositing") {
                // Deposit done — clean up
                refetchAll();
                const timer = setTimeout(() => {
                    setAmount("");
                    setStep("idle");
                    resetWrite();
                }, 4000);
                return () => clearTimeout(timer);
            } else {
                // Mint or other action
                refetchAll();
                const timer = setTimeout(() => {
                    resetWrite();
                }, 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [isConfirmed]);

    const handleDeposit = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        if (needsApproval(amount)) {
            setStep("approving");
            approveUSDC(amount);
        } else {
            setStep("depositing");
            deposit(amount);
        }
    };

    const handleMint = () => {
        setStep("idle");
        resetWrite();
        mintTestUSDC();
    };

    // Determine button state and text
    const getButtonState = () => {
        if (!isConnected) return { text: "Connect Wallet First", disabled: true };
        if (isPending && step === "approving") return { text: "Approve in Wallet...", disabled: true };
        if (isPending && step === "depositing") return { text: "Confirm Deposit...", disabled: true };
        if (isPending) return { text: "Confirm in Wallet...", disabled: true };
        if (isConfirming && step === "approving") return { text: "Approving USDC...", disabled: true };
        if (isConfirming && step === "depositing") return { text: "Depositing...", disabled: true };
        if (isConfirming) return { text: "Confirming...", disabled: true };
        if (!amount || parseFloat(amount) <= 0)
            return { text: "Enter Amount", disabled: true };
        if (parseFloat(amount) > parseFloat(usdcBalance))
            return { text: "Insufficient USDC", disabled: true };
        if (needsApproval(amount))
            return { text: `Approve & Deposit ${amount} USDC`, disabled: false };
        return { text: `Deposit ${amount} USDC`, disabled: false };
    };

    const btnState = getButtonState();

    return (
        <div className="deposit-form">
            {/* APY Badge */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.75rem",
            }}>
                <span className="agents-badge" style={{ fontSize: "0.8rem" }}>
                    📊 Current APY: <strong>{currentAPY}%</strong>
                </span>
            </div>

            {/* Balances */}
            {isConnected && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                }}>
                    <div className="deposit-balance" style={{ flex: 1 }}>
                        <span className="deposit-balance-label">Wallet USDC</span>
                        <span className="deposit-balance-value">{parseFloat(usdcBalance).toFixed(2)}</span>
                    </div>
                    <div className="deposit-balance" style={{ flex: 1 }}>
                        <span className="deposit-balance-label">Deposited</span>
                        <span className="deposit-balance-value">{parseFloat(userVaultBalance).toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* Amount Input */}
            <div className="deposit-input-wrap">
                <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="deposit-input"
                    min="0"
                    step="1"
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
                            className="deposit-quick-btn"
                            type="button"
                        >
                            {val}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setAmount(
                                Math.floor(parseFloat(usdcBalance)).toString()
                            );
                        }}
                        className="deposit-quick-btn"
                        type="button"
                    >
                        MAX
                    </button>
                </div>
            )}

            {/* Step Indicator */}
            {(isPending || isConfirming) && step !== "idle" && (
                <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                    fontSize: "0.75rem",
                }}>
                    <span style={{
                        color: step === "approving" ? "#7B3FE4" : "#10b981",
                        fontWeight: step === "approving" ? 700 : 400,
                    }}>
                        ① Approve
                    </span>
                    <span style={{ color: "#6b7280" }}>→</span>
                    <span style={{
                        color: step === "depositing" ? "#7B3FE4" : "#6b7280",
                        fontWeight: step === "depositing" ? 700 : 400,
                    }}>
                        ② Deposit
                    </span>
                </div>
            )}

            {/* Deposit Button */}
            <button
                onClick={handleDeposit}
                disabled={btnState.disabled}
                className="deposit-btn"
                type="button"
            >
                {(isPending || isConfirming) && (
                    <span className="deposit-spinner" />
                )}
                {btnState.text}
            </button>

            {/* Mint Test USDC Button */}
            {isConnected && (
                <button
                    onClick={handleMint}
                    disabled={isPending || isConfirming}
                    className="deposit-btn"
                    type="button"
                    style={{
                        marginTop: "0.5rem",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        border: "none",
                    }}
                >
                    🪙 Mint 1,000 Mock USDC
                </button>
            )}

            {/* Transaction Status */}
            {hash && (
                <div className="deposit-tx">
                    <span className="deposit-tx-label">
                        {isConfirmed
                            ? step === "approving"
                                ? "✅ Approved — depositing..."
                                : "✅ Confirmed"
                            : "⏳ Pending"}
                    </span>
                    <a
                        href={`${explorerUrl}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="deposit-tx-link"
                    >
                        View on Explorer ↗
                    </a>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="deposit-error">
                    <span>
                        ❌{" "}
                        {(error as Error).message?.slice(0, 100) ||
                            "Transaction failed"}
                    </span>
                    <button
                        onClick={() => {
                            resetWrite();
                            setStep("idle");
                        }}
                        className="deposit-error-retry"
                        type="button"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
