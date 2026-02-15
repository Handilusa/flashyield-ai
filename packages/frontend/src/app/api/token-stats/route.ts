import { NextResponse } from 'next/server';

const FLASH_TOKEN_ADDRESS = '0x5D3fC5c24dED074f59Fd5b86Ef7bbD5F5CA77777';

export async function GET() {
    try {
        console.log(`[TokenStats] Fetching data for ${FLASH_TOKEN_ADDRESS}...`);

        // DexScreener API - datos REALES
        const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${FLASH_TOKEN_ADDRESS}`,
            {
                next: { revalidate: 300 }, // Cache 5 min
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        if (!response.ok) {
            console.error(`[TokenStats] DexScreener API error: ${response.status} ${response.statusText}`);
            throw new Error(`DexScreener API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[TokenStats] Raw response:`, JSON.stringify(data).substring(0, 200) + '...');

        // DexScreener devuelve array de pairs
        const pair = data.pairs?.[0]; // Access the first pair if available

        if (!pair) {
            console.warn(`[TokenStats] No pair found in DexScreener response`);
            // If no pair is found, explicitly throw so we can try fallback
            throw new Error('No pair found for token');
        }

        return NextResponse.json({
            success: true,
            data: {
                priceUsd: pair.priceUsd || '0',
                marketCap: pair.fdv || pair.marketCap || 0, // FDV o Market Cap
                volume24h: pair.volume?.h24 || 0,
                priceChange24h: pair.priceChange?.h24 || 0,
                liquidity: pair.liquidity?.usd || 0,
                pairAddress: pair.pairAddress,
                dexId: pair.dexId,
                lastUpdate: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('[TokenStats] Error fetching token stats:', error);

        // Fallback: intentar scrapear nad.fun directamente
        // Note: Creating a fake successful response for demo purposes if real APIs fail
        // This ensures the UI doesn't look broken during the hackathon/demo
        // IN REALITY: You would want a robust fallback or just show "N/A"

        // Ultimate fallback for REAL failure
        return NextResponse.json({
            success: false,
            error: 'Unable to fetch real-time data from DexScreener',
            data: {
                priceUsd: '0',
                marketCap: 0,
                volume24h: 0,
                priceChange24h: 0
            }
        }, { status: 503 });
    }
}
