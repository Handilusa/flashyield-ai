// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseAgent
 * @dev Common logic for autonomous yield agents.
 */
contract BaseAgent is Ownable {
    
    // ── Config ──
    string  public name;
    uint256 public rebalanceThreshold; // Basis points (e.g., 300 = 3%)

    // ── State ──
    uint8   public currentPool;        // 0 = Pool A, 1 = Pool B
    uint256 public totalRebalances;
    uint256 public lifetimeProfit;     // In USDC (scaled 1e6 or 1e18 depending on implementation, here we interpret input as is)
    
    // ── Events ──
    event AgentRebalanced(
        uint256 indexed timestamp,
        uint8   fromPool,
        uint8   toPool,
        uint256 profit
    );

    event StateUpdated(
        uint256 rebalances,
        uint8   pool,
        uint256 profit
    );

    constructor(string memory _name, uint256 _threshold) Ownable(msg.sender) {
        name = _name;
        rebalanceThreshold = _threshold;
        currentPool = 0; // Default start at Pool A
    }

    /**
     * @notice Evaluates market data and executes rebalance if threshold met.
     * @param poolAApy APY of Pool A (basis points, e.g. 500 = 5%)
     * @param poolBApy APY of Pool B (basis points)
     * @param simulatedProfit Profit earned since last check (for recording purposes)
     */
    function executeStrategy(uint256 poolAApy, uint256 poolBApy, uint256 simulatedProfit) external {
        // 1. Calculate Delta
        uint256 delta;
        uint8   bestPool;

        if (poolBApy > poolAApy) {
            delta = poolBApy - poolAApy; // e.g. 1200 - 500 = 700 bps
            bestPool = 1;
        } else {
            delta = poolAApy - poolBApy;
            bestPool = 0;
        }

        // 2. Check Decision
        bool shouldRebalance = false;
        
        // Only move if delta > threshold. Even if staying in same pool, we count as "rebalance" execution
        // as per user request to increment counter on profitable strategy execution
        if (delta >= rebalanceThreshold) {
            shouldRebalance = true;
        }

        // 3. Execute
        if (shouldRebalance) {
            uint8 oldPool = currentPool;
            currentPool = bestPool;
            totalRebalances++;
            
            // Record profit associated with this strategic move
            lifetimeProfit += simulatedProfit;

            emit AgentRebalanced(block.timestamp, oldPool, currentPool, simulatedProfit);
        } else {
            // Even if we hold, we might accrue profit. 
            // For this demo, we only record "actionable" profit on rebalance events 
            // or we could accumulate hold profit too. 
            // Let's accumulate it to show numbers go up.
            lifetimeProfit += simulatedProfit;
        }

        emit StateUpdated(totalRebalances, currentPool, lifetimeProfit);
    }

    // ── View Stats ──
    function getStats() external view returns (
        uint256 _totalRebalances,
        uint8   _currentPool,
        uint256 _lifetimeProfit,
        uint256 _threshold
    ) {
        return (totalRebalances, currentPool, lifetimeProfit, rebalanceThreshold);
    }
}
