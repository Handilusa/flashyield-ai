import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, jsonSchema } from "ai";

// ── Groq provider (OpenAI-compatible) ──────────────────────────
const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY ?? "",
});

// ── System prompt ──────────────────────────────────────────────
const SYSTEM_PROMPT = `You are FlashYield AI Assistant — a friendly, expert DeFi helper built into the FlashYield AI platform on Monad blockchain.

You help users interact with the FlashYield protocol using natural language. You can:
- Deposit USDC into the YieldVault
- Withdraw USDC from the YieldVault
- Swap MON ↔ USDC on the SimpleDEX
- Check balances, APY, TVL, and DEX liquidity
- Mint mock USDC for testing

IMPORTANT RULES:
1. When the user wants to perform a transaction, call the appropriate tool. The client will handle execution.
2. Always confirm details before executing — the tool call itself triggers a confirmation card on the client.
3. For read-only queries (balances, APY, TVL), call the appropriate tool. The client reads from the blockchain.
4. Be conversational, concise, and helpful.
5. If the user's intent is unclear, ask a clarifying question instead of guessing.
6. Amounts should be positive numbers. If a user says "deposit everything" or similar, ask them to specify an exact amount.
7. For swaps, always clarify the direction if ambiguous.

CONTRACT INFO:
- MockUSDC: 0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67
- YieldVault: 0x8418185C4750957A6661eDe2d740272Ea22C140f
- SimpleDEX: 0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61
- YieldOptimizer: 0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3
- Chain: Monad Mainnet (Chain ID 143)
- USDC has 6 decimals, MON has 18 decimals`;

// ── JSON Schemas for tools ─────────────────────────────────────
const amountParam = jsonSchema({
    type: "object" as const,
    properties: {
        amount: { type: "string" as const, description: "Amount (e.g. '100')" },
    },
    required: ["amount"],
});

const emptyParam = jsonSchema({
    type: "object" as const,
    properties: {},
});

// ── POST handler ───────────────────────────────────────────────
export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        system: SYSTEM_PROMPT,
        messages,
        tools: {
            deposit_to_vault: tool({
                description: "Deposit USDC into the FlashYield YieldVault.",
                parameters: amountParam,
            }),
            withdraw_from_vault: tool({
                description: "Withdraw USDC from the FlashYield YieldVault.",
                parameters: amountParam,
            }),
            swap_mon_for_usdc: tool({
                description: "Swap MON (native token) for USDC on the SimpleDEX.",
                parameters: amountParam,
            }),
            swap_usdc_for_mon: tool({
                description: "Swap USDC for MON (native token) on the SimpleDEX.",
                parameters: amountParam,
            }),
            check_vault_balance: tool({
                description: "Check user's balance in the YieldVault.",
                parameters: emptyParam,
            }),
            check_usdc_balance: tool({
                description: "Check user's USDC wallet balance.",
                parameters: emptyParam,
            }),
            check_current_apy: tool({
                description: "Check current APY of the YieldVault.",
                parameters: emptyParam,
            }),
            check_tvl: tool({
                description: "Check Total Value Locked in the YieldVault.",
                parameters: emptyParam,
            }),
            check_dex_liquidity: tool({
                description: "Check liquidity reserves in the SimpleDEX.",
                parameters: emptyParam,
            }),
            mint_test_usdc: tool({
                description: "Mint 1,000 mock USDC for testing.",
                parameters: emptyParam,
            }),
        },
    });

    return result.toTextStreamResponse();
}
