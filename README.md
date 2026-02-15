# ⚡ FlashYield AI: Yield Wars

Autonomous AI agents competing in real-time to find the best DeFi yield strategies on Monad

<div align="center">
  <img src="monad-logo.png" alt="Monad Logo" width="200" />
</div>

[![Live Demo](https://img.shields.io/badge/Live_Demo-flashyield--ai.vercel.app-blue?style=for-the-badge)](https://flashyield-ai.vercel.app/leaderboard)
[![Network](https://img.shields.io/badge/Network-Monad_Devnet-8338ec?style=for-the-badge&logo=monad)](https://monadvision.com/)
[![Framework](https://img.shields.io/badge/Framework-Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📖 Overview

FlashYield AI is a next-generation DeFi platform built on **Monad Devnet**. Our flagship feature, **Yield Wars**, allows users to watch autonomous AI agents compete in real-time to maximize yield.

Unlike traditional yield optimizers, FlashYield employs three distinct AI personalities—**Alpha**, **Beta**, and **Gamma**—each with a unique risk appetite and rebalancing strategy. Users can observe these agents battling for the highest APY across multiple liquidity pools, visualizing the power of high-frequency DeFi strategies on Monad.

### Why FlashYield?
- 🤖 **Autonomous Agents**: Three unique strategies running in parallel
- 📊 **Real-Time Competition**: Live leaderboard with stats tracking
- ⛓️ **On-Chain Recording**: All rebalances stored on Monad blockchain
- 💨 **Off-Chain Simulation**: Test strategies without gas fees
- ⚡ **Monad Speed**: Built to showcase sub-second decision making
- 🎮 **Interactive Seasons**: Start/stop simulation cycles with dynamic APYs

---

## 🚀 Features

### 🤖 3 Autonomous Agents

Each agent has a distinct strategy for rebalancing funds:

| Agent | Risk Profile | Threshold | Strategy |
|-------|-------------|-----------|----------|
| 🦁 **Alpha** | Conservative | ≥3.0% (300 bps) | Waits for significant gaps, minimizes TX costs |
| ⚖️ **Beta** | Balanced | ≥1.5% (150 bps) | Moderate rebalancing, steady growth |
| 🦅 **Gamma** | Aggressive | ≥0.5% (50 bps) | Chases every opportunity, high frequency |

### 📊 Real-Time Competition

- **Live Yield Chart**: Visualizes performance of all three agents over time (Gold vs Blue vs Purple)
- **Advanced Stats**: Tracks Success Rate, Best Move, Total Rebalances
- **History Log**: Scrollable, exportable record of every decision
- **Leaderboard**: Dynamic rankings updated in real-time

### 🎨 Interactive Dashboard

- **Glassmorphic UI**: Sleek, modern interface with neon accents
- **Tabs**: Switch between Rankings, Charts, History, and Stats
- **Confetti**: Celebrate the season winner with visual flair 🎉
- **Responsive**: Mobile-optimized design

### ⚔️ Season Controls

- **Start/Stop**: Users control the simulation "Season"
- **On-Chain Toggle**: Choose between real blockchain TXs or simulated mode
- **🔒 Mode Lock**: Toggle is locked during active season to prevent inconsistencies
- **Reset**: Wipe the slate clean and start a new competition

### 💬 AI Assistant (Coming Soon)
- Powered by **Vercel AI SDK** + **Groq**
- Explains agent strategies and answers DeFi questions

---

## 🏗️ Architecture

### Smart Contracts (Monad Devnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **Agent Alpha** | `0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09` | [View on MonadVision](https://monadvision.com/address/0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09) |
| **Agent Beta** | `0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8` | [View on MonadVision](https://monadvision.com/address/0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8) |
| **Agent Gamma** | `0xb2902956785b53ff2717d7b1117df05b8bfc506c` | [View on MonadVision](https://monadvision.com/address/0xb2902956785b53ff2717d7b1117df05b8bfc506c) |

**Network Details:**
- Chain: Monad Devnet
- RPC: `https://testnet.monad.xyz/`
- Chain ID: `10143`
- Block Explorer: https://monadvision.com/

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
    
    function getStats() public view returns (
        uint256, // totalRebalances
        uint8,   // currentPool
        uint256, // lifetimeProfit
        uint256  // threshold
    ) {
        return (totalRebalances, currentPool, lifetimeProfit, threshold);
    }
}
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS + DaisyUI |
| **Web3** | Wagmi v2, Viem, RainbowKit |
| **Charts** | Recharts |
| **Animations** | Framer Motion, Canvas Confetti |
| **Smart Contracts** | Solidity 0.8.28, Foundry, Hardhat |
| **AI (Coming)** | Vercel AI SDK, Groq |
| **Deployment** | Vercel |

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
# or: pnpm install

# 3. Setup environment variables
cd packages/frontend
cp .env.example .env.local
```

### Environment Variables

**Frontend `.env.local`**:
```
NEXT_PUBLIC_MONAD_RPC=https://testnet.monad.xyz/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract addresses (auto-filled from contracts.ts if configured)
NEXT_PUBLIC_AGENT_ALPHA_ADDRESS=0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09
NEXT_PUBLIC_AGENT_BETA_ADDRESS=0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8
NEXT_PUBLIC_AGENT_GAMMA_ADDRESS=0xb2902956785b53ff2717d7b1117df05b8bfc506c
```

**Backend `.env`**:
```
PRIVATE_KEY=your_wallet_private_key
MONAD_RPC_URL=https://testnet.monad.xyz/
```

### Run Development Server

```bash
cd packages/frontend
npm run dev

# Visit http://localhost:3000/leaderboard
```

## 🧠 How It Works

### Simulation Loop
1.  **Market Data**: System generates dynamic APYs for Pool A and Pool B every 10 seconds.
2.  **Decision Logic**: Each agent evaluates if `delta ≥ their threshold`.
3.  **Rebalance**: If triggered, agent executes strategy:
    *   **Off-Chain**: Updates local state only.
    *   **On-Chain**: Sends TX to `executeStrategy()` on Monad.
4.  **Yield Calculation**: Agents earn compound interest + efficiency bonus.

### Decision Algorithm
```typescript
const delta = Math.abs(poolBApy - poolAApy);
const deltaBps = Math.floor(delta * 10000);

if (deltaBps >= agent.threshold) {
    // REBALANCE -> Capture higher yield
    await agent.rebalance(poolWithHigherAPY);
} else {
    // HOLD -> Earn current pool's base yield
    agent.earnYield();
}
```

### On-Chain Recording
When user approves a rebalance in On-Chain mode:

```typescript
// Frontend calls contract
await writeContract({
    address: agentAddress,
    abi: BASE_AGENT_ABI,
    functionName: 'executeStrategy',
    args: [poolABps, poolBBps, profitScaled]
});

// Contract increments stats
totalRebalances++;      // 1 → 2 → 3...
lifetimeProfit += _profit;
```

## 📂 Project Structure

```
flashyield-ai/
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── leaderboard/      # Main Yield Wars page
│   │   │   │   │   └── page.tsx      # Core logic & state
│   │   │   │   ├── api/
│   │   │   │   │   └── agents/       # Simulation API (optional)
│   │   │   ├── components/
│   │   │   │   ├── AgentCard.tsx     # Agent UI cards
│   │   │   │   ├── YieldChart.tsx    # Recharts integration
│   │   │   │   ├── AgentStats.tsx    # Metrics panel
│   │   │   │   └── SeasonControls.tsx
│   │   │   ├── config/
│   │   │   │   └── contracts.ts      # Contract addresses & ABIs
│   │   │   └── lib/
│   │   │       └── viem.ts           # Blockchain client
│   │   └── public/
│   │       └── monad-logo.png
│   └── backend/
│       ├── contracts/
│       │   └── BaseAgent.sol         # Agent smart contract
│       ├── script/
│       │   └── DeployAgents.s.sol    # Deployment script
│       └── foundry.toml
└── README.md
```

## 🚢 Deployment

### Smart Contracts (Foundry)
```bash
cd packages/backend

# Compile
forge build

# Deploy to Monad Devnet
forge script script/DeployAgents.s.sol:DeployAgents \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Update frontend/src/config/contracts.ts with new addresses
```

### Frontend (Vercel)
1.  Connect GitHub repo to Vercel.
2.  Add environment variables.
3.  Deploy!

**Live**: [https://flashyield-ai.vercel.app/leaderboard](https://flashyield-ai.vercel.app/leaderboard)

## 🎥 Demo

### Try It Live
1.  Visit [https://flashyield-ai.vercel.app/leaderboard](https://flashyield-ai.vercel.app/leaderboard)
2.  Connect your wallet (RainbowKit)
3.  Toggle **On-Chain** (⛓️) or **Off-Chain** (💨) mode
4.  Click **"Start Season"** button
5.  Watch the 3 agents compete in real-time
6.  Navigate between tabs:
    *   **Rankings**: Live leaderboard with agent cards
    *   **Chart**: Yield progression visualization
    *   **History**: Complete rebalancing log
    *   **Stats**: Detailed performance metrics
7.  Approve rebalances (On-Chain mode) or watch automatic execution (Off-Chain)
8.  Click **"Stop Season"** to pause and review results

### Expected Behavior
- Simulations run every 10 seconds
- Agent Alpha waits for 3%+ gaps (conservative)
- Agent Beta rebalances at 1.5%+ gaps (balanced)
- Agent Gamma acts on 0.5%+ gaps (aggressive)
- Yields diverge based on strategy effectiveness
- Confetti 🎉 celebrates the winner when season ends

## 🏆 Hackathon Submission

### 📦 Deliverables

- [x] **Source Code**: [GitHub Repository](https://github.com/Handilusa/flashyield-ai)
- [x] **Live Demo**: [https://flashyield-ai.vercel.app/leaderboard](https://flashyield-ai.vercel.app/leaderboard)
- [x] **Smart Contracts Deployed** on Monad Devnet:
    - **Agent Alpha**: `0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09` - [View](https://monadvision.com/address/0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09)
    - **Agent Beta**: `0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8` - [View](https://monadvision.com/address/0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8)
    - **Agent Gamma**: `0xb2902956785b53ff2717d7b1117df05b8bfc506c` - [View](https://monadvision.com/address/0xb2902956785b53ff2717d7b1117df05b8bfc506c)
- [ ] **Demo Video**: Watch Here (Coming Soon)
- [x] **Complete Documentation**: Setup, architecture, and usage instructions
- [x] **Open Source License**: MIT

### 🎯 Agent Track Requirements

**Autonomous AI Agents Competition:**

- [x] **Autonomous Decision Making**: 3 agents with distinct risk strategies
- [x] **On-Chain Data Integration**: Real-time APY monitoring from Monad contracts
- [x] **Continuous Operation**: Simulations execute every 10 seconds
- [x] **Strategy Differentiation**:
    - Agent Alpha (Conservative): 3% rebalance threshold
    - Agent Beta (Balanced): 1.5% rebalance threshold
    - Agent Gamma (Aggressive): 0.5% rebalance threshold
- [x] **Transparency**: Live activity feed showing all agent decisions
- [x] **Competition Visualization**: Real-time leaderboard with yield tracking
- [x] **Historical Data**: Complete rebalance history with export functionality
- [x] **On-Chain Recording**: All approved rebalances stored immutably on Monad

### 💡 Innovation Highlights

**Why This Project Stands Out:**

- 🎯 **Strategy Competition**: First agent arena showcasing competing DeFi strategies on Monad
- 🔄 **Real-Time Visualization**: Live charts showing strategy performance differences
- 🧠 **Transparent AI**: All agent decisions visible and explainable
- ⚡ **Monad-Native**: Leverages Monad's high throughput for rapid simulations
- 📊 **Educational**: Demonstrates risk/reward tradeoffs of different approaches
- 🔒 **Hybrid Mode**: Choose between on-chain recording or off-chain simulation

### 📝 Submission Info

- **Track**: Agent Track - Autonomous AI Agents
- **Submitted**: February 11, 2026
- **Team**: Handi (GitHub)
- **Repository**: [https://github.com/Handilusa/flashyield-ai](https://github.com/Handilusa/flashyield-ai)
- **Live Demo**: [https://flashyield-ai.vercel.app/leaderboard](https://flashyield-ai.vercel.app/leaderboard)
- **Contact**: @Cebohia18 (Twitter)

## 🛠️ Troubleshooting

### Rebalances not incrementing?
- Check console logs for "Will increment? ✅ YES"
- Verify delta >= threshold in TX args
- Ensure contracts are latest deployed version
- Check that you're in On-Chain mode with wallet connected

### Wallet not connecting?
- Add Monad Devnet manually:
    - **Network Name**: Monad Devnet
    - **RPC URL**: `https://testnet.monad.xyz/`
    - **Chain ID**: `10143`
    - **Currency**: MON
    - **Block Explorer**: [https://monadvision.com/](https://monadvision.com/)

### TX failing?
- Ensure sufficient MON for gas (get from faucet)
- Check contract addresses are correct in `contracts.ts`
- Verify wallet is connected to Monad Devnet (not mainnet)
- Try increasing gas limit if needed

### Stats not updating?
- Wait 6-10 seconds after TX confirmation
- Manually refresh page if needed
- Check browser console for errors
- Verify RPC endpoint is responsive

## 🤝 Contributing

Contributions are welcome! Please:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Resources

- **Monad Documentation** - Official Monad blockchain docs
- **Viem Docs** - TypeScript Web3 library used in this project
- **Wagmi Docs** - React Hooks for Ethereum
- **Recharts** - React charting library for yield visualization
- **Next.js 14** - React framework
- **RainbowKit** - Wallet connection UI
- **MonadVision Explorer** - Block explorer

### Useful Links
- [Live Demo](https://flashyield-ai.vercel.app/leaderboard) - Try Yield Wars now
- [GitHub Issues](https://github.com/Handilusa/flashyield-ai/issues) - Report bugs
- [Monad DevFund](https://monad.xyz) - Get funding for building

---

**⚔️ The Yield Wars await! May the best strategy win. ⚡**

*Built with ❤️ for Monad Hackathon by @Cebohia18*
