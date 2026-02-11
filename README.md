# ⚡ FlashYield AI: Yield Wars

> **Autonomous AI agents competing in real-time to find the best DeFi yield strategies on Monad Mainnet**

<p align="center">
  <img src="https://raw.githubusercontent.com/monad-developers/brand-kit/main/monad-logomark.png" width="120" alt="Monad Logo">
</p>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=vercel)](https://flashyield-ai.vercel.app/leaderboard)
![Monad](https://img.shields.io/badge/Network-Monad_Mainnet-8338ec?style=for-the-badge&logo=monad)
![Next.js](https://img.shields.io/badge/Framework-Next.js_14-black?style=for-the-badge&logo=next.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Overview

**FlashYield AI** is a next-generation DeFi platform built on **Monad Mainnet**. Our flagship feature, **Yield Wars**, allows users to watch autonomous AI agents compete in real-time to maximize yield.

Unlike traditional yield optimizers, FlashYield employs three distinct AI personalities—**Alpha**, **Beta**, and **Gamma**—each with a unique risk appetite and rebalancing strategy. Users can observe these agents battling for the highest APY across multiple liquidity pools, visualizing the power of high-frequency DeFi strategies on Monad.

### Key Features
- **🤖 Autonomous Agents**: Three unique strategies running in parallel.
- **📊 Real-Time Leaderboard**: Live rankings, charts, and activity feeds.
- **⚡ Simulations**: Powered by off-chain logic triggering every 10 seconds.
- **🏎️ Monad Speed**: Built to showcase sub-second decision making.

---

## 🚀 Features

### 🤖 3 Autonomous Agents
Each agent has a distinct strategy for rebalancing funds:

- **🦁 Agent Alpha (Conservative)**:
  - **Strategy**: Waits for significant APY gaps (≥3.0%) before moving.
  - **Goal**: Minimize transaction costs, maximize big wins.
- **⚖️ Agent Beta (Balanced)**:
  - **Strategy**: Rebalances on moderate gaps (≥1.5%).
  - **Goal**: Consistent, steady growth.
- **🦅 Agent Gamma (Aggressive)**:
  - **Strategy**: Chases every small opportunity (≥0.5%).
  - **Goal**: Scrape every bit of yield, high frequency.

### 📊 Real-Time Competition
- **Live Yield Chart**: Visualizes the performance of all three agents over time (Gold vs Blue vs Purple).
- **Advanced Stats**: Tracks "Success Rate," "Best Move," and "Total Rebalances."
- **History Log**: A scrollable, exportable record of every decision made.

### 🎨 Interactive Dashboard
- **Glassmorphic UI**: sleek, modern interface with neon accents.
- **Tabs**: Switch between Rankings, Charts, History, and Stats.
- **Confetti**: Celebrate the season winner with visual flair.

### ⚔️ Season Controls
- **Start/Stop**: Users control the simulation "Season."
- **Reset**: Wipe the slate clean and start a new competition.

---

## 🏗️ Architecture

### Smart Contracts (Monad Mainnet)
| Contract | Address |
|----------|---------|
| **AgentRegistry** | `0x0c91A6706e316298f27febf2e993E152F0BA4B3a` |
| **AgentSimulator** | `0x555d8aBA03D816dD1E3d8670bE3F4FbCe61F69C8` |
| **YieldOptimizer** | `0x9EeFb71C4C90E0047c05485bb69748291F7fa433` |

### Tech Stack
| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Visuals** | Framer Motion, Recharts, Canvas Confetti |
| **Web3** | Viem, Wagmi, RainbowKit |
| **Contracts** | Solidity 0.8.20, Foundry |
| **AI/Sim** | Vercel AI SDK, Groq (Chatbot), Custom Simulation Engine |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/flashyield-ai.git
   cd flashyield-ai/packages/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   Create `.env.local` and add:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
   NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x0c91A6706e316298f27febf2e993E152F0BA4B3a
   NEXT_PUBLIC_AGENT_SIMULATOR_ADDRESS=0x555d8aBA03D816dD1E3d8670bE3F4FbCe61F69C8
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Yield Wars**
   Open [http://localhost:3000/leaderboard](http://localhost:3000/leaderboard)

---

## 🧠 How It Works

1. **Simulation Loop**: Every 10 seconds, the frontend triggers a simulation step via `/api/agents/simulate`.
2. **Market Data**: The system generates dynamic mock APYs for **Pool A**, **Pool B**, and **Pool C**.
3. **Decision Logic**:
   ```typescript
   // Simplified logic
   const delta = ((bestAPY - currentAPY) / currentAPY) * 10000; // in bps
   if (delta >= agent.threshold) {
       // REBALANCE -> Capture Yield
   } else {
       // HOLD -> Earn Base Yield
   }
   ```
4. **Yield Calculation**: Agents earn compound interest plus an "efficiency bonus" based on their strategy when they successfully rebalance.

---

## 📂 Project Structure

```
packages/frontend/
├── src/
│   ├── app/
│   │   ├── leaderboard/     # Yield Wars Page
│   │   │   └── page.tsx     # Main Logic & State
│   │   ├── api/
│   │   │   └── agents/      # Simulation Backend
│   ├── components/
│   │   ├── AgentCard.tsx    # Agent UI
│   │   ├── YieldChart.tsx   # Recharts Integration
│   │   ├── AgentStats.tsx   # Metrics Panel
│   │   ├── SeasonControls.tsx
│   │   └── ...
│   ├── config/
│   │   └── contracts.ts     # Addresses & ABIs
│   └── lib/
│       └── viem.ts          # Blockchain Client
```

---

## 🚢 Deployment

### Smart Contracts (Foundry)
```bash
forge script script/Deploy.s.sol --rpc-url https://rpc.monad.xyz --broadcast --verify
```

### Frontend (Vercel)
The project is optimized for Vercel deployment.
1. Connect GitHub repo to Vercel.
2. Add Environment Variables.
3. Deploy!

---

## 🎥 Demo

**[Watch the Demo Video](https://your-video-link.com)**

### Rankings
![Rankings Screenshot](https://placehold.co/600x400/1e1e2e/FFF?text=Live+Rankings)

### Yield Chart
![Chart Screenshot](https://placehold.co/600x400/1e1e2e/FFF?text=Yield+Chart)

---

## 🏆 Hackathon: Agent Track

**Yield Wars** was built specifically for the **Agent Track** to demonstrate:
- **Autonomous Decision Making**: Agents acting without user input.
- **Risk/Reward Modeling**: Distinct personalities (Conservative vs Aggressive).
- **Real-Time Visualization**: Making invisible backend logic visible and exciting.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

**License**: [MIT](LICENSE)

---

### Resources
- [Monad Documentation](https://docs.monad.xyz)
- [Viem Docs](https://viem.sh)
- [Recharts](https://recharts.org)
