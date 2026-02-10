// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IYieldOptimizer {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function getTotalAssets() external view returns (uint256);
}

/**
 * @title YieldVault
 * @dev Main entry point for users to deposit USDC.
 * Funds are delegated to YieldOptimizer for yield generation.
 */
contract YieldVault is ReentrancyGuard, Ownable {
    IERC20 public usdcToken;
    IYieldOptimizer public optimizer;

    mapping(address => uint256) public balances;
    uint256 public totalDeposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event OptimizerUpdated(address newOptimizer);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    function setOptimizer(address _optimizer) external onlyOwner {
        optimizer = IYieldOptimizer(_optimizer);
        // Approve optimizer to spend Vault's USDC
        usdcToken.approve(_optimizer, type(uint256).max);
        emit OptimizerUpdated(_optimizer);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(address(optimizer) != address(0), "Optimizer not set");

        usdcToken.transferFrom(msg.sender, address(this), amount);
        
        // Delegate to optimizer
        optimizer.deposit(amount);

        balances[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Withdraw from optimizer
        optimizer.withdraw(amount);

        balances[msg.sender] -= amount;
        totalDeposits -= amount;

        usdcToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    function getCurrentAPY() external view returns (uint256) {
        // Mock APY from optimizer or static for now
        return 500; // 5.00%
    }
    
    // Emergency function to recover tokens
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
