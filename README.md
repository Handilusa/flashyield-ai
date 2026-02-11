# ⚡ FlashYield AI

> **Autonomous yield optimization on Monad**

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/103144211?s=200&v=4" width="120" alt="Monad Logo">
</p>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=vercel)](https://flashyield-ai.vercel.app)
![Monad](https://img.shields.io/badge/Network-Monad_Testnet-8338ec?style=for-the-badge&logo=monad)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon_Live-blue?style=for-the-badge)

## 🤖 AI Agent Features

FlashYield AI includes an intelligent conversational agent that allows users to interact with DeFi protocols using natural language.

- 💬 **Natural Language DeFi**: Execute deposits, withdrawals, and swaps using simple commands.
- 📊 **Real-time Queries**: Instantly check wallet balances, vault APY, and TVL.
- 🔄 **Transaction Management**: Review and confirm operations directly through the chat interface.
- ⚡ **Powered by Groq**: Utilizing **LLaMA 3.3 70B** for lightning-fast, accurate responses.

### Example Commands
- "Deposit 100 USDC"
- "What's my vault balance?"
- "Show current APY"
- "Swap 0.5 MON for USDC"

---

## Overview

**FlashYield AI** is a decentralized application built on the **Monad Testnet** that leverages autonomous AI agents to optimize yield strategies in real-time. By continuously monitoring multiple liquidity pools (Pool A & Pool B), the protocol automatically rebalances user funds to the highest-yielding opportunity, ensuring maximum returns with zero manual intervention.

Built for speed and efficiency, FlashYield takes advantage of Monad's 10,000 TPS and 1-second block times to execute complex strategies instantly.

---

## Features

- ✅ **Smart Vault**: Non-custodial vault for secure USDC deposits.
- ✅ **On-chain DEX**: Built-in AMM (`SimpleDEX`) for seamless MON/USDC swaps.
- ✅ **AI-Powered Optimizer**: Autonomous agent logic monitors and predicts APY shifts.
- ✅ **Auto-Rebalancing**: Smart contracts execute strategy shifts without user gas costs.
- ✅ **Real-Time Tracking**: Live dashboard showing TVL, APY, and trade history.

---

## Tech Stack

This project is built using a modern Web3 stack optimized for performance and developer experience:

- **AI Agent**: Groq LLaMA 3.3 70B, Vercel AI SDK
- **Smart Contracts**: Solidity (0.8.20), Foundry (Testing & Deployment)
- **Frontend**: Next.js 14, TypeScript
- **Web3 Integration**: Wagmi v2, Viem, RainbowKit
- **Styling**: Tailwind CSS, Framer Motion (Glassmorphism UI)
- **Network**: Monad Testnet (EVM Compatible)

---

## Deployed Contracts (Monad Testnet)

All contracts are verified on the Monad Explorer.

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| **MockUSDC** | `0x594725CEfb4629C0074cA373A2438dF2EC2ae8D3` | [View Contract](https://testnet.monad.xyz/address/0x594725CEfb4629C0074cA373A2438dF2EC2ae8D3) |
| **SimpleDEX** | `0x0Eb1b0A45941549e8228C6cEB26DeC7869373500` | [View Contract](https://testnet.monad.xyz/address/0x0Eb1b0A45941549e8228C6cEB26DeC7869373500) |
| **YieldVault** | `0xd7Cb692d9bE2fB8c77088bDB9473578274E1686d` | [View Contract](https://testnet.monad.xyz/address/0xd7Cb692d9bE2fB8c77088bDB9473578274E1686d) |
| **YieldOptimizer** | `0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85` | [View Contract](https://testnet.monad.xyz/address/0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85) |

> **Chain ID**: `10143`
> **RPC**: `https://testnet-rpc.monad.xyz`

---

## Installation & Setup

Follow these steps to run the frontend locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/flashyield-ai.git
   cd flashyield-ai
   ```

2. **Install Dependencies**
   Navigate to the frontend package:
   ```bash
   cd packages/frontend
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in `packages/frontend` and add your WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Chat or Click**: Users can interact via the **AI Chatbot** to execute commands ("Deposit 50 USDC") or use the standard UI.
2. **Deposit**: Funds are deposited into the `YieldVault` smart contract.
3. **AI Analysis**: The `YieldOptimizer` AI agent (powered by **Groq LLaMA 3.3 70B**) continuously monitors on-chain data and APY rates.
4. **Auto-Rebalance**: When a yield opportunity arises, the agent triggers `executeRebalance()` on-chain.
5. **Profit**: The protocol automatically moves funds to the highest-yielding pool.

---

## Hackathon

Built for the **Moltiverse Hackathon** by **Monad** & **Nad.Fun**.

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/103144211?s=200&v=4" width="100" alt="Monad Logo">
</p>

This project demonstrates the power of parallel execution for complex DeFi strategies.

---

License: MIT
