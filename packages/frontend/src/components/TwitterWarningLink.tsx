"use client";

import { useState } from "react";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TwitterWarningLinkProps {
    className?: string;
    iconSize?: number;
    showText?: boolean;
    style?: React.CSSProperties;
}

const XIcon = ({ size = 16, style }: { size?: number, style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={style}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export function TwitterWarningLink({ className, iconSize = 16, showText = true, style }: TwitterWarningLinkProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        window.open("https://x.com/Cebohia18", "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className}
                style={style}
                aria-label="X (Creator Profile)"
                type="button"
            >
                <XIcon size={iconSize} style={showText ? { display: "inline", marginRight: 6 } : undefined} />
                {showText && "X"}
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
                            className="relative w-full max-w-md bg-[#1A1A2E] border border-yellow-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
                                    <AlertTriangle className="text-yellow-500" size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Leaving FlashYield AI</h3>

                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    This link redirects to the <strong>Creator's Personal X Profile (@Cebohia18)</strong>, not an official project account.
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        style={{ background: 'linear-gradient(135deg, #92400e, #78350f)', color: '#ffffff', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        className="flex-1 py-5 px-8 rounded-lg font-bold hover:brightness-125 transition-all text-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', color: '#ffffff' }}
                                        className="flex-1 py-5 px-8 rounded-lg font-bold hover:brightness-110 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg cursor-pointer"
                                    >
                                        Proceed to X <ExternalLink size={18} />
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
