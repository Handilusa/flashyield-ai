// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YieldOptimizer
 * @dev AI Agent Simulator.
 * Manages funds between two simulated yield pools.
 */
contract YieldOptimizer is Ownable {
    IERC20 public usdcToken;
    address public vault;

    // Simulated Pools
    uint256 public poolAPY_A = 500; // 5.00%
    uint256 public poolAPY_B = 800; // 8.00%
    
    // State
    enum Pool { A, B }
    Pool public currentPool;
    uint256 public totalAssets;

    event Rebalanced(Pool oldPool, Pool newPool, uint256 amount, uint256 timestamp);
    event FundsDeposited(uint256 amount);
    event FundsWithdrawn(uint256 amount);

    struct Trade {
        uint256 timestamp;
        Pool pool;
        uint256 amount;
        uint256 apy;
    }
    Trade[] public tradeHistory;

    modifier onlyVault() {
        require(msg.sender == vault, "Caller is not the Vault");
        _;
    }

    constructor(address _usdcToken, address _vault) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        vault = _vault;
        currentPool = Pool.A; // Start in Pool A
    }

    function deposit(uint256 amount) external onlyVault {
        require(amount > 0, "Amount > 0");
        usdcToken.transferFrom(msg.sender, address(this), amount);
        totalAssets += amount;
        emit FundsDeposited(amount);
    }

    function withdraw(uint256 amount) external onlyVault {
        require(amount > 0, "Amount > 0");
        require(totalAssets >= amount, "Insufficient assets");
        
        usdcToken.transfer(msg.sender, amount);
        totalAssets -= amount;
        emit FundsWithdrawn(amount);
    }

    /**
     * @dev Check which pool offers better APY.
     * In a real scenario, this would query external protocols.
     */
    function checkBestPool() public view returns (Pool) {
        return poolAPY_B > poolAPY_A ? Pool.B : Pool.A;
    }

    /**
     * @dev Execute rebalance to the best pool.
     * Can be called by owner (AI Agent).
     */
    function executeRebalance() external onlyOwner {
        Pool bestPool = checkBestPool();
        if (bestPool != currentPool) {
            Pool oldPool = currentPool;
            currentPool = bestPool;
            
            // Record trade
            tradeHistory.push(Trade({
                timestamp: block.timestamp,
                pool: bestPool,
                amount: totalAssets,
                apy: bestPool == Pool.A ? poolAPY_A : poolAPY_B
            }));

            emit Rebalanced(oldPool, bestPool, totalAssets, block.timestamp);
        }
    }

    function getTradeHistory() external view returns (Trade[] memory) {
        return tradeHistory;
    }

    function getTotalAssets() external view returns (uint256) {
        return totalAssets;
    }

    // Admin functions to simulate market changes
    function setAPYs(uint256 apyA, uint256 apyB) external onlyOwner {
        poolAPY_A = apyA;
        poolAPY_B = apyB;
    }
}
