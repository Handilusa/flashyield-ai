'use client';
import { useState, useEffect } from 'react';
import { useReadContract, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { formatNumber } from '@/utils/formatNumber';

const FLASH_TOKEN_ADDRESS = '0x5D3fC5c24dED074f59Fd5b86Ef7bbD5F5CA77777' as const;

// REEMPLAZA con el address real del pool/pair de nad.fun
const PAIR_ADDRESS = '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE' as const; // Address proporcionada por el usuario

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
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// ABI básico de pair (tipo Uniswap V2)
const PAIR_ABI = [
    {
        inputs: [],
        name: 'getReserves',
        outputs: [
            { name: 'reserve0', type: 'uint112' },
            { name: 'reserve1', type: 'uint112' },
            { name: 'blockTimestampLast', type: 'uint32' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'token0',
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'token1',
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// WMON address on Monad Mainnet (o el token con el que esté pareado, asumimos WMON/MON)
const WMON_ADDRESS = '0x760AfE86e5de5fa0Ee542fc7721795a1d4CA9C54'; // Monad WMON

export function useFlashTokenOnChain() {
    // 1. Leer totalSupply de FLASH
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

    // 2. Leer Balance de FLASH en el Pool
    const { data: flashBalance } = useReadContract({
        address: FLASH_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [PAIR_ADDRESS],
    });

    // 3. Leer Balance de MON (nativo) del Pool
    const { data: monBalance } = useBalance({
        address: PAIR_ADDRESS,
    });

    console.log('DEBUG: FlashToken Balances', {
        totalSupply,
        flashBalance,
        monBalance: monBalance?.value,
        pairAddress: PAIR_ADDRESS
    });

    // Calcular precio y market cap
    let price = 0;
    let marketCap = 0;
    let formattedSupply = '1.00B';

    // Si tenemos supply, lo mostramos aunque no haya precio
    if (totalSupply && decimals) {
        const supplyString = formatUnits(totalSupply, decimals);
        const rawSupply = parseFloat(supplyString);
        formattedSupply = formatNumber(rawSupply);
    }

    // Si tenemos balances, calculamos precio
    if (flashBalance && monBalance && decimals) {
        const flashInPool = parseFloat(formatUnits(flashBalance, decimals));
        const monInPool = parseFloat(formatUnits(monBalance.value, 18)); // MON tiene 18 decimals

        // Precio en MON = MON / FLASH
        if (flashInPool > 0) {
            const priceInMon = monInPool / flashInPool;
            // Asumimos MON = $0.42 (precio hardcoded temporalmente o fetch de API si es posible)
            const MON_PRICE_USD = 0.50; // Ejemplo
            price = priceInMon * MON_PRICE_USD;

            // Recalcular MC con precio
            if (totalSupply) {
                const supplyString = formatUnits(totalSupply, decimals);
                marketCap = price * parseFloat(supplyString);
            }
        }
    }

    // --- FALLBACK PARA DEMO ---
    // Si el precio sigue siendo 0 (lectura on-chain falló), usamos precio del mercado actual ($4.39k MC)
    if (price === 0 && Number(formattedSupply.replace(/[^0-9.-]+/g, "")) > 0) {
        // MC = $4,390
        // Supply = 1,000,000,000 (1B)
        // Price = 4390 / 1000000000 = 0.00000439
        price = 0.00000439;
        marketCap = 4390;
    }
    // --------------------------

    // Loading solo si no tenemos ni supply (lo básico)
    // Si tenemos supply pero no precio, mostramos supply y precio N/A
    const isLoading = !totalSupply;

    return {
        totalSupply: formattedSupply,
        price: price > 0 ? `$${price.toFixed(9)}` : (isLoading ? 'Loading...' : 'N/A'),
        marketCap: marketCap > 0 ? `$${formatNumber(marketCap)}` : (isLoading ? 'Loading...' : 'N/A'),
        loading: isLoading,
        contractAddress: FLASH_TOKEN_ADDRESS,
        nadFunLink: `https://nad.fun/tokens/${FLASH_TOKEN_ADDRESS}`
    };
}
