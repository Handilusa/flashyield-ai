'use client';

const FLASH_TOKEN_ADDRESS = '0x5D3fC5c24dED074f59Fd5b86Ef7bbD5F5CA77777';
const NAD_FUN_LINK = `https://nad.fun/tokens/${FLASH_TOKEN_ADDRESS}`;

export default function FlashTokenSection() {
    const copyAddress = () => {
        navigator.clipboard.writeText(FLASH_TOKEN_ADDRESS);
        // Si tienes toast: toast.success('Address copied!');
    };

    return (
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-xl border border-purple-500/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
            <div className="card-body p-8 sm:p-12">
                {/* Header Centrado */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <h2 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient mb-6">
                        ⚡ $FLASH Token
                    </h2>

                    <p className="text-lg opacity-80 flex items-center gap-3 mb-10">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live on{' '}
                        <a
                            href={NAD_FUN_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary font-bold hover:text-purple-400 transition-colors"
                        >
                            Nad.fun
                        </a>
                        <span className="opacity-50">—</span> Monad's Premier Launchpad
                    </p>

                    <a
                        href={NAD_FUN_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex group items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
                        role="button"
                    >
                        <div className="absolute transition-all duration-200 rounded-xl -inset-px bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-gradient blur-lg opacity-70"></div>
                        <span className="relative inline-flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 group-hover:rotate-12 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Buy $FLASH Now
                        </span>
                    </a>
                </div>

                <div className="divider opacity-10 my-10"></div>

                {/* Stats Grid con diseño más limpio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Total Supply */}
                    <div className="stat bg-purple-500/5 rounded-3xl border border-purple-500/10 backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-300 group p-8 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-24 h-24 stroke-purple-400 transform rotate-12">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>

                        <div className="stat-title text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Total Supply</div>
                        <div className="stat-value text-5xl sm:text-6xl font-black text-white mb-2">
                            1B
                        </div>
                        <div className="stat-desc text-sm font-mono opacity-50">1,000,000,000 FLASH</div>
                    </div>

                    {/* Contract Address */}
                    <div className="stat bg-blue-500/5 rounded-3xl border border-blue-500/10 backdrop-blur-sm hover:bg-blue-500/10 transition-all duration-300 group p-8 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-24 h-24 stroke-blue-400 transform -rotate-12">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>

                        <div className="stat-title text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Contract Address</div>
                        <div className="stat-value text-2xl sm:text-3xl font-mono break-all leading-tight mb-4">
                            {FLASH_TOKEN_ADDRESS.slice(0, 8)}...{FLASH_TOKEN_ADDRESS.slice(-6)}
                        </div>
                        <div className="stat-actions mt-8 relative z-20">
                            <button
                                onClick={copyAddress}
                                className="btn btn-ghost w-full flex items-center justify-center gap-2 hover:bg-blue-500/20 text-blue-300 transition-all rounded-xl border border-blue-500/20 py-3 font-bold tracking-wide shadow-lg hover:shadow-blue-500/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Contract Address
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid minimalista */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-300 group hover:-translate-y-1">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💎</div>
                        <h4 className="font-bold text-lg mb-2">Fair Launch</h4>
                        <p className="text-sm opacity-60">100% Community Owned</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all duration-300 group hover:-translate-y-1">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                        <h4 className="font-bold text-lg mb-2">Monad Speed</h4>
                        <p className="text-sm opacity-60">Sub-second Tx Finality</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all duration-300 group hover:-translate-y-1">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
                        <h4 className="font-bold text-lg mb-2">AI Yield Wars</h4>
                        <p className="text-sm opacity-60">Autonomous Agents</p>
                    </div>
                </div>

                {/* Info Link Discreto */}
                <div className="text-center mt-12">
                    <a href={NAD_FUN_LINK} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-purple-400 transition-all">
                        View Analytics on Nad.fun
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
