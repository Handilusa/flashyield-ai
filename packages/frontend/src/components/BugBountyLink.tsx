"use client";

import { useState } from "react";
import { Bug, Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BugBountyLinkProps {
    className?: string;
    style?: React.CSSProperties;
}

export function BugBountyLink({ className, style }: BugBountyLinkProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        // Note: Direct DM links require numeric user ID (e.g., https://twitter.com/messages/compose?recipient_id=12345678)
        // Since we don't have it, we link to the profile where the user can click the Message button.
        window.open("https://x.com/Cebohia18", "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 ${className}`}
                style={style}
                type="button"
            >
                <Bug size={14} />
                Bug Bounty
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
                            className="relative w-full max-w-md bg-[#1A1A2E] border border-red-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                    <Bug className="text-red-500" size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Found a Bug?</h3>

                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    If you have found a bug, please write to me directly.
                                    <br /><br />
                                    I would appreciate it very much! <span className="text-red-400">♥</span>
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        style={{ background: 'linear-gradient(135deg, #991b1b, #7f1d1d)', color: '#ffffff', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        className="flex-1 py-5 px-8 rounded-lg font-bold hover:brightness-125 transition-all text-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)', color: '#ffffff' }}
                                        className="flex-1 py-5 px-8 rounded-lg font-bold hover:brightness-110 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg cursor-pointer"
                                    >
                                        Send DM <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
