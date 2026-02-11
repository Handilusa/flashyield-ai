"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
    Zap,
    Bot,
    Shield,
    Github,
    Twitter,
    MessageCircle,
    BookOpen,
    ExternalLink,
    ChevronRight,
    ArrowRight,
    AlertTriangle,
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { WalletButton } from "@/components/WalletButton";
import { Navbar } from "@/components/Navbar";
import { DepositForm } from "@/components/DepositForm";
import { SwapForm } from "@/components/SwapForm";
import { OptimizerPanel } from "@/components/OptimizerPanel";
import { useYieldVault } from "@/hooks/useYieldVault";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

/* ─── Reusable section reveal ─── */
function Reveal({
    children,
    className = "",
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ─── Stagger variants ─── */
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── Chart data ─── */
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const chartData = {
    labels: chartLabels,
    datasets: [
        {
            label: "FlashYield",
            data: [4.2, 5.1, 6.8, 7.2, 7.9, 8.3],
            borderColor: "#7B3FE4",
            backgroundColor: "rgba(123,63,228,0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#7B3FE4",
        },
        {
            label: "Market Avg",
            data: [3.1, 3.4, 3.2, 3.8, 3.5, 3.9],
            borderColor: "#4b5563",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
        x: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#6b7280", font: { size: 11 } } },
        y: {
            grid: { color: "rgba(255,255,255,0.03)" },
            ticks: { color: "#6b7280", font: { size: 11 }, callback: (v: any) => v + "%" },
        },
    },
};

/* ─── Static trade data (will be replaced when contract events are indexed) ─── */
const recentTrades = [
    { pair: "Pool A → Pool B", amount: "+12.5 USDC", time: "2 min ago" },
    { pair: "Rebalance", amount: "+8.3 USDC", time: "8 min ago" },
    { pair: "Pool B → Pool A", amount: "+21.0 USDC", time: "15 min ago" },
    { pair: "Rebalance", amount: "+6.7 USDC", time: "23 min ago" },
    { pair: "Pool A → Pool B", amount: "+19.2 USDC", time: "31 min ago" },
];

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // ─── Live blockchain data ──────────────────────────────────
    const {
        isConnected,
        address,
        usdcBalance,
        userVaultBalance,
        totalDeposits,
        currentAPY,
        poolApyA,
        poolApyB,
        optimizerAssets,
        isLoadingTVL,
        isLoadingAPY,
        isLoadingUserVault,
    } = useYieldVault();

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Format address for display
    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "";

    return (
        <div onMouseMove={handleMouseMove}>
            {/* ── Animated Background ── */}
            <div className="bg-animated">
                <div className="bg-grid" />
                <div className="bg-mesh" />
                <div className="bg-noise" />
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            {/* Mouse spotlight */}
            <div
                className="mouse-gradient"
                style={{ left: mousePos.x, top: mousePos.y }}
            />

            <div className="page-content">
                {/* ── NAVIGATION ── */}
                <Navbar />

                {/* ── HERO ── */}
                <section className="section hero" style={{ paddingTop: "7rem" }}>
                    <Reveal>
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            {isConnected
                                ? `Connected: ${shortAddress}`
                                : "Live on Monad Mainnet"}
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="hero-title">
                            <span className="gradient-text">FlashYield AI</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="hero-tagline">
                            Autonomous Yield Optimization on Monad
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <p className="hero-sub">AI Agents Maximizing Your DeFi Returns 24/7</p>
                    </Reveal>
                    <Reveal delay={0.35}>
                        <a href="#dashboard" className="hero-cta" style={{ textDecoration: "none" }}>
                            Launch App <ChevronRight size={18} />
                        </a>
                    </Reveal>
                    <Reveal delay={0.45}>
                        <div className="ticker-wrap">
                            <div className="ticker">
                                {[...Array(2)].map((_, i) => (
                                    <span key={i} style={{ display: "contents" }}>
                                        <span className="ticker-item">
                                            💰 TVL: <strong>{isLoadingTVL ? "Loading..." : `${parseFloat(totalDeposits).toLocaleString()} USDC`}</strong>
                                        </span>
                                        <span className="ticker-item">
                                            📊 APY: <strong>{isLoadingAPY ? "Loading..." : `${currentAPY}%`}</strong>
                                        </span>
                                        <span className="ticker-item">
                                            🏦 Pool A: <strong>{poolApyA}%</strong> · Pool B: <strong>{poolApyB}%</strong>
                                        </span>
                                        <span className="ticker-item">⚡ Chain: <strong>Monad Mainnet</strong></span>
                                        <span className="ticker-item">
                                            👛 USDC: <strong>{isConnected ? `${parseFloat(usdcBalance).toFixed(2)}` : "—"}</strong>
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── FEATURES ── */}
                <section id="features" className="section">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">Why FlashYield</p>
                            <h2 className="section-title">Built for Performance</h2>
                            <p className="section-subtitle">
                                Leveraging Monad&apos;s parallel execution for lightning-fast DeFi
                            </p>
                        </div>
                    </Reveal>
                    <motion.div
                        className="features-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                    >
                        {[
                            {
                                icon: <Zap size={28} />,
                                title: "10,000 TPS on Monad",
                                desc: "Execute yield strategies with near-instant finality. No more waiting, no more failed transactions.",
                                detail: "Parallel execution means your trades never queue →",
                            },
                            {
                                icon: <Bot size={28} />,
                                title: "AI-Powered Strategy",
                                desc: "Machine learning models analyze pools in real-time to find the optimal yield allocation.",
                                detail: "Sentiment + on-chain data → smarter decisions →",
                            },
                            {
                                icon: <Shield size={28} />,
                                title: "Non-Custodial",
                                desc: "Your keys, your crypto. Funds stay in audited smart contracts. Always withdraw anytime.",
                                detail: "USDC vault standard. No intermediaries →",
                            },
                        ].map((f, i) => (
                            <motion.div key={i} className="glass-card" variants={fadeUp}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                                <p className="feature-detail">{f.detail}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── DASHBOARD (live data) ── */}
                <section id="dashboard" className="section">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">Live Dashboard</p>
                            <h2 className="section-title">Performance at a Glance</h2>
                            <p className="section-subtitle">
                                {isConnected
                                    ? "Real-time data from Monad Mainnet"
                                    : "Connect your wallet to see live data"}
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <span className="agents-badge">
                                <span className="live-dot" />
                                Live on-chain data • Auto-refreshing
                            </span>
                        </div>
                    </Reveal>

                    {/* Stats Row — live from chain */}
                    <motion.div
                        className="stats-row"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <motion.div className="glass-card" variants={fadeUp}>
                            <div className="stat-top">
                                <div className="stat-icon-wrap purple">💰</div>
                                <span className="stat-label">Total Value Locked</span>
                            </div>
                            <p className="stat-value">
                                {isLoadingTVL
                                    ? "Loading..."
                                    : `${parseFloat(totalDeposits).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
                            </p>
                            <p className="stat-change up">Live from YieldVault contract</p>
                        </motion.div>
                        <motion.div className="glass-card" variants={fadeUp}>
                            <div className="stat-top">
                                <div className="stat-icon-wrap pink">👛</div>
                                <span className="stat-label">Your Vault Balance</span>
                            </div>
                            <p className="stat-value">
                                {isConnected
                                    ? isLoadingUserVault
                                        ? "Loading..."
                                        : `${parseFloat(userVaultBalance).toFixed(2)} USDC`
                                    : "Connect wallet"}
                            </p>
                            <p className="stat-change up">
                                {isConnected ? shortAddress : "—"}
                            </p>
                        </motion.div>
                        <motion.div className="glass-card" variants={fadeUp}>
                            <div className="stat-top">
                                <div className="stat-icon-wrap blue">📊</div>
                                <span className="stat-label">Current APY</span>
                            </div>
                            <p className="stat-value">
                                {isLoadingAPY ? "Loading..." : `${currentAPY}%`}
                            </p>
                            <p className="stat-change up">Pool A: {poolApyA}% · Pool B: {poolApyB}%</p>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Grid — deposit form + chart */}
                    <Reveal delay={0.2}>
                        <div className="dashboard-grid">
                            {/* Deposit Form — real blockchain interaction */}
                            <div className="glass-card">
                                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                                    💳 Deposit USDC to Vault
                                </h3>
                                <DepositForm />
                            </div>

                            {/* Right side: Swap + Chart */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <SwapForm />

                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                                        APY Comparison
                                    </h3>
                                    <div className="chart-placeholder">
                                        <Line data={chartData} options={chartOptions as any} />
                                    </div>
                                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.75rem" }}>
                                        <span style={{ color: "#7B3FE4" }}>● FlashYield AI</span>
                                        <span style={{ color: "#6b7280" }}>● Market Average</span>
                                    </div>
                                </div>
                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                                        <span className="live-dot" /> Recent Trades
                                    </h3>
                                    <ul className="trade-feed">
                                        {recentTrades.map((t, i) => (
                                            <li key={i} className="trade-item">
                                                <span className="trade-pair">{t.pair}</span>
                                                <span className="trade-amount">{t.amount}</span>
                                                <span className="trade-time">{t.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── AI OPTIMIZER ── */}
                <section id="optimizer" className="section">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">AI Agent</p>
                            <h2 className="section-title">Yield Optimizer</h2>
                            <p className="section-subtitle">
                                Autonomous rebalancing powered by on-chain intelligence
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <OptimizerPanel />
                    </Reveal>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section id="how-it-works" className="section">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">Simple Process</p>
                            <h2 className="section-title">How It Works</h2>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="steps-grid">
                            {[
                                { icon: "🪙", title: "Mint Test USDC", desc: "Get free USDC for testing with one click" },
                                { icon: "💳", title: "Approve & Deposit", desc: "Approve USDC spending, then deposit into the vault" },
                                { icon: "🤖", title: "AI Optimizes", desc: "AI agent rebalances between Pool A & Pool B for max APY" },
                            ].map((s, i) => (
                                <span key={i} style={{ display: "contents" }}>
                                    {i > 0 && (
                                        <div style={{ textAlign: "center" }}>
                                            <span className="step-arrow"><ArrowRight size={24} /></span>
                                        </div>
                                    )}
                                    <div className="glass-card step-card">
                                        <div className="step-num">{i + 1}</div>
                                        <div className="step-icon">{s.icon}</div>
                                        <h3 className="step-title">{s.title}</h3>
                                        <p className="step-desc">{s.desc}</p>
                                    </div>
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </section>

                {/* ── TOKENOMICS ── */}
                <section id="token" className="section-sm">
                    <Reveal>
                        <div className="token-banner">
                            <h2 className="token-name">
                                <span className="gradient-text">$FLASH Token</span>
                            </h2>
                            <p className="token-venue">Launching on Nad.fun — Monad&apos;s Premier Launchpad</p>
                            <div className="token-stats">
                                <div>
                                    <p className="token-stat-label">Total Supply</p>
                                    <p className="token-stat-value">1,000,000</p>
                                </div>
                                <div>
                                    <p className="token-stat-label">Holders</p>
                                    <p className="token-stat-value">847</p>
                                </div>
                                <div>
                                    <p className="token-stat-label">24h Volume</p>
                                    <p className="token-stat-value">$142K</p>
                                </div>
                            </div>
                            <button className="btn-rainbow">
                                Buy $FLASH <ExternalLink size={16} />
                            </button>
                        </div>
                    </Reveal>
                </section>

                {/* ── DOCS PREVIEW ── */}
                <section id="docs" className="section">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">Developer Friendly</p>
                            <h2 className="section-title">Integrate in Minutes</h2>
                            <p className="section-subtitle">
                                Deposit USDC — Approve first, then deposit
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="terminal-box">
                            <div className="terminal-header">
                                <span className="terminal-dot red" />
                                <span className="terminal-dot yellow" />
                                <span className="terminal-dot green" />
                                <span className="terminal-title">FlashYield — USDC Integration</span>
                            </div>
                            <pre className="terminal-body">
                                {`// `}<span className="code-comment">Step 1: Approve USDC for the Vault</span>{`
`}<span className="code-keyword">await</span>{` usdc.`}<span className="code-func">approve</span>{`(
  vaultAddress,
  `}<span className="code-func">parseUnits</span>{`(`}<span className="code-string">&quot;100&quot;</span>{`, 6)
);

// `}<span className="code-comment">Step 2: Deposit USDC into the Vault</span>{`
`}<span className="code-keyword">await</span>{` vault.`}<span className="code-func">deposit</span>{`(
  `}<span className="code-func">parseUnits</span>{`(`}<span className="code-string">&quot;100&quot;</span>{`, 6)
);

// `}<span className="code-comment">AI agents handle yield optimization 🤖</span>
                            </pre>
                        </div>
                    </Reveal>
                </section>

                {/* ── FOOTER ── */}
                <footer className="footer">
                    <div className="footer-grid">
                        <div>
                            <a href="#" className="nav-brand" style={{ marginBottom: "0.5rem" }}>
                                <div className="nav-logo">⚡</div>
                                <span className="nav-title">FlashYield AI</span>
                            </a>
                            <p className="footer-brand-text">
                                Autonomous AI agents optimizing DeFi yields 24/7 on Monad blockchain. Non-custodial, transparent, always running.
                            </p>
                            <div style={{ marginTop: "0.75rem" }}>
                                <span className="monad-badge">🟣 Built on Monad</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="footer-heading">Resources</h4>
                            <ul className="footer-links">
                                <li><a href="#"><BookOpen size={14} style={{ display: "inline", marginRight: 6 }} />Documentation</a></li>
                                <li><a href="#"><Github size={14} style={{ display: "inline", marginRight: 6 }} />GitHub</a></li>
                                <li><a href="#">Audit Report</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-heading">Community</h4>
                            <ul className="footer-links">
                                <li><a href="#"><Twitter size={14} style={{ display: "inline", marginRight: 6 }} />Twitter</a></li>
                                <li><a href="#"><MessageCircle size={14} style={{ display: "inline", marginRight: 6 }} />Discord</a></li>
                                <li><a href="#">Governance Forum</a></li>
                                <li><a href="#">Bug Bounty</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2026 FlashYield AI — Moltiverse Hackathon Submission</span>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-icon" aria-label="Twitter"><Twitter size={16} /></a>
                            <a href="#" className="footer-social-icon" aria-label="GitHub"><Github size={16} /></a>
                            <a href="#" className="footer-social-icon" aria-label="Discord"><MessageCircle size={16} /></a>
                            <a href="#" className="footer-social-icon" aria-label="Docs"><BookOpen size={16} /></a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
