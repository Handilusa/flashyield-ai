"use client";

import { useState } from "react";
import { Shield, Lock, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditLinkProps {
    className?: string;
    style?: React.CSSProperties;
}

export function AuditLink({ className, style }: AuditLinkProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 ${className}`}
                style={style}
                type="button"
            >
                <Shield size={14} style={{ display: "inline", marginRight: 6 }} />
                Audit Report
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#1A1A2E] border border-blue-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                    <Shield className="text-blue-500" size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Security Audit Status</h3>

                                <div className="space-y-4 text-gray-300 text-sm mb-6 leading-relaxed">
                                    <p>
                                        FlashYield AI is currently undergoing rigorous <span className="text-blue-400 font-semibold">internal security reviews</span>.
                                    </p>
                                    <p>
                                        Smart contracts are deployed on <strong>Monad Mainnet</strong>. A full external audit by a top-tier firm is scheduled for <strong>Phase 2</strong>.
                                    </p>

                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 text-xs text-blue-200/80 flex items-start gap-2 text-left">
                                        <Lock size={14} className="shrink-0 mt-0.5" />
                                        <span>
                                            We prioritize fund safety above all else. Please invest responsibly.
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#ffffff' }}
                                    className="w-full py-5 px-8 rounded-lg font-bold hover:brightness-110 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg cursor-pointer"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
