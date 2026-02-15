import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import {
    AGENT_SIMULATOR_ADDRESS,
    AGENT_SIMULATOR_ABI,
} from "@/lib/agentContracts";

const monadChain = {
    id: 143,
    name: "Monad Mainnet",
    network: "monad",
    nativeCurrency: {
        decimals: 18,
        name: "Monad",
        symbol: "MON",
    },
    rpcUrls: {
        default: { http: ["https://rpc.monad.xyz"] },
        public: { http: ["https://rpc.monad.xyz"] },
    },
} as const;

// ── Shared Client ──
// Moved inside GET to avoid top-level await/init issues
// const publicClient = createPublicClient({ ... });

// ── GET: Fetch initial state (read-only) ──
export async function GET() {
    try {
        const publicClient = createPublicClient({
            chain: monadChain,
            transport: http("https://rpc.monad.xyz"),
        });

        const agents = await publicClient.readContract({
            address: AGENT_SIMULATOR_ADDRESS,
            abi: AGENT_SIMULATOR_ABI,
            functionName: "getAllSimAgents",
        });

        const formattedAgents = agents.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            strategy: agent.strategy,
            rebalanceThreshold: agent.rebalanceThreshold.toString(),
            riskLevel: agent.riskLevel.toString(),
            currentPool: agent.currentPool === 0 ? "Pool A" : "Pool B",
            simulatedYield: agent.simulatedYield.toString(),
            simulationCount: agent.simulationCount.toString(),
        }));

        return NextResponse.json(formattedAgents);
    } catch (error: any) {
        console.error("Error fetching agent data:", error);
        return NextResponse.json(
            { error: "Failed to fetch agent data" },
            { status: 500 }
        );
    }
}

// ── POST: Run off-chain simulation logic ──
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { agents } = body; // Pass current agent state from frontend to simulate next step

        // Generate Mock APYs using Realistic Monad Data
        const generateMockAPYs = () => {
            const baseTime = Date.now();
            const timeFactor = Math.sin(baseTime / 10000); // Oscillates between -1 and 1

            // Pool A: Curvance (Stable)
            const poolABase = 6.5; // from MONAD_POOLS
            const poolAVar = (timeFactor * 0.2) + ((Math.random() - 0.5) * 0.1);
            const poolA = poolABase + poolAVar;

            // Pool B: Fastlane (Volatile)
            const poolBBase = 14.2; // from MONAD_POOLS
            const poolBVar = (timeFactor * 1.5) + ((Math.random() - 0.5) * 2.0);
            const poolB = poolBBase + poolBVar;

            // Pool C: Magma (Staking - Optional/Unused but good for expansion)
            const poolC = 9.8 + ((Math.random() - 0.5) * 0.4);

            return {
                "Pool A": Number(poolA.toFixed(2)),
                "Pool B": Number(poolB.toFixed(2)),
                "Pool C": Number(poolC.toFixed(2))
            };
        };

        const mockAPYs = generateMockAPYs();
        const poolNames = Object.keys(mockAPYs) as Array<keyof typeof mockAPYs>;

        const results = agents.map((agent: any) => {
            // Resolve current pool APY (default to Pool A if unknown)
            let currentPoolName = agent.currentPool;
            // Clean up pool name if it's "Pool A (Curvance)" from previous state
            if (currentPoolName.includes("Pool A")) currentPoolName = "Pool A";
            if (currentPoolName.includes("Pool B")) currentPoolName = "Pool B";

            if (!mockAPYs[currentPoolName as keyof typeof mockAPYs]) {
                // Handle initial state 0/1 mapping or unknown string
                if (currentPoolName === "0" || currentPoolName === 0) currentPoolName = "Pool A";
                else if (currentPoolName === "1" || currentPoolName === 1) currentPoolName = "Pool B";
                else currentPoolName = "Pool A";
            }

            const currentAPY = mockAPYs[currentPoolName as keyof typeof mockAPYs] || 6.5;

            // Find best pool
            let bestPoolName = currentPoolName;
            let bestAPY = currentAPY;

            poolNames.forEach(pool => {
                if (mockAPYs[pool] > bestAPY) {
                    bestAPY = mockAPYs[pool];
                    bestPoolName = pool;
                }
            });

            // Calculate delta (basis points: 1% = 100)
            let delta = 0;
            if (currentAPY > 0) {
                delta = ((bestAPY - currentAPY) / currentAPY) * 10000;
            } else if (bestAPY > 0) {
                delta = 10000;
            }

            const threshold = Number(agent.rebalanceThreshold);
            const shouldRebalance = delta >= threshold && currentPoolName !== bestPoolName;

            // ── REALISTIC YIELD SIMULATION ──
            // 1. Base Compound Growth: (APY / 100) * (time_fraction) * speed_multiplier
            // 10 seconds per sim / 31536000 seconds per year
            // Multiplied by 20000x for demo visibility
            const timeFraction = 10 / 31536000;
            const demoMultiplier = 500000; // BOOSTED x25 for visibility

            let yieldGain = 0;

            // 2. Strategy Differentiation
            // Add random noise: ±0.02% to make it organic and differentiated
            const noise = (Math.random() * 0.04) - 0.02;

            if (shouldRebalance) {
                // REBALANCE EVENT: Capture arbitrage value
                // Alpha: High reward
                // Beta: Med reward
                // Gamma: Low reward
                let efficiencyFactor = 0.10;
                if (threshold >= 300) efficiencyFactor = 0.15; // Alpha
                if (threshold <= 50) efficiencyFactor = 0.08; // Gamma

                // Gain from the delta move (arbitrage capture)
                yieldGain = (delta * efficiencyFactor * 0.01) + noise;
            } else {
                // HOLD EVENT: Accrue base APY
                // Formula: APY% * time * scalar
                // e.g., 6.5% * ...
                yieldGain = (currentAPY * timeFraction * demoMultiplier) + noise;
            }

            // Ensure yield doesn't go negative or zero for demo
            if (yieldGain < 0.01) yieldGain = 0.05 + Math.random() * 0.05;

            console.log(`[SIM] ${agent.name}: Pool=${currentPoolName} APY=${currentAPY.toFixed(2)}% -> YieldGain=${yieldGain.toFixed(4)}`);

            // Ensure yield doesn't go negative due to noise
            yieldGain = Math.max(0.001, yieldGain);

            return {
                agentId: agent.id,
                name: agent.name,
                action: shouldRebalance ? "REBALANCE" : "HOLD",
                fromPool: currentPoolName,
                toPool: bestPoolName,
                // Pass back rich data
                currentAPY,
                bestAPY,
                apyDelta: delta,
                threshold,
                yieldGain,
                simulationTime: Date.now()
            };
        });

        return NextResponse.json({
            success: true,
            timestamp: Math.floor(Date.now() / 1000),
            marketData: mockAPYs,
            results
        });

    } catch (error: any) {
        console.error("Simulation error:", error);
        return NextResponse.json(
            { error: "Simulation failed", details: error.message },
            { status: 500 }
        );
    }
}
