// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MockOracle.sol";
import "./MockPool.sol";

contract FlashYieldAgent {
    address public owner;
    MockOracle public oracle;
    MockPool public poolA;
    MockPool public poolB;
    
    uint256 public totalAssets;
    bool public strategyActive;
    uint256 public lastTradeTimestamp;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event StrategyExecuted(string action, uint256 profit);
    event StrategyStatusUpdated(bool active);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _oracle, address _poolA, address _poolB) {
        owner = msg.sender;
        oracle = MockOracle(_oracle);
        poolA = MockPool(_poolA);
        poolB = MockPool(_poolB);
        strategyActive = true;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit must be > 0");
        totalAssets += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        totalAssets -= amount;
        payable(owner).transfer(amount);
        emit Withdraw(owner, amount);
    }

    function executeStrategy() external {
        require(strategyActive, "Strategy paused");
        
        // AI Agent logic simulation: 
        // 1. Get prices from Oracle
        // 2. Check arbitrage opportunity
        // 3. Execute trade
        
        uint256 priceA = oracle.getPrice(address(poolA));
        uint256 priceB = oracle.getPrice(address(poolB));
        
        // Simple logic: if priceB > priceA by 2%, buy A and sell B (simulated)
        if (priceB > priceA * 102 / 100) {
             // Simulate profit
             uint256 profit = (address(this).balance * 2) / 100; 
             // In real world, we would swap on Pool A then Pool B
             // poolA.swap(...)
             // poolB.swap(...)
             emit StrategyExecuted("Arbitrage A->B", profit);
        } else if (priceA > priceB * 102 / 100) {
            uint256 profit = (address(this).balance * 2) / 100;
             emit StrategyExecuted("Arbitrage B->A", profit);
        }
        
        lastTradeTimestamp = block.timestamp;
    }

    function setStrategyStatus(bool _active) external onlyOwner {
        strategyActive = _active;
        emit StrategyStatusUpdated(_active);
    }

    // Function for AI to update target pools
    function updatePools(address _poolA, address _poolB) external onlyOwner {
        poolA = MockPool(_poolA);
        poolB = MockPool(_poolB);
    }
}
