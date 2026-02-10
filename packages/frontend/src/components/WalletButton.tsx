"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from "wagmi";

/** Monad Mainnet chain ID in hex (143) */
const MONAD_CHAIN_ID_HEX = "0x8F"; // 143

/**
 * WalletButton — Custom RainbowKit connect button with robust chain switching
 */
export function WalletButton() {
    const { switchChain, isPending } = useSwitchChain();
    const [switchError, setSwitchError] = useState<string | null>(null);

    const handleSwitch = () => {
        setSwitchError(null);
        switchChain(
            { chainId: 143 },
            {
                onError: (error: any) => {
                    console.error("Switch failed:", error);
                    // If OKX fails with "URL already used" or similar blocks, prompt manual switch
                    setSwitchError("Please switch to Monad Mainnet manually in your wallet.");
                },
            }
        );
    };

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none" as const,
                                userSelect: "none" as const,
                            },
                        })}
                    >
                        {(() => {
                            // 1. Not connected
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        className="btn-wallet"
                                        type="button"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            // 2. Check if we're on the wrong chain
                            // Note: We ignore `chain.unsupported` if the ID is 143 (Monad Mainnet)
                            // This handles custom RPCs in OKX Wallet that might not match our exact config
                            const isMonad = chain.id === 143;
                            const isWrongChain = !isMonad && chain.id !== 143; // Redundant but clear: we only want 143

                            if (isWrongChain) {
                                return (
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={handleSwitch}
                                            type="button"
                                            className="btn-wallet"
                                            disabled={isPending}
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #ef4444, #dc2626)",
                                                padding: "0.5rem 1rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                lineHeight: "1.2",
                                            }}
                                        >
                                            <span
                                                style={{ fontSize: "0.7rem", opacity: 0.8 }}
                                            >
                                                Current: {chain.name || `ID: ${chain.id}`}
                                            </span>
                                            <span style={{ fontWeight: 700 }}>
                                                {isPending
                                                    ? "Check Wallet..."
                                                    : "Switch to Monad"}
                                            </span>
                                        </button>
                                        {switchError && (
                                            <span className="text-xs text-red-500 bg-black/50 px-2 py-1 rounded">
                                                {switchError}
                                            </span>
                                        )}
                                    </div>
                                );
                            }

                            // 3. Connected to Monad Mainnet (or recognized as such)
                            return (
                                <button
                                    onClick={openAccountModal}
                                    type="button"
                                    className="btn-wallet-connected"
                                >
                                    <span className="wallet-status-dot" />
                                    <span className="wallet-balance">
                                        {account.balanceFormatted
                                            ? `${parseFloat(account.balanceFormatted).toFixed(2)} ${account.balanceSymbol}`
                                            : ""}
                                    </span>
                                    <span className="wallet-address">
                                        {account.displayName}
                                    </span>
                                </button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
