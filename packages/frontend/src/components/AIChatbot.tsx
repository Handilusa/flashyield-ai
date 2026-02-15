"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useYieldVault } from "@/hooks/useYieldVault";
import { useSwap } from "@/hooks/useSwap";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Loader2,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Zap,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type PendingAction = {
    id: string;
    toolName: string;
    args: Record<string, string>;
    status: "pending" | "confirming" | "executing" | "success" | "error";
    txHash?: string;
    error?: string;
    result?: string;
};

/* ═══════════════════════════════════════════
   AI CHATBOT
   ═══════════════════════════════════════════ */

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { isConnected, address } = useAccount();

    // ── Blockchain hooks ───────────────────────────
    const vault = useYieldVault();
    const swap = useSwap();

    // ── AI Chat ────────────────────────────────────
    // ─── State Refs for onToolCall (avoid stale closures) ───
    const stateRef = useRef({ vault, swap, isConnected });
    useEffect(() => {
        stateRef.current = { vault, swap, isConnected };
    }, [vault, swap, isConnected]);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, addToolResult } =
        useChat({
            api: "/api/chat",
            onError: (error) => {
                console.error("[AIChatbot] Stream error:", error);
            },
            onFinish: () => {
                setTimeout(scrollToBottom, 100);
            },
            async onToolCall({ toolCall }) {
                console.log("[AIChatbot] Tool called:", toolCall.toolName);

                // Use ref to get latest state
                const { vault: v, isConnected: c } = stateRef.current;

                // ── WRITE ACTIONS ──
                if (isWriteAction(toolCall.toolName)) {
                    // We command the UI to show the card, but we MUST return a result to the AI
                    // to prevent it from hanging. We return a placeholder string.
                    // The actual transaction result will be sent later via `addToolResult` 
                    // when the user confirms the action in the UI.
                    return "Action queued for user confirmation. Please wait for the user to confirm the transaction in the UI.";
                }

                // ── READ ACTIONS ──
                let result = "No data available";
                try {
                    switch (toolCall.toolName) {
                        case "check_vault_balance":
                            result = c
                                ? `Your vault balance: **${parseFloat(v.userVaultBalance).toFixed(2)} USDC**`
                                : "Please connect your wallet first.";
                            break;
                        case "check_usdc_balance":
                            result = c
                                ? `Your USDC balance: **${parseFloat(v.usdcBalance).toFixed(2)} USDC**`
                                : "Please connect your wallet first.";
                            break;
                        case "check_current_apy":
                            result = `Current APY: **${v.currentAPY}%** (Pool A: ${v.poolApyA}% · Pool B: ${v.poolApyB}%)`;
                            break;
                        case "check_tvl":
                            result = `Total Value Locked: **${parseFloat(v.totalDeposits).toLocaleString()} USDC**`;
                            break;
                        case "check_dex_liquidity":
                            result = "DEX liquidity data is available on the dashboard.";
                            break;
                        default:
                            result = "Data unavailable for this tool.";
                            break;
                    }
                    console.log(`[AIChatbot] Read tool ${toolCall.toolName} result:`, result);
                    return result;
                } catch (err: any) {
                    console.error("[AIChatbot] Tool error:", err);
                    return "Error fetching data: " + (err.message || "Unknown error");
                }
            },
        });

    /* ─── Auto-scroll ─── */
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, pendingActions, scrollToBottom]);

    /* ─── Focus input when opening ─── */
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    /* ─── Track tx hash changes for pending actions ─── */
    useEffect(() => {
        if (vault.hash || swap.hash) {
            setPendingActions((prev) =>
                prev.map((a) => {
                    if (a.status === "executing") {
                        const hash = vault.hash || swap.hash;
                        return hash ? { ...a, status: "confirming" as const, txHash: hash } : a;
                    }
                    return a;
                })
            );
        }
    }, [vault.hash, swap.hash]);



    useEffect(() => {
        if (vault.isConfirmed || swap.isConfirmed) {
            setPendingActions((prev) => {
                const updated = prev.map((a) => {
                    if (a.status === "confirming") {
                        // NOTE: We do NOT call addToolResult here because onToolCall already returned 
                        // a "Queued" result. Adding another result would conflict and cause UI glitches.
                        // The UI card updating to "success" is sufficient feedback.
                        return { ...a, status: "success" as const };
                    }
                    return a;
                });
                return updated;
            });

            // Refetch data to update balances
            console.log("[AIChatbot] Transaction confirmed. Refetching data...");
            vault.refetchAll();

            // Refetch again after 2 seconds to ensure node has indexed the change
            setTimeout(() => {
                vault.refetchAll();
            }, 2000);
        }
    }, [vault.isConfirmed, swap.isConfirmed]);

    useEffect(() => {
        const err = vault.error || swap.error;
        if (err) {
            setPendingActions((prev) => {
                const updated = prev.map((a) => {
                    if (a.status === "executing" || a.status === "confirming") {
                        // We do NOT call addToolResult here to avoid conflicts.
                        // The UI card will show the error message.
                        return { ...a, status: "error" as const, error: (err as Error).message?.slice(0, 120) || "Transaction failed" };
                    }
                    return a;
                });
                return updated;
            });
        }
    }, [vault.error, swap.error]);

    /* ═══════════════════ EXECUTE ACTIONS ═══════════════════ */

    const executeAction = (action: PendingAction) => {
        if (!isConnected) return;

        setPendingActions((prev) =>
            prev.map((a) => (a.id === action.id ? { ...a, status: "executing" } : a))
        );

        vault.resetWrite();
        swap.resetWrite();

        try {
            switch (action.toolName) {
                case "deposit_to_vault": {
                    const amt = action.args.amount;
                    if (vault.needsApproval(amt)) {
                        vault.approveUSDC(amt);
                        setPendingActions((prev) =>
                            prev.map((a) =>
                                a.id === action.id
                                    ? { ...a, status: "executing", result: "Approving USDC…" }
                                    : a
                            )
                        );
                    } else {
                        vault.deposit(amt);
                    }
                    break;
                }
                case "withdraw_from_vault":
                    vault.withdraw(action.args.amount);
                    break;
                case "swap_mon_for_usdc":
                    swap.swapMONForUSDC(action.args.amount);
                    break;
                case "swap_usdc_for_mon": {
                    const amt = action.args.amount;
                    if (swap.needsApproval(amt)) {
                        swap.approveUSDC(amt);
                    } else {
                        swap.swapUSDCForMON(amt);
                    }
                    break;
                }
                case "mint_test_usdc":
                    vault.mintTestUSDC();
                    break;
                default:
                    break;
            }
        } catch (err: any) {
            setPendingActions((prev) =>
                prev.map((a) =>
                    a.id === action.id
                        ? { ...a, status: "error", error: err?.message || "Failed" }
                        : a
                )
            );
        }
    };

    /* ═══════════════════ RENDER HELPERS ═══════════════════ */

    const getActionLabel = (toolName: string, args: Record<string, string>) => {
        switch (toolName) {
            case "deposit_to_vault":
                return `Deposit ${args.amount} USDC to Vault`;
            case "withdraw_from_vault":
                return `Withdraw ${args.amount} USDC from Vault`;
            case "swap_mon_for_usdc":
                return `Swap ${args.amount} MON → USDC`;
            case "swap_usdc_for_mon":
                return `Swap ${args.amount} USDC → MON`;
            case "mint_test_usdc":
                return "Mint 1,000 Mock USDC";
            default:
                return toolName;
        }
    };

    const isWriteAction = (toolName: string) =>
        [
            "deposit_to_vault",
            "withdraw_from_vault",
            "swap_mon_for_usdc",
            "swap_usdc_for_mon",
            "mint_test_usdc",
        ].includes(toolName);

    const getReadResult = (toolName: string) => {
        switch (toolName) {
            case "check_vault_balance":
                return isConnected
                    ? `Your vault balance: **${parseFloat(vault.userVaultBalance).toFixed(2)} USDC**`
                    : "Please connect your wallet first.";
            case "check_usdc_balance":
                return isConnected
                    ? `Your USDC balance: **${parseFloat(vault.usdcBalance).toFixed(2)} USDC**`
                    : "Please connect your wallet first.";
            case "check_current_apy":
                return `Current APY: **${vault.currentAPY}%** (Pool A: ${vault.poolApyA}% · Pool B: ${vault.poolApyB}%)`;
            case "check_tvl":
                return `Total Value Locked: **${parseFloat(vault.totalDeposits).toLocaleString()} USDC**`;
            case "check_dex_liquidity":
                return "DEX liquidity data is available on the dashboard.";
            default:
                return null;
        }
    };

    /* ─── Quick commands ─── */
    const quickCommands = [
        "What's my vault balance?",
        "Show current APY",
        "Deposit 100 USDC",
        "Swap 0.1 MON for USDC",
    ];

    /* ═══════════════════ RENDER ═══════════════════ */

    return (
        <>
            {/* ── Floating Action Button ── */}
            <button
                className="chat-fab"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close chat" : "Open AI chat"}
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
                {!isOpen && <span className="chat-fab-badge">AI</span>}
            </button>

            {/* ── Chat Panel ── */}
            <div className={`chat-panel ${isOpen ? "chat-panel-open" : ""}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-left">
                        <div className="chat-header-icon">
                            <Zap size={18} />
                        </div>
                        <div>
                            <h3 className="chat-header-title">FlashYield AI</h3>
                            <span className="chat-header-status">
                                <span className="chat-status-dot" />
                                {isLoading ? "Thinking..." : "Online"}
                            </span>
                        </div>
                    </div>
                    <button
                        className="chat-close-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {/* Welcome message */}
                    {messages.length === 0 && (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon">🤖</div>
                            <h4>FlashYield AI Assistant</h4>
                            <p>
                                I can help you deposit, withdraw, swap tokens, and check your
                                DeFi stats. Try a command below!
                            </p>
                            <div className="chat-quick-cmds">
                                {quickCommands.map((cmd, i) => (
                                    <button
                                        key={i}
                                        className="chat-quick-cmd"
                                        onClick={() => {
                                            setInput(cmd);
                                            setTimeout(() => {
                                                const form = document.querySelector(".chat-input-form") as HTMLFormElement;
                                                form?.requestSubmit();
                                            }, 50);
                                        }}
                                    >
                                        {cmd}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg: any) => (
                        <div
                            key={msg.id}
                            className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-bot"}`}
                        >
                            <div className="chat-msg-avatar">
                                {msg.role === "user" ? (
                                    <User size={16} />
                                ) : (
                                    <Bot size={16} />
                                )}
                            </div>
                            <div className="chat-msg-content">
                                {/* Text content */}
                                {msg.content && (
                                    <div className="chat-msg-text">{msg.content}</div>
                                )}

                                {/* Tool invocations */}
                                {msg.toolInvocations?.map((invocation: any) => {
                                    const toolName = invocation.toolName;

                                    // Read-only tools — show result inline
                                    if (!isWriteAction(toolName)) {
                                        const result = getReadResult(toolName);
                                        return (
                                            <div
                                                key={invocation.toolCallId}
                                                className="chat-read-result"
                                            >
                                                {result || "Data retrieved."}
                                            </div>
                                        );
                                    }

                                    // Write tools — show confirmation card
                                    const existingAction = pendingActions.find(
                                        (a) => a.id === invocation.toolCallId
                                    );

                                    if (!existingAction) {
                                        const newAction: PendingAction = {
                                            id: invocation.toolCallId,
                                            toolName,
                                            args: invocation.args || {},
                                            status: "pending",
                                        };
                                        setTimeout(() => {
                                            setPendingActions((prev) => {
                                                if (prev.find((a) => a.id === newAction.id))
                                                    return prev;
                                                return [...prev, newAction];
                                            });
                                        }, 0);
                                    }

                                    const action =
                                        existingAction ||
                                        ({
                                            id: invocation.toolCallId,
                                            toolName,
                                            args: invocation.args || {},
                                            status: "pending",
                                        } as PendingAction);

                                    return (
                                        <div
                                            key={invocation.toolCallId}
                                            className="chat-tx-card"
                                        >
                                            <div className="chat-tx-card-header">
                                                <Zap size={14} />
                                                <span>Transaction Request</span>
                                            </div>
                                            <div className="chat-tx-card-body">
                                                <p className="chat-tx-label">
                                                    {getActionLabel(
                                                        action.toolName,
                                                        action.args
                                                    )}
                                                </p>

                                                {action.status === "pending" && (
                                                    <div className="chat-tx-actions">
                                                        {!isConnected ? (
                                                            <p className="chat-tx-warn">
                                                                ⚠️ Connect your wallet first
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="chat-tx-confirm"
                                                                    onClick={() =>
                                                                        executeAction(action)
                                                                    }
                                                                >
                                                                    <CheckCircle2 size={14} />
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    className="chat-tx-reject"
                                                                    onClick={() => {
                                                                        addToolResult({
                                                                            toolCallId: action.id,
                                                                            result: "Transaction cancelled by user"
                                                                        });
                                                                        setPendingActions((prev) =>
                                                                            prev.map((a) =>
                                                                                a.id === action.id
                                                                                    ? {
                                                                                        ...a,
                                                                                        status: "error" as const,
                                                                                        error: "Cancelled by user",
                                                                                    }
                                                                                    : a
                                                                            )
                                                                        );
                                                                    }}
                                                                >
                                                                    <XCircle size={14} />
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {action.status === "executing" && (
                                                    <div className="chat-tx-status executing">
                                                        <Loader2
                                                            size={14}
                                                            className="chat-spin"
                                                        />
                                                        <span>
                                                            {action.result || "Check your wallet…"}
                                                        </span>
                                                    </div>
                                                )}

                                                {action.status === "confirming" && (
                                                    <div className="chat-tx-status confirming">
                                                        <Loader2
                                                            size={14}
                                                            className="chat-spin"
                                                        />
                                                        <span>Confirming on-chain…</span>
                                                    </div>
                                                )}

                                                {action.status === "success" && (
                                                    <div className="chat-tx-status success">
                                                        <CheckCircle2 size={14} />
                                                        <span>Transaction confirmed!</span>
                                                        {action.txHash && (
                                                            <a
                                                                href={`https://monadvision.com/tx/${action.txHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="chat-tx-link"
                                                            >
                                                                View
                                                                <ExternalLink size={12} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                {action.status === "error" && (
                                                    <div className="chat-tx-status error">
                                                        <XCircle size={14} />
                                                        <span>
                                                            {action.error || "Failed"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="chat-msg chat-msg-bot">
                            <div className="chat-msg-avatar">
                                <Bot size={16} />
                            </div>
                            <div className="chat-msg-content">
                                <div className="chat-typing">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                    className="chat-input-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={inputRef}
                        className="chat-input"
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Try "Deposit 50 USDC" or "Show APY"'
                        disabled={isLoading}
                    />
                    <button
                        className="chat-send-btn"
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        aria-label="Send"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="chat-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
