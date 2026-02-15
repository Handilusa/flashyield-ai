# FlashYield AI - Smart Contracts

## Overview
FlashYield AI is a decentralized autonomous yield optimization platform featuring AI agents that compete to maximize DeFi returns on Monad blockchain. Users can observe three agents (Alpha, Beta, Gamma) with different risk profiles rebalancing between pools in real-time.

## Key Features
- 🤖 **3 AI Agents**: Alpha (Conservative 3% threshold), Beta (Balanced 1.5%), Gamma (Aggressive 0.5%)
- ⛓️ **On-Chain Recording**: All rebalances recorded on Monad Mainnet
- 💨 **Off-Chain Simulation**: Test strategies without gas fees
- 📊 **Real-Time Leaderboard**: Track performance, rebalances, and profits
- 🎮 **Interactive Seasons**: Start/stop simulation cycles with dynamic APYs

## Deployed Contracts (Monad Mainnet)

**Agent Alpha (Conservative)**
- Address: `0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09`
- Threshold: 3% (300 bps)
- Explorer: [View on Explorer](https://monadvision.com/address/0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09)

**Agent Beta (Balanced)**
- Address: `0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8`
- Threshold: 1.5% (150 bps)
- Explorer: [View on Explorer](https://monadvision.com/address/0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8)

**Agent Gamma (Aggressive)**
- Address: `0xb2902956785b53ff2717d7b1117df05b8bfc506c`
- Threshold: 0.5% (50 bps)
- Explorer: [View on Explorer](https://monadvision.com/address/0xb2902956785b53ff2717d7b1117df05b8bfc506c)

**Network Details**
- Chain: Monad Mainnet
- RPC: https://rpc.monad.xyz/
- Chain ID: 143
- Block Explorer: https://monadvision.com/

## Tech Stack

**Backend**
- Solidity 0.8.28
- Hardhat + Foundry
- Monad Mainnet

**Smart Contracts**
- BaseAgent.sol: Core rebalancing logic with on-chain stats
- Each agent independently tracks: totalRebalances, currentPool, lifetimeProfit, threshold

## Setup Instructions

### Prerequisites
- Foundry / Hardhat
- Monad Mainnet Wallet

### Installation

```bash
# Setup environment
cp .env.example .env
```
### Environment Variables (.env)
```
PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://rpc.monad.xyz/
```

### Deployment

```bash
# Compile
forge build

# Deploy to Monad Mainnet
forge script script/DeployAgents.s.sol:DeployAgents \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## Smart Contract Architecture

### BaseAgent.sol
```solidity
contract BaseAgent {
    uint256 public totalRebalances;
    uint8 public currentPool;
    uint256 public lifetimeProfit;
    uint256 public threshold;
    
    function executeStrategy(uint256 _apyA, uint256 _apyB, uint256 _profit) public {
        uint256 delta = _apyB > _apyA ? _apyB - _apyA : _apyA - _apyB;
        
        if (delta >= threshold) {
            totalRebalances++;
            currentPool = _apyB > _apyA ? 1 : 0;
            lifetimeProfit += _profit;
            emit AgentRebalanced(timestamp, from, to, profit);
        }
    }
    
    function getStats() public view returns (uint256, uint8, uint256, uint256) {
        return (totalRebalances, currentPool, lifetimeProfit, threshold);
    }
}
```

### Key Functions
- **executeStrategy()**: Records rebalance on-chain when delta >= threshold
- **getStats()**: Returns current agent statistics
- **Events**: AgentRebalanced for indexing

## Troubleshooting

**Rebalances not incrementing?**
- Check console logs for "Will increment? ✅ YES"
- Verify delta >= threshold in TX args
- Ensure contracts are latest version

**TX failing?**
- Ensure sufficient MON for gas
- Check contract addresses are correct
- Verify wallet connected to Monad Mainnet

## License
MIT

Built with ❤️ for Monad Hackathon
