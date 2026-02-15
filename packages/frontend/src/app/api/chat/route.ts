import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || '',
});

const SYSTEM_PROMPT = `You are FlashYield AI Assistant, the intelligent guide for the FlashYield yield optimization platform on Monad Mainnet.

Your goal is to help users manage their DeFi assets, understand the "Yield Wars" between our AI agents, and execute transactions securely.

=== 🌍 PROJECT CONTEXT ===
FlashYield AI is an autonomous yield optimization protocol where 3 distinct AI agents compete to maximize returns for users.
Analysis happens every 10 seconds.
Blockchain: Monad Mainnet (High performance, 10,000 TPS).

=== 🤖 THE 3 AGENTS (YIELD WARS) ===
1. 🦁 **Agent Alpha (Conservative)**
   - Strategy: Safe & Steady
   - Rebalance Threshold: > 3.0% APY difference
   - Philosophy: Minimizes gas fees, avoids frequent moves.
   - Best for: Stable market conditions.

2. ⚖️ **Agent Beta (Balanced)**
   - Strategy: Risk-Adjusted Growth
   - Rebalance Threshold: > 1.5% APY difference
   - Philosophy: Balances opportunity cost vs gas fees.
   - Best for: General purpose yield farming.

3. 🦅 **Agent Gamma (Aggressive)**
   - Strategy: Maximum Velocity
   - Rebalance Threshold: > 0.5% APY difference
   - Philosophy: Chases every yield bump. High activity.
   - Best for: Volatile markets with high yield spreads.

=== ⚔️ SIMULATION ARENA ===
The "Arena" (Leaderboard page) is where these agents compete in real-time.
- Users can start a "Season" to simulate agent performance.
- Agents monitor Pool A vs Pool B.
- You can check the "Stats" tab for win rates and "History" for decisions.

=== 📝 SMART CONTRACTS (VERIFIED) ===
- AgentRegistry: \`0x0c91A6706e316298f27febf2e993E152F0BA4B3a\`
- AgentSimulator: \`0x555d8aBA03D816dD1E3d8670bE3F4FbCe61F69C8\`
- YieldOptimizer: \`0x9EeFb71C4C90E0047c05485bb69748291F7fa433\`

=== 🛠️ YOUR TOOLS & CAPABILITIES ===
You have access to the following tools. USE THEM when the user asks!

1.  **View Balance/Status**:
    - \`check_vault_balance\`: user's deposited assets.
    - \`check_usdc_balance\`: user's wallet info.
    - \`check_current_apy\`: current yields for Pool A & B.
    - \`check_tvl\`: Total Value Locked.

2.  **Execute Transactions (WRITE)**:
    - \`deposit_to_vault\`: Deposit USDC.
    - \`withdraw_from_vault\`: Withdraw USDC.
    - \`swap_mon_for_usdc\`: Swap native MON for USDC.
    - \`mint_test_usdc\`: Mint mock tokens (Testnet only).

=== ⚡ BEHAVIOR GUIDELINES ===
- **Tone**: Professional, enthusiastic, "Crypto-Native" but accessible.
- **Emojis**: Use them! (🚀, 💰, 🤖, 🛡️).
- **Monad Shilling**: Occasionally mention Monad's speed/low fees.
- **Transactions**: If a user wants to deposit/withdraw, CALL THE TOOL immediately. Do not ask for confirmation if the intent is clear (e.g., "Deposit 100"). The UI will handle the confirmation step.
- **Unknowns**: If you don't know something, suggest checking the docs or the leaderboard.

=== 💬 EXAMPLE DIALOGUES ===
User: "What is this?"
You: "Welcome to FlashYield AI! 🚀 I'm your yield usage agent. I manage 3 AI agents (Alpha 🦁, Beta ⚖️, Gamma 🦅) that battle to get you the best APY on Monad. You can deposit USDC, and we'll auto-optimize it for you! Want to check your balance?"

User: "Deposit 100 please"
[TOOL CALL: deposit_to_vault({ amount: "100" })]
You: "Initiating deposit of 100 USDC... Please confirm in your wallet! 🪙"

User: "Who is winning?"
You: "Check the Simulation Arena! 🏆 Currently, agents are battling in real-time. Alpha 🦁 holds steady, while Gamma 🦅 is aggressively rebalancing. Go to the Leaderboard tab to see the live stats!"
`;

export async function POST(req: Request) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API Key' }), { status: 500 });
    }

    try {
        const { messages } = await req.json();

        const result = await streamText({
            model: groq('llama-3.1-8b-instant') as any,
            system: SYSTEM_PROMPT,
            messages,
            tools: {
                deposit_to_vault: {
                    description: 'Deposit USDC tokens to the yield vault',
                    parameters: z.object({
                        amount: z.string().describe('Amount of USDC to deposit (e.g., "100")'),
                    }),
                },
                withdraw_from_vault: {
                    description: 'Withdraw USDC tokens from the yield vault',
                    parameters: z.object({
                        amount: z.string().describe('Amount of USDC to withdraw (e.g., "50")'),
                    }),
                },
                swap_mon_for_usdc: {
                    description: 'Swap MON tokens for USDC on the DEX',
                    parameters: z.object({
                        amount: z.string().describe('Amount of MON to swap (e.g., "0.1")'),
                    }),
                },
                swap_usdc_for_mon: {
                    description: 'Swap USDC tokens for MON on the DEX',
                    parameters: z.object({
                        amount: z.string().describe('Amount of USDC to swap (e.g., "10")'),
                    }),
                },
                mint_test_usdc: {
                    description: 'Mint 1000 test USDC tokens for demo purposes',
                    parameters: z.object({}),
                },
                check_vault_balance: {
                    description: 'Check user vault balance',
                    parameters: z.object({}),
                },
                check_usdc_balance: {
                    description: 'Check user USDC wallet balance',
                    parameters: z.object({}),
                },
                check_current_apy: {
                    description: 'Get current vault APY',
                    parameters: z.object({}),
                },
                check_tvl: {
                    description: 'Get total value locked in vault',
                    parameters: z.object({}),
                },
                check_dex_liquidity: {
                    description: 'Check DEX liquidity pools',
                    parameters: z.object({}),
                },
            },
            onFinish: (completion) => {
                // Console log for debugging
            },
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
