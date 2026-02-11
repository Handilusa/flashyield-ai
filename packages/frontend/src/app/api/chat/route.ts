import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const SYSTEM_PROMPT = `You are FlashYield AI, a helpful DeFi assistant for the FlashYield protocol on Monad blockchain.

You can help users with:
- Depositing USDC to the yield vault
- Withdrawing USDC from the vault
- Swapping MON for USDC or vice versa
- Checking balances and APY
- Minting test USDC for demos

Be conversational, helpful, and concise. When users ask to perform transactions, use the appropriate tool.

IMPORTANT: If a transaction tool is cancelled by the user or fails, DO NOT retry it automatically. Acknowledge the cancellation/error and wait for further user instructions. Never loop or repeatedly call the same tool if it was just rejected.`;

export async function POST(req: Request) {
    console.log("Chat API route hit");
    console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);

    try {
        const { messages } = await req.json();
        console.log("Received messages count:", messages?.length);

        const result = await streamText({
            model: groq('llama-3.3-70b-versatile'),
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
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
