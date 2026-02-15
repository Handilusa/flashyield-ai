"use client";

import { useState } from "react";
import { Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DiscordWarningLinkProps {
    className?: string;
    iconSize?: number;
    showText?: boolean;
    style?: React.CSSProperties;
}

const DiscordIcon = ({ size = 16, style }: { size?: number, style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 127.14 96.36"
        width={size}
        height={size}
        style={style}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.36-24.44-5.42-48.18-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
);

export function DiscordWarningLink({ className, iconSize = 16, showText = true, style }: DiscordWarningLinkProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className}
                style={style}
                aria-label="Discord (Coming Soon)"
                type="button"
            >
                <DiscordIcon size={iconSize} style={showText ? { display: "inline", marginRight: 6 } : undefined} />
                {showText && "Discord"}
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
                            className="relative w-full max-w-md bg-[#1A1A2E] border border-purple-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                                    <AlertCircle className="text-purple-500" size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Discord Not Available Yet</h3>

                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    This project does not have a Discord server yet.
                                    <br /><br />
                                    It will exist in the future if the project <strong>wins the hackathon</strong> or receives support from Monad creators.
                                </p>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#ffffff' }}
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
