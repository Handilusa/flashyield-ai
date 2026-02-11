import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";

export function Navbar() {
    return (
        <nav className="nav" style={{ top: "0" }}>
            <Link href="/" className="nav-brand">
                <div className="nav-logo">⚡</div>
                <span className="nav-title">FlashYield AI</span>
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
                    <Link
                        href="/leaderboard"
                        className="hover:text-purple-400 transition-colors"
                    >
                        ⚔️ Yield Wars
                    </Link>
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
