'use client';
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { formatNumber } from '@/utils/formatNumber';

const FLASH_TOKEN_ADDRESS = '0x5D3fC5c24dED074f59Fd5b86Ef7bbD5F5CA77777' as const;

const ERC20_ABI = [
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

interface TokenStats {
    priceUsd: string;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    liquidity?: number;
    lastUpdate: string;
}

export function useFlashToken() {
    const [stats, setStats] = useState<TokenStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Leer totalSupply on-chain
    const { data: totalSupply } = useReadContract({
        address: FLASH_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
    });

    const { data: decimals } = useReadContract({
        address: FLASH_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'decimals',
    });

    // Formatear supply: 1000000000 → 1.00B
    let formattedSupply = '1.00B';
    if (totalSupply && decimals) {
        const supplyString = formatUnits(totalSupply, decimals);
        const rawSupply = parseFloat(supplyString);
        formattedSupply = formatNumber(rawSupply);
    }

    // Fetch datos REALES cada 30 min
    useEffect(() => {
        const fetchRealData = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/token-stats');
                const result = await response.json();

                if (result.success) {
                    setStats(result.data);
                    setError(null);
                    console.log('✅ Real token data fetched:', result.data);
                } else {
                    setError('Unable to fetch real-time data');
                    console.error('❌ API returned error:', result.error);
                }
            } catch (err) {
                setError('Failed to fetch token stats');
                console.error('❌ Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch inmediato
        fetchRealData();

        // Refetch cada 30 minutos
        const interval = setInterval(fetchRealData, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        totalSupply: formattedSupply,
        price: stats?.priceUsd ? `$${parseFloat(stats.priceUsd).toFixed(6)}` : 'Loading...',
        marketCap: stats?.marketCap ? `$${formatNumber(stats.marketCap)}` : 'Loading...',
        volume24h: stats?.volume24h ? `$${formatNumber(stats.volume24h)}` : 'Loading...',
        priceChange24h: stats?.priceChange24h || 0,
        liquidity: stats?.liquidity ? `$${formatNumber(stats.liquidity)}` : undefined,
        lastUpdate: stats?.lastUpdate ? new Date(stats.lastUpdate) : new Date(),
        loading,
        error,
        contractAddress: FLASH_TOKEN_ADDRESS,
        nadFunLink: `https://nad.fun/tokens/${FLASH_TOKEN_ADDRESS}`,
        dexScreenerLink: `https://dexscreener.com/monad/${FLASH_TOKEN_ADDRESS}`
    };
}
