import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";

export function Navbar() {
    return (
        <nav className="nav" style={{ top: "0" }}>
            <Link href="/" className="nav-brand">
                <div
                    className="nav-logo"
                    style={{
                        background: 'linear-gradient(135deg, #836EF9, #A78BFA)',
                        borderRadius: '10px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 12px rgba(131,110,249,0.5), 0 0 24px rgba(131,110,249,0.2)',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L4.09 12.63a1 1 0 00.78 1.62H11l-1 7.25a.5.5 0 00.86.41L19.91 11.37a1 1 0 00-.78-1.62H13l1-7.25a.5.5 0 00-.86-.41L13 2z" fill="#ffffff" />
                    </svg>
                </div>
                <span
                    className="nav-title"
                    style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        letterSpacing: '0.03em',
                        background: 'linear-gradient(135deg, #836EF9, #A78BFA, #C4B5FD)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: 'none',
                    }}
                >FlashYield AI</span>
            </Link>
            <ul className="nav-links">
                <li>
                    <Link href="/#features">Features</Link>
                </li>
                <li>
                    <Link href="/#dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/#optimizer">AI Agent</Link>
                </li>
                <li>
                    <Link href="/#how-it-works">How It Works</Link>
                </li>
                <li>
                    <Link href="/#token">Token</Link>
                </li>
                <li>
                    <Link href="/#docs">Docs</Link>
                </li>
                <li>
                    <Link href="/leaderboard">⚔️ Yield Wars</Link>
                </li>
            </ul>
            {/* Real wallet connection button */}
            <WalletButton />
            <button className="nav-hamburger" aria-label="Menu">
                <span />
                <span />
                <span />
            </button>
        </nav>
    );
}
