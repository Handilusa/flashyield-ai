// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/* ═══════════════════════════════════════════════════════════
   Minimal interfaces - read-only from existing contracts
   ═══════════════════════════════════════════════════════════ */

interface IYieldOptimizerReadOnly {
    function poolAPY_A()   external view returns (uint256);
    function poolAPY_B()   external view returns (uint256);
    function totalAssets()  external view returns (uint256);
    function currentPool()  external view returns (uint8);   // enum Pool { A, B }
}

interface IAgentRegistry {
    function updateAgentStats(address agent, uint256 yieldEarned) external;
}

/**
 * @title AgentSimulator
 * @dev Simulates three autonomous yield agents that read live on-chain data
 *      from the existing YieldOptimizer and record decisions against the
 *      AgentRegistry.
 *
 *      IMPORTANT:  This contract does NOT call executeRebalance() on
 *      the optimizer - it only reads APYs and simulates decisions locally.
 */
contract AgentSimulator is Ownable {

    /* ──── Structs ──── */

    struct SimAgent {
        address  id;                // deterministic address used as registry key
        string   name;
        string   strategy;
        uint256  rebalanceThreshold; // basis points - e.g. 100 = 1.00 %
        uint256  riskLevel;          // 1 = conservative, 2 = balanced, 3 = aggressive
        uint8    currentPool;        // 0 = A, 1 = B (mirrors optimizer enum)
        uint256  simulatedYield;     // cumulative simulated yield
        uint256  simulationCount;
    }

    /* ──── State ──── */

    SimAgent[3] public simAgents;

    IYieldOptimizerReadOnly public optimizer;
    IAgentRegistry          public registry;

    /* ──── Events ──── */

    event SimulationExecuted(
        uint256 indexed agentIndex,
        string  agentName,
        bool    rebalanced,
        uint8   chosenPool,
        uint256 yieldEarned
    );

    /* ──── Constructor ──── */

    constructor(address _registry, address _optimizer) Ownable(msg.sender) {
        registry  = IAgentRegistry(_registry);
        optimizer = IYieldOptimizerReadOnly(_optimizer);

        // Pre-define 3 agents with deterministic "addresses" derived from index
        // (these aren't real EOAs; they just serve as unique registry keys)

        simAgents[0] = SimAgent({
            id:                   address(uint160(uint256(keccak256(abi.encodePacked("AgentAlpha"))))),
            name:                 "Agent Alpha",
            strategy:             "Conservative - rebalance only on large APY gaps",
            rebalanceThreshold:   300,   // 3.00 %
            riskLevel:            1,
            currentPool:          0,
            simulatedYield:       0,
            simulationCount:      0
        });

        simAgents[1] = SimAgent({
            id:                   address(uint160(uint256(keccak256(abi.encodePacked("AgentBeta"))))),
            name:                 "Agent Beta",
            strategy:             "Balanced - moderate threshold with steady swaps",
            rebalanceThreshold:   150,   // 1.50 %
            riskLevel:            2,
            currentPool:          0,
            simulatedYield:       0,
            simulationCount:      0
        });

        simAgents[2] = SimAgent({
            id:                   address(uint160(uint256(keccak256(abi.encodePacked("AgentGamma"))))),
            name:                 "Agent Gamma",
            strategy:             "Aggressive - rebalance on any positive delta",
            rebalanceThreshold:   50,    // 0.50 %
            riskLevel:            3,
            currentPool:          0,
            simulatedYield:       0,
            simulationCount:      0
        });
    }

    /* ════════════════════════════════════════════════════════
       CORE: simulateAgentAction
       Reads live APYs from YieldOptimizer and decides whether
       the given agent would rebalance.  Records results in
       the AgentRegistry.
       ════════════════════════════════════════════════════════ */

    /**
     * @notice Public function to record an off-chain simulation decision.
     *         Allows the frontend to "prove" the agent's decision on-chain.
     *         In a real production system, this would be restricted or signed.
     */
    function recordSimulationDecision(
        uint256 agentIndex,
        bool    rebalanced,
        uint8   chosenPool,
        uint256 yieldEarned
    ) external {
        require(agentIndex < 3, "Invalid agent index");

        SimAgent storage agent = simAgents[agentIndex];

        // Update state (trusting the input for this demo/simulation)
        if (rebalanced) {
            agent.currentPool = chosenPool;
        }
        agent.simulatedYield  += yieldEarned;
        agent.simulationCount += 1;

        // Persist to registry
        // Note: The registry must allow this contract to call updateAgentStats
        registry.updateAgentStats(agent.id, yieldEarned);

        emit SimulationExecuted(agentIndex, agent.name, rebalanced, chosenPool, yieldEarned);
    }

    function simulateAgentAction(uint256 agentIndex) external onlyOwner {
        require(agentIndex < 3, "Invalid agent index");

        SimAgent storage agent = simAgents[agentIndex];

        // 1. Read live APY data from existing optimizer
        uint256 apyA = optimizer.poolAPY_A();
        uint256 apyB = optimizer.poolAPY_B();
        uint256 totalAssets = optimizer.totalAssets();

        // 2. Determine best pool and APY delta
        uint8   bestPool;
        uint256 bestAPY;
        uint256 currentAPY;

        if (apyB > apyA) {
            bestPool   = 1;  // Pool B
            bestAPY    = apyB;
            currentAPY = agent.currentPool == 0 ? apyA : apyB;
        } else {
            bestPool   = 0;  // Pool A
            bestAPY    = apyA;
            currentAPY = agent.currentPool == 0 ? apyA : apyB;
        }

        uint256 delta = bestAPY > currentAPY ? bestAPY - currentAPY : 0;

        // 3. Decision: rebalance if delta exceeds agent's threshold
        bool shouldRebalance = (delta >= agent.rebalanceThreshold) &&
                               (bestPool != agent.currentPool);

        // 4. Calculate simulated yield (simplistic model)
        //    yield = totalAssets * effectiveAPY / 10000  (annualised, per-action proxy)
        uint256 effectiveAPY = shouldRebalance ? bestAPY : currentAPY;
        uint256 yieldEarned  = totalAssets > 0
            ? (totalAssets * effectiveAPY) / 10000
            : effectiveAPY;  // fallback: just record the APY bps

        // 5. Update agent state
        if (shouldRebalance) {
            agent.currentPool = bestPool;
        }
        agent.simulatedYield  += yieldEarned;
        agent.simulationCount += 1;

        // 6. Persist to registry
        registry.updateAgentStats(agent.id, yieldEarned);

        emit SimulationExecuted(agentIndex, agent.name, shouldRebalance, bestPool, yieldEarned);
    }

    /**
     * @notice Simulate all three agents in a single call.
     */
    function simulateAll() external onlyOwner {
        // Inline the logic to avoid external self-calls
        for (uint256 i = 0; i < 3; i++) {
            _simulateAgent(i);
        }
    }

    /* ──── Internal helper (mirrors simulateAgentAction logic) ──── */

    function _simulateAgent(uint256 agentIndex) internal {
        SimAgent storage agent = simAgents[agentIndex];

        uint256 apyA = optimizer.poolAPY_A();
        uint256 apyB = optimizer.poolAPY_B();
        uint256 totalAssets = optimizer.totalAssets();

        uint8   bestPool;
        uint256 bestAPY;
        uint256 currentAPY;

        if (apyB > apyA) {
            bestPool   = 1;
            bestAPY    = apyB;
            currentAPY = agent.currentPool == 0 ? apyA : apyB;
        } else {
            bestPool   = 0;
            bestAPY    = apyA;
            currentAPY = agent.currentPool == 0 ? apyA : apyB;
        }

        uint256 delta = bestAPY > currentAPY ? bestAPY - currentAPY : 0;
        bool shouldRebalance = (delta >= agent.rebalanceThreshold) &&
                               (bestPool != agent.currentPool);

        uint256 effectiveAPY = shouldRebalance ? bestAPY : currentAPY;
        uint256 yieldEarned  = totalAssets > 0
            ? (totalAssets * effectiveAPY) / 10000
            : effectiveAPY;

        if (shouldRebalance) {
            agent.currentPool = bestPool;
        }
        agent.simulatedYield  += yieldEarned;
        agent.simulationCount += 1;

        registry.updateAgentStats(agent.id, yieldEarned);

        emit SimulationExecuted(agentIndex, agent.name, shouldRebalance, bestPool, yieldEarned);
    }

    /* ════════════════ VIEW HELPERS ════════════════ */

    function getSimAgent(uint256 index) external view returns (SimAgent memory) {
        require(index < 3, "Invalid agent index");
        return simAgents[index];
    }

    function getAllSimAgents() external view returns (SimAgent[3] memory) {
        return simAgents;
    }
}
