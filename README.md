# ⚡ FlashYield AI: Yield Wars

**Autonomous AI agents competing in real-time to find the best DeFi yield strategies on Monad**

<div align="center">
  <img src="monad-logo.png" alt="Monad Logo" width="200" />
</div>

<div align="center">
  <a href="https://flashyield-ai.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-flashyield--ai.vercel.app-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://monadvision.com/" target="_blank">
    <img src="https://img.shields.io/badge/Network-Monad_Mainnet-8338ec?style=for-the-badge" alt="Monad Mainnet" />
  </a>
  <a href="https://nad.fun/tokens/0x5D3fC5c24dED074f59Fd5b86Ef7bbD5F5CA77777" target="_blank">
    <img src="https://img.shields.io/badge/Token-$FLASH-yellow?style=for-the-badge" alt="$FLASH Token" />
  </a>
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Framework-Next.js_14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </a>
</div>

---

## 📖 Overview

**FlashYield AI** is a next-generation DeFi platform built on **Monad Mainnet**. Our flagship feature, **Yield Wars**, allows users to watch autonomous AI agents compete in real-time to maximize yield.

Unlike traditional yield optimizers, FlashYield employs three distinct AI personalities—**Alpha**, **Beta**, and **Gamma**—each with a unique risk appetite and rebalancing strategy. Users can observe these agents battling for the highest APY across multiple liquidity pools, deposit into the vault, swap tokens, and track their position — all powered by Monad's sub-second finality.

### Why FlashYield?
- 🤖 **3 Autonomous Agents**: Competing strategies running in parallel
- 📊 **Real-Time Competition**: Live leaderboard with interactive charts
- 🗳️ **Governance Forum**: Vote on proposals and shape the protocol's future
- ⛓️ **On-Chain Recording**: All rebalances stored on Monad blockchain
- 💨 **Off-Chain Simulation**: Test strategies without gas fees
- ⚡ **Monad Speed**: Sub-second decision making
- 🎮 **Interactive Seasons**: Start/stop simulation cycles with dynamic APYs
- 💬 **AI Chatbot**: Natural language DeFi assistant powered by Groq
- 🪙 **$FLASH Token**: Live on nad.fun

---

## 🚀 Features

### 🤖 3 Autonomous AI Agents

Each agent has a distinct strategy for rebalancing funds:

| Agent | Risk Profile | Threshold | Strategy |
|-------|-------------|-----------|----------|
| 🦁 **Alpha** | Conservative | ≥3.0% (300 bps) | Waits for significant gaps, minimizes TX costs |
| ⚖️ **Beta** | Balanced | ≥1.5% (150 bps) | Moderate rebalancing, steady growth |
| 🦅 **Gamma** | Aggressive | ≥0.5% (50 bps) | Chases every opportunity, high frequency |

### ⚔️ Yield Wars Arena

- **Live Yield Chart**: Visualizes performance of all three agents over time
- **Advanced Stats**: Tracks Success Rate, Best Move, Total Rebalances
- **History Log**: Scrollable, exportable record of every decision
- **Leaderboard**: Dynamic rankings updated in real-time
- **Season Controls**: Start/Stop simulation, toggle On-Chain vs Off-Chain
- **Confetti**: Celebrate the season winner with visual flair 🎉

### 🎨 Premium Design System

- **Orbitron Typography**: Futuristic, high-impact headings with electric gradients
- **Glassmorphism**: Deep, multi-layered glass cards with frosted blur effects
- **Monad Purple Theme**: A rich, cohesive color palette (`#836EF9` → `#A78BFA`)
- **Interactive UI**:
    - **Live Agent Activity**: Smooth animated feed of agent decisions
    - **Glowing Effects**: Subtle neon glows on hover and active states
    - **Custom Icons**: Bespoke lightning bolt branding and status indicators

### 🗳️ Governance Forum (New!)

- **Proposals**: Create and view community proposals (GIPs)
- **Voting**: Cast votes "For" or "Against" directly on the interface
- **Status Tracking**: Filter by Active, Passed, or Executed proposals
- **Visuals**: Animated cards with progress bars and status badges

### 💳 DeFi Operations

- **Deposit & Withdraw**: Full vault management with approval flow
- **MON/USDC Swap**: Integrated token swap via SimpleDEX contract
- **Mint Test USDC**: One-click mock USDC for testing
- **APY Badge**: Live current APY display with animated indicator
- **Quick-Fill Buttons**: 10, 50, 100, 500, MAX

### 💬 AI Assistant

- Powered by **Vercel AI SDK** + **Groq**
- Natural language commands for deposits, withdrawals, and balance queries
- Explains agent strategies and answers DeFi questions
- Transaction execution via chat

### 🪙 $FLASH Token

- Live on [nad.fun](https://nad.fun)
- One-click copy contract address
- Direct buy link integration

### 🔗 Community & Social

- **X (Twitter)**: Link with disclaimer modal
- **Discord**: Modal with future integration plans
- **Bug Bounty**: Active program via DM on X

---

## 🛡️ Security & Audits

FlashYield AI utilizes **immutable smart contracts** and **non-custodial vaults**.

- **Audits**: Currently in progress. Placeholder links are provided in the app.
- **Bug Bounty**: We encourage security researchers to review our code. Contact us via X for bounty details.
- **Disclaimer**: This software is experimental. Use at your own risk.

---

## 🏗️ Architecture

### Smart Contracts (Monad Mainnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **MockUSDC** | `0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67` | [View](https://monadvision.com/address/0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67) |
| **SimpleDEX** | `0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61` | [View](https://monadvision.com/address/0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61) |
| **YieldVault** | `0x8418185C4750957A6661eDe2d740272Ea22C140f` | [View](https://monadvision.com/address/0x8418185C4750957A6661eDe2d740272Ea22C140f) |
| **YieldOptimizer** | `0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3` | [View](https://monadvision.com/address/0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3) |
| **Agent Alpha** | `0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09` | [View](https://monadvision.com/address/0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09) |
| **Agent Beta** | `0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8` | [View](https://monadvision.com/address/0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8) |
| **Agent Gamma** | `0xb2902956785b53ff2717d7b1117df05b8bfc506c` | [View](https://monadvision.com/address/0xb2902956785b53ff2717d7b1117df05b8bfc506c) |

**Network Details:**
- **Chain**: Monad Mainnet
- **RPC**: `https://rpc.monad.xyz/`
- **Chain ID**: `143`
- **Currency**: MON
- **Block Explorer**: https://monadvision.com/

### BaseAgent.sol Architecture

```solidity
contract BaseAgent {
    uint256 public totalRebalances;   // Increments on each rebalance
    uint8 public currentPool;         // 0 = Pool A, 1 = Pool B
    uint256 public lifetimeProfit;    // Total profit accumulated (scaled by 1e6)
    uint256 public threshold;         // Minimum delta to trigger rebalance (in bps)
    
    event AgentRebalanced(
        uint256 timestamp,
        uint8 fromPool,
        uint8 toPool,
        uint256 profit
    );
    
    function executeStrategy(uint256 _apyA, uint256 _apyB, uint256 _profit) public {
        uint256 delta = _apyB > _apyA ? _apyB - _apyA : _apyA - _apyB;
        
        if (delta >= threshold) {
            totalRebalances++;
            currentPool = _apyB > _apyA ? 1 : 0;
            lifetimeProfit += _profit;
            
            emit AgentRebalanced(
                block.timestamp,
                currentPool == 1 ? 0 : 1,
                currentPool,
                _profit
            );
        }
    }
}
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Framer Motion |
| **Web3** | Wagmi v2, Viem, RainbowKit |
| **Charts** | Chart.js (react-chartjs-2), Recharts |
| **AI Ability** | Vercel AI SDK, Groq (Llama 3) |
| **Smart Contracts** | Solidity 0.8.28, Foundry |
| **Deployment** | Vercel (Frontend), Monad (Contracts) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Metamask or RainbowKit-compatible wallet

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Handilusa/flashyield-ai.git
cd flashyield-ai

# 2. Install dependencies
npm install

# 3. Setup environment variables
cd packages/frontend
cp .env.example .env.local
```

### Environment Variables

**Frontend `.env.local`**:
```
NEXT_PUBLIC_MONAD_RPC=https://rpc.monad.xyz/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
GROQ_API_KEY=your_groq_api_key
```

### Run Development Server

```bash
cd packages/frontend
npm run dev

# Visit http://localhost:3000
```

---

## 🧠 How It Works

### 1. Connect & Deposit
Connect your wallet and deposit USDC into the FlashYield Vault. Your funds are managed by the AI agents competing for the best yield.

### 2. Select AI Agent
Choose which agent's strategy to follow — Alpha (conservative), Beta (balanced), or Gamma (aggressive). Each approach has different risk/reward tradeoffs.

### 3. Earn Auto-Yield
The agents operate 24/7, automatically rebalancing between pools to capture the highest APY. Watch them compete in the Yield Wars Arena.

### Simulation Loop
1. **Market Data**: System generates dynamic APYs for Pool A and Pool B every 10 seconds
2. **Decision Logic**: Each agent evaluates if `delta ≥ their threshold`
3. **Rebalance**: If triggered, agent executes strategy (On-Chain or Off-Chain)
4. **Yield Calculation**: Agents earn compound interest + efficiency bonus

---

## 📂 Project Structure

```
flashyield-ai/
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx            # Main dashboard
│   │   │   │   ├── leaderboard/        # Yield Wars Arena
│   │   │   │   ├── governance/         # Governance Forum
│   │   │   │   └── api/
│   │   │   │       ├── agents/         # Agent simulation API
│   │   │   │       ├── chat/           # AI chatbot API (Groq)
│   │   │   │       └── token-stats/    # $FLASH token API
│   │   │   ├── components/
│   │   │   │   ├── AgentCard.tsx       # Agent UI cards
│   │   │   │   ├── AIChatbot.tsx       # AI chat assistant
│   │   │   │   ├── DepositForm.tsx     # Vault deposit/withdraw
│   │   │   │   ├── SwapForm.tsx        # MON/USDC swap
│   │   │   │   ├── PositionSummary.tsx # Vault position stats
│   │   │   │   ├── LiveActivityFeed.tsx # Leaderboard activity
│   │   │   │   ├── Navbar.tsx          # Navigation
│   │   │   │   ├── AuditLink.tsx       # Security modal
│   │   │   │   └── ...                 # UI Components
│   │   │   ├── hooks/
│   │   │   │   ├── useYieldVault.ts    # Vault interactions
│   │   │   │   ├── useSwap.ts          # DEX swap hook
│   │   │   │   └── useAgentContract.ts # Agent contract reads
│   │   │   ├── config/
│   │   │   │   └── contracts.ts        # All contract addresses
│   │   │   └── lib/
│   │   │       ├── abis/               # Contract ABIs
│   │   │       └── agentContracts.ts   # Agent helpers
│   └── contracts/
│       ├── src/
│       │   ├── BaseAgent.sol           # Agent base contract
│       │   ├── MockUSDC.sol            # ERC20 test token
│       │   ├── SimpleDEX.sol           # AMM swap
│       │   ├── YieldVault.sol          # User deposit vault
│       │   ├── YieldOptimizer.sol      # AI optimizer
│       │   └── AgentSimulator.sol      # On-chain simulator
│       ├── script/
│       │   ├── Deploy.s.sol            # Core deployment
│       │   └── DeployAgents.s.sol      # Agent deployment
│       └── foundry.toml
└── README.md
```

---

## 🏆 Hackathon Submission

### 📦 Deliverables

- [x] **Source Code**: [GitHub Repository](https://github.com/Handilusa/flashyield-ai)
- [x] **Live Demo**: [https://flashyield-ai.vercel.app](https://flashyield-ai.vercel.app)
- [x] **7 Smart Contracts Deployed** on Monad Mainnet
- [x] **AI Chatbot**: Natural language DeFi assistant
- [x] **$FLASH Token**: Live on nad.fun
- [x] **Governance Forum**: Interactive proposal voting system
- [x] **Premium UI**: Orbitron styling & advanced glassmorphism
- [x] **Complete Documentation**: Setup, architecture, and usage instructions

### 🎯 Agent Track Requirements

**Autonomous AI Agents Competition:**

- [x] **Autonomous Decision Making**: 3 agents with distinct risk strategies
- [x] **On-Chain Data Integration**: Real-time APY monitoring from Monad contracts
- [x] **Continuous Operation**: Simulations execute every 10 seconds
- [x] **Strategy Differentiation**: Conservative, Balanced, Aggressive profiles
- [x] **Transparency**: Live activity feed showing all agent decisions
- [x] **Competition Visualization**: Real-time leaderboard with yield tracking
- [x] **Historical Data**: Complete rebalance history with export functionality
- [x] **On-Chain Recording**: All approved rebalances stored immutably on Monad

### 💡 Innovation Highlights

- 🎯 **Strategy Competition**: First agent arena showcasing competing DeFi strategies on Monad
- 🔄 **Real-Time Visualization**: Interactive charts with toggleable agent lines
- 🧠 **AI Chatbot**: Natural language DeFi operations
- ⚡ **Monad-Native**: Leverages Monad's high throughput for rapid simulations
- 🗳️ **Community Governance**: Fully integrated voting system
- 📊 **Position Analytics**: Real-time vault share, daily/monthly/yearly earning projections
- 🔒 **Hybrid Mode**: Choose between on-chain recording or off-chain simulation
- 🪙 **$FLASH Token**: Community token live on nad.fun

### 📝 Submission Info

- **Track**: Agent Track - Autonomous AI Agents
- **Team**: Handi (GitHub)
- **Repository**: [https://github.com/Handilusa/flashyield-ai](https://github.com/Handilusa/flashyield-ai)
- **Live Demo**: [https://flashyield-ai.vercel.app](https://flashyield-ai.vercel.app)
- **Contact**: [@Cebohia18](https://x.com/Cebohia18) (X)

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

**⚔️ The Yield Wars await! May the best strategy win. ⚡**

*Built with ❤️ for Monad Hackathon by [@Cebohia18](https://x.com/Cebohia18)*
