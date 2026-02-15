# FlashYield AI - Smart Contracts

## Overview
This directory contains the Solidity smart contracts for FlashYield AI, deployed on **Monad Mainnet**.

## Key Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| **YieldVault** | `0x8418185C4750957A6661eDe2d740272Ea22C140f` | Main user deposit vault |
| **YieldOptimizer** | `0x9Ee6e296FE4B3a8EFfE121B524bdf98007C24Fe3` | AI strategy manager |
| **SimpleDEX** | `0x8fe3e88dB65C105Cd598C1d69e9A246bDb9AdB61` | AMM for MON/USDC swaps |
| **MockUSDC** | `0xa59BC7BCdc5483D3A0B65274A0e949E33e790e67` | Test stablecoin |
| **Agent Alpha** | `0xf1e1a9b067749adf9c296b56cf5c91f449e8bf09` | Conservative Strategy (3% threshold) |
| **Agent Beta** | `0xe43d4b2a26c4f4c811e6527611c37d15c1fbe7c8` | Balanced Strategy (1.5% threshold) |
| **Agent Gamma** | `0xb2902956785b53ff2717d7b1117df05b8bfc506c` | Aggressive Strategy (0.5% threshold) |

## Tech Stack
- **Solidity**: ^0.8.28
- **Foundry**: Development framework
- **Monad Mainnet**: Chain ID 143

## Development

### Prerequisites
- [Foundry](https://book.getfoundry.sh/) installed

### Install Dependencies
```bash
forge install
```

### Compile
```bash
forge build
```

### Run Tests
```bash
forge test
```

### Deployment

To deploy all contracts to Monad Mainnet:

```bash
# Set up environment variables
export MONAD_RPC_URL="https://rpc.monad.xyz/"
export PRIVATE_KEY="your_private_key"

# Run deployment script
forge script script/DeployAgents.s.sol:DeployAgents \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## Architecture

### BaseAgent.sol
Abstract contract implementing the core rebalancing logic.
- **executeStrategy()**: Validates delta > threshold and records action on-chain.
- **getStats()**: Returns real-time metrics for the frontend leaderboard.

### YieldVault.sol
Non-custodial vault that holds user funds and interacts with the YieldOptimizer.

### YieldOptimizer.sol
Manager contract that routes funds to the active agent's strategy.
