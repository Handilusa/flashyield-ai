"use client";

import "@rainbow-me/rainbowkit/styles.css";
import React, { useEffect, useState } from "react";
import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { defineChain, http } from "viem";
import { mainnet } from "viem/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

/**
 * Monad Testnet chain configuration
 */
const monadTestnet = defineChain({
    id: 10143,
    name: "Monad Testnet",
    nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://testnet-rpc.monad.xyz"] },
    },
    blockExplorers: {
        default: {
            name: "Monad Explorer",
            url: "https://testnet.monad.xyz",
        },
    },
    testnet: true,
});

/**
 * Wagmi + RainbowKit configuration
 */
const config = getDefaultConfig({
    appName: "FlashYield AI",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "b19da498b2694e1183d4e2e5597ac08b",
    chains: [mainnet, monadTestnet], // Mainnet first to prevent auto-switch on connect
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration errors by not rendering until mounted
    if (!mounted) return null;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: "#7B3FE4",
                        accentColorForeground: "white",
                        borderRadius: "medium",
                        fontStack: "system",
                        overlayBlur: "small",
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export { monadTestnet };
