'use client';
import { useState, useRef, type ReactNode } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Vote,
    TrendingUp,
    Users,
    Activity,
    FileText,
    Plus,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    AlertTriangle,
    ChevronRight,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';

/* ─── Reusable Reveal Component ─── */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

interface Proposal {
    id: number;
    title: string;
    description: string;
    author: string;
    status: 'Active' | 'Passed' | 'Rejected' | 'Pending';
    votesFor: number;
    votesAgainst: number;
    endDate: string;
    category: 'Agent Strategy' | 'Tokenomics' | 'Feature' | 'Protocol';
}

export default function GovernancePage() {
    const [activeTab, setActiveTab] = useState<'proposals' | 'create' | 'about'>('proposals');

    const proposals: Proposal[] = [
        {
            id: 1,
            title: 'Add Agent Delta: Ultra-Aggressive Strategy',
            description: 'Introduce a 4th agent with 0.1% rebalance threshold for maximum yield chasing. Higher risk, potentially higher returns.',
            author: '0x742d...8f3a',
            status: 'Active',
            votesFor: 12547,
            votesAgainst: 3421,
            endDate: '2026-02-20',
            category: 'Agent Strategy'
        },
        {
            id: 2,
            title: 'Implement FLASH Staking Rewards',
            description: 'Distribute 5% of protocol fees to FLASH token stakers. Encourages long-term holding and aligns incentives.',
            author: '0x8a1b...2c4d',
            status: 'Active',
            votesFor: 8932,
            votesAgainst: 1205,
            endDate: '2026-02-18',
            category: 'Tokenomics'
        },
        {
            id: 3,
            title: 'Multi-Chain Expansion to Base',
            description: 'Deploy FlashYield AI on Base network to reach broader DeFi audience.',
            author: '0x3f2e...9b1c',
            status: 'Passed',
            votesFor: 18420,
            votesAgainst: 2103,
            endDate: '2026-02-10',
            category: 'Protocol'
        },
        {
            id: 4,
            title: 'Add Historical Performance Analytics',
            description: 'Create dashboard showing each agent\'s performance over time with charts and metrics.',
            author: '0x5d8c...7a2f',
            status: 'Pending',
            votesFor: 0,
            votesAgainst: 0,
            endDate: '2026-02-25',
            category: 'Feature'
        }
    ];

    const getStatusConfig = (status: Proposal['status']) => {
        switch (status) {
            case 'Active': return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: Activity };
            case 'Passed': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2 };
            case 'Rejected': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle };
            case 'Pending': return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock };
        }
    };

    const getCategoryColor = (category: Proposal['category']) => {
        switch (category) {
            case 'Agent Strategy': return 'from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/20';
            case 'Tokenomics': return 'from-pink-500/20 to-pink-500/5 text-pink-300 border-pink-500/20';
            case 'Feature': return 'from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-500/20';
            case 'Protocol': return 'from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/20';
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0B0B0F]">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <Reveal>
                    <div className="mb-12 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 mb-4">
                            <Vote size={14} className="text-purple-400" />
                            <span>DAO Governance</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-purple-100 to-white/70 bg-clip-text text-transparent tracking-tight">
                            Community<br />Governance
                        </h1>
                        <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
                            Shape the future of FlashYield AI. Propose new strategies, adjust protocol parameters, and vote on key decisions.
                        </p>
                    </div>
                </Reveal>

                {/* Stats Grid */}
                <Reveal delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        {[
                            { label: 'Total Proposals', value: '24', sub: '+4 this week', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { label: 'Active Voters', value: '1,247', sub: '12% increase', icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                            { label: 'Your Voting Power', value: '1,250', sub: 'FLASH Tokens', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group"
                            >
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                        <p className={`text-xs font-medium ${stat.color}`}>{stat.sub}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/5`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Reveal>

                {/* Tabs & Controls */}
                <Reveal delay={0.2}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex items-center gap-1">
                            {[
                                { id: 'proposals', label: 'Proposals', icon: FileText },
                                { id: 'create', label: 'Create', icon: Plus },
                                { id: 'about', label: 'How it Works', icon: AlertCircle }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
                                        ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'proposals' && (
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="text"
                                        placeholder="Search proposals..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                                <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </Reveal>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {/* ─── PROPOSALS TAB ─── */}
                    {activeTab === 'proposals' && (
                        <motion.div
                            key="proposals"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4"
                        >
                            {proposals.map((proposal, i) => {
                                const statusConfig = getStatusConfig(proposal.status);
                                const StatusIcon = statusConfig?.icon || Activity;
                                return (
                                    <motion.div
                                        key={proposal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative p-1 rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.03] hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                                    >
                                        <div className="relative p-6 rounded-xl bg-[#0B0B0F]/90 backdrop-blur-xl h-full border border-white/[0.06] group-hover:border-transparent transition-all">
                                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-xs font-bold text-white/30">#{proposal.id.toString().padStart(3, '0')}</span>
                                                        <div className={`px-2.5 py-1 rounded-full border ${statusConfig?.border} ${statusConfig?.bg} ${statusConfig?.color} text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                                                            <StatusIcon size={12} />
                                                            {proposal.status}
                                                        </div>
                                                        <div className={`px-2.5 py-1 rounded-full border bg-gradient-to-r ${getCategoryColor(proposal.category)} text-[10px] font-bold uppercase tracking-wider`}>
                                                            {proposal.category}
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                                        {proposal.title}
                                                    </h3>
                                                    <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-3xl">
                                                        {proposal.description}
                                                    </p>

                                                    <div className="flex items-center gap-6 text-xs font-medium text-white/40">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[8px] text-white font-bold">
                                                                {proposal.author.substring(2, 4)}
                                                            </div>
                                                            <span>{proposal.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} />
                                                            <span>Ends {proposal.endDate}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Voting Stats / Actions */}
                                                {proposal.status === 'Active' && (
                                                    <div className="w-full md:w-64 bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
                                                        <div className="flex justify-between text-xs font-semibold mb-2">
                                                            <span className="text-green-400">For</span>
                                                            <span className="text-white">{proposal.votesFor.toLocaleString()}</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                                                            />
                                                        </div>

                                                        <div className="flex justify-between text-xs font-semibold mb-4">
                                                            <span className="text-red-400">Against</span>
                                                            <span className="text-white">{proposal.votesAgainst.toLocaleString()}</span>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold transition-all hover:scale-105 active:scale-95">
                                                                Vote For
                                                            </button>
                                                            <button className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all hover:scale-105 active:scale-95">
                                                                Against
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                {proposal.status !== 'Active' && (
                                                    <div className="w-full md:w-32 flex items-center justify-center">
                                                        <button className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors group/btn">
                                                            Details
                                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* ─── CREATE TAB ─── */}
                    {activeTab === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <FileText size={200} />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    Create Proposal
                                    <div className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs uppercase tracking-wider font-bold">
                                        Draft
                                    </div>
                                </h2>

                                <form className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 ml-1">Title</label>
                                        <input type="text" placeholder="Proposal title..." className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/20" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Category</label>
                                            <select className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer">
                                                <option>Agent Strategy</option>
                                                <option>Tokenomics</option>
                                                <option>Feature</option>
                                                <option>Protocol</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70 ml-1">Voting Period</label>
                                            <select className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer">
                                                <option>3 Days</option>
                                                <option>7 Days (Standard)</option>
                                                <option>14 Days</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 ml-1">Description</label>
                                        <textarea placeholder="Detailed description..." className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all min-h-[160px] resize-none placeholder:text-white/20" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                                        <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-yellow-500 mb-1">Proposal Requirement</h4>
                                            <p className="text-xs text-yellow-500/80">You need 1,000 FLASH tokens to submit a proposal. This action cannot be undone.</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4">
                                        <button type="button" className="px-6 py-2.5 rounded-xl border border-white/10 text-white/60 font-bold hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                                        <button type="button" className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105 active:scale-95">
                                            Submit Proposal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── ABOUT TAB ─── */}
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { title: 'Create Proposal', desc: 'Any holder with 1,000+ FLASH tokens can create a proposal.', icon: Plus, color: 'text-purple-400' },
                                    { title: 'Community Discussion', desc: 'The community reviews and discusses the proposal for 3 days.', icon: MessageCircle, color: 'text-blue-400' },
                                    { title: 'Voting Period', desc: 'Token holders vote for or against. Voting power = FLASH tokens held.', icon: Vote, color: 'text-pink-400' },
                                    { title: 'Implementation', desc: 'If >60% vote "For" and quorum reached, the team implements it.', icon: CheckCircle2, color: 'text-green-400' }
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] transition-all"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${step.color} mb-4`}>
                                            <step.icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{i + 1}. {step.title}</h3>
                                        <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-400 mb-1">Governance Beta</h4>
                                    <p className="text-xs text-blue-300/70">Full on-chain voting will be implemented in Phase 2. Current votes are advisory.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper component for About tab
function MessageCircle({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}
