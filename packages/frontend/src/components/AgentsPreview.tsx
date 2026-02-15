"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AgentCard } from "@/components/AgentCard";
import { AGENT_ADDRESSES } from "@/config/contracts";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

interface AgentData {
    id: string;
    name: string;
    strategy: string;
    rebalanceThreshold: string;
    riskLevel: string;
    currentPool: string;
    simulatedYield: string;
    simulationCount: string;
}

export function AgentsPreview() {
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                // Fetch initial mock data to populate the cards
                const res = await fetch("/api/agents/simulate");
                if (res.ok) {
                    const data = await res.json();
                    setAgents(data);
                }
            } catch (e) {
                console.error("Failed to fetch agents preview", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const containerVars = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-2">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {agents.map((agent, index) => (
                        <motion.div key={agent.id} variants={itemVars}>
                            <AgentCard
                                rank={index + 1}
                                name={agent.name}
                                strategy={agent.strategy}
                                yield={agent.simulatedYield}
                                rebalances={parseInt(agent.simulationCount)}
                                riskLevel={Number(agent.riskLevel)}
                                threshold={parseFloat(agent.rebalanceThreshold)}
                                agentAddress={AGENT_ADDRESSES[index] as `0x${string}`}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <div className="mt-6 text-center">
                <Link
                    href="/leaderboard"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:-translate-y-1"
                >
                    <Trophy size={20} />
                    Enter Yield Wars Arena
                    <ArrowRight size={20} />
                </Link>
                <p className="text-gray-500 text-sm mt-3">
                    Watch Alpha, Beta, and Gamma compete in real-time
                </p>
            </div>
        </section>
    );
}
