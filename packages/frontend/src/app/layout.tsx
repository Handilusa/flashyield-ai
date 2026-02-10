import "@/lib/polyfill"; // Must be first
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
    title: "FlashYield AI | Autonomous Yield Optimization on Monad",
    description:
        "AI-powered DeFi protocol that maximizes your yields 24/7 on Monad blockchain. Non-custodial, fully autonomous yield optimization.",
    openGraph: {
        title: "FlashYield AI — DeFi Yield Optimizer on Monad",
        description:
            "AI agents maximizing your DeFi returns 24/7. Built on Monad with 10,000 TPS.",
        type: "website",
        siteName: "FlashYield AI",
    },
    twitter: {
        card: "summary_large_image",
        title: "FlashYield AI — DeFi Yield Optimizer on Monad",
        description:
            "AI agents maximizing your DeFi returns 24/7. Built on Monad.",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
