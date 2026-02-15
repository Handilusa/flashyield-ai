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
    Vote,
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
import { AgentsPreview } from "@/components/AgentsPreview"; // [NEW]
import { RecentActivity } from "@/components/RecentActivity"; // [NEW]
import { PositionSummary } from "@/components/PositionSummary"; // [NEW]
import { useYieldVault } from "@/hooks/useYieldVault";
import FlashTokenSection from "@/components/FlashTokenSection";
import { TwitterWarningLink } from "@/components/TwitterWarningLink";
import { DiscordWarningLink } from "@/components/DiscordWarningLink";
import { BugBountyLink } from "@/components/BugBountyLink";
import { AuditLink } from "@/components/AuditLink";

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
            borderWidth: 2,
        },
        {
            label: "Alpha",
            data: [3.8, 5.5, 7.1, 6.9, 8.2, 8.7],
            borderColor: "#EAB308",
            backgroundColor: "transparent",
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "#EAB308",
            borderWidth: 1.5,
        },
        {
            label: "Beta",
            data: [4.0, 4.6, 5.9, 7.5, 7.1, 7.8],
            borderColor: "#3B82F6",
            backgroundColor: "transparent",
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "#3B82F6",
            borderWidth: 1.5,
        },
        {
            label: "Gamma",
            data: [3.5, 4.8, 5.2, 6.1, 7.6, 8.1],
            borderColor: "#A855F7",
            backgroundColor: "transparent",
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "#A855F7",
            borderWidth: 1.5,
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
            borderWidth: 1,
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
    { pair: "Alpha Rebalance", amount: "+12.5 USDC", time: "2 min ago" },
    { pair: "Beta Harvest", amount: "+8.3 USDC", time: "8 min ago" },
    { pair: "Gamma Optimize", amount: "+21.0 USDC", time: "15 min ago" },
    { pair: "Alpha Rebalance", amount: "+6.7 USDC", time: "23 min ago" },
    { pair: "Beta Rebalance", amount: "+19.2 USDC", time: "31 min ago" },
];

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [visibleDatasets, setVisibleDatasets] = useState<Record<string, boolean>>({
        FlashYield: true, Alpha: true, Beta: true, Gamma: true, "Market Avg": true,
    });

    const toggleDataset = (label: string) => {
        setVisibleDatasets(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const filteredChartData = {
        ...chartData,
        datasets: chartData.datasets.filter(ds => visibleDatasets[ds.label]),
    };

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
                            <span className="gradient-text" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.02em', textShadow: '0 0 10px rgba(131,110,249,0.4), 0 0 30px rgba(131,110,249,0.2)' }}>FlashYield AI</span>
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
                                            🤖 Alpha: <strong>{poolApyA}%</strong> · Beta: <strong>{poolApyB}%</strong>
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
                                title: "Adaptive AI Agents",
                                desc: "Three specialized agents (Alpha, Beta, Gamma) compete to find the best yield opportunities across Monad.",
                                detail: "Risk-adjusted strategies for every investor →",
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
                            <p className="stat-change up">Alpha: {poolApyA}% · Beta: {poolApyB}%</p>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Grid — deposit form + chart */}
                    <Reveal delay={0.2}>
                        <div className="dashboard-grid">
                            {/* Left side: Deposit + Position Summary */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                                        💳 Manage Vault Position
                                    </h3>
                                    <DepositForm />
                                </div>
                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                                        📊 Position Summary
                                    </h3>
                                    <PositionSummary />
                                </div>
                            </div>

                            {/* Right side: Swap + Chart */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <SwapForm />

                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
                                        APY Comparison
                                    </h3>
                                    <div className="chart-placeholder">
                                        <Line data={filteredChartData} options={chartOptions as any} />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                                        {chartData.datasets.map(ds => (
                                            <button
                                                key={ds.label}
                                                onClick={() => toggleDataset(ds.label)}
                                                type="button"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.35rem",
                                                    padding: "0.25rem 0.6rem",
                                                    borderRadius: "9999px",
                                                    fontSize: "0.65rem",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    border: `1px solid ${visibleDatasets[ds.label] ? ds.borderColor : "rgba(255,255,255,0.1)"}`,
                                                    backgroundColor: visibleDatasets[ds.label] ? `${ds.borderColor}20` : "transparent",
                                                    color: visibleDatasets[ds.label] ? ds.borderColor : "#6b7280",
                                                    opacity: visibleDatasets[ds.label] ? 1 : 0.5,
                                                }}
                                            >
                                                <span style={{
                                                    width: 8, height: 8, borderRadius: "50%",
                                                    backgroundColor: visibleDatasets[ds.label] ? ds.borderColor : "#4b5563",
                                                }} />
                                                {ds.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass-card">
                                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                                        <span className="live-dot" /> Live Agent Activity
                                    </h3>
                                    <RecentActivity />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── AI OPTIMIZER ── */}
                <section id="optimizer" className="section pt-0">
                    <Reveal>
                        <div className="section-header">
                            <p className="section-eyebrow">Yield Wars</p>
                            <h2 className="section-title">Meet the Agents</h2>
                            <p className="section-subtitle">
                                Three autonomous strategies competing for the highest yield on Monad
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <AgentsPreview />
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
                                { icon: "💳", title: "Connect & Deposit", desc: "Connect your wallet and deposit USDC into the FlashYield secure vault" },
                                { icon: "🧠", title: "Select AI Agent", desc: "Choose your strategy: Alpha (Safety), Beta (Balanced), or Gamma (Degen)" },
                                { icon: "📈", title: "Earn Auto-Yield", desc: "Your agent monitors & rebalances 24/7 to maximize APY on Monad" },
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
                        <FlashTokenSection />
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
                                {`// `}<span className="code-comment">Step 1: Approve USDC</span>{`
`}<span className="code-keyword">await</span>{` usdc.`}<span className="code-func">approve</span>{`(vaultAddress, amount);

// `}<span className="code-comment">Step 2: Deposit into FlashYield</span>{`
`}<span className="code-keyword">await</span>{` vault.`}<span className="code-func">deposit</span>{`(amount);

// `}<span className="code-comment">Step 3: Agents Activated 🤖</span>{`
// `}<span className="code-comment">Alpha, Beta & Gamma immediately start optimizing</span>
                            </pre>
                        </div>
                    </Reveal>
                </section>

                {/* ── FOOTER ── */}
                <footer className="footer">
                    <div className="footer-grid">
                        <div>
                            <a href="#" className="nav-brand" style={{ marginBottom: "0.5rem" }}>
                                <div className="nav-logo" style={{
                                    background: 'linear-gradient(135deg, #836EF9, #A78BFA)',
                                    borderRadius: '10px',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 12px rgba(131,110,249,0.5), 0 0 24px rgba(131,110,249,0.2)',
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2L4.09 12.63a1 1 0 00.78 1.62H11l-1 7.25a.5.5 0 00.86.41L19.91 11.37a1 1 0 00-.78-1.62H13l1-7.25a.5.5 0 00-.86-.41L13 2z" fill="#ffffff" />
                                    </svg>
                                </div>
                                <span className="nav-title" style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    letterSpacing: '0.03em',
                                    background: 'linear-gradient(135deg, #836EF9, #A78BFA, #C4B5FD)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    textShadow: 'none',
                                }}>FlashYield AI</span>
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
                                <li><a href="https://github.com/Handilusa/flashyield-ai" target="_blank" rel="noopener noreferrer"><BookOpen size={14} style={{ display: "inline", marginRight: 6 }} />Documentation</a></li>
                                <li><a href="https://github.com/Handilusa/flashyield-ai" target="_blank" rel="noopener noreferrer"><Github size={14} style={{ display: "inline", marginRight: 6 }} />GitHub</a></li>
                                <li>
                                    <AuditLink />
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-heading">Community</h4>
                            <ul className="footer-links">
                                <li>
                                    <TwitterWarningLink iconSize={14} />
                                </li>
                                <li>
                                    <DiscordWarningLink iconSize={14} />
                                </li>
                                <li><a href="/governance" target="_blank" rel="noopener noreferrer"><Vote size={14} style={{ display: "inline", marginRight: 6 }} />Governance Forum</a></li>
                                <li>
                                    <BugBountyLink />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2026 FlashYield AI — Moltiverse Hackathon Submission</span>
                        <div className="footer-socials">
                            <TwitterWarningLink
                                showText={false}
                                className="footer-social-icon flex items-center justify-center hover:text-white transition-colors"
                            />
                            <a href="https://github.com/Handilusa/flashyield-ai" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="GitHub"><Github size={16} /></a>
                            <DiscordWarningLink
                                showText={false}
                                className="footer-social-icon flex items-center justify-center hover:text-white transition-colors"
                            />
                            <a href="https://github.com/Handilusa/flashyield-ai" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Docs"><BookOpen size={16} /></a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
