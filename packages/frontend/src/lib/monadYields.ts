// Realistic Monad Ecosystem Yields
// Sources: Curvance (Lending), Fastlane (DEX), Magma (LSD)

export interface MonadPool {
    id: string;
    label: string;
    protocol: string;
    type: string;
    baseApy: number; // Percentage
    volatility: number; // Variance factor
    gasMultiplier: number;
}

export const MONAD_POOLS: MonadPool[] = [
    {
        id: "Pool A",
        label: "Conservative Lending",
        protocol: "Curvance",
        type: "Stablecoin Vault",
        baseApy: 6.5,  // 6.5% APY
        volatility: 0.2,
        gasMultiplier: 1.0
    },
    {
        id: "Pool B",
        label: "Aggressive LP",
        protocol: "Fastlane",
        type: "MON/USDC LP",
        baseApy: 14.2, // 14.2% APY
        volatility: 1.5, // Higher volatility for LP
        gasMultiplier: 1.2
    }
];

export const getPoolById = (id: string) => MONAD_POOLS.find(p => p.id === id);
