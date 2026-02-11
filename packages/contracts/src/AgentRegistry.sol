// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentRegistry
 * @dev On-chain registry for AI yield agents.
 *      Tracks agent metadata, performance stats, and provides a leaderboard.
 */
contract AgentRegistry is Ownable {

    struct Agent {
        string   name;
        string   strategy;
        address  owner;
        uint256  totalYield;
        uint256  rebalanceCount;
        uint256  createdAt;
        bool     active;
    }

    /// @notice All registered agent addresses (for iteration).
    address[] public agentAddresses;

    /// @notice Agent data keyed by address.
    mapping(address => Agent) public agents;

    /// @notice Whether an address has already registered.
    mapping(address => bool) public isRegistered;

    /* ════════════════════════ EVENTS ════════════════════════ */

    event AgentRegistered(address indexed agent, string name, string strategy);
    event AgentStatsUpdated(address indexed agent, uint256 yieldEarned, uint256 newTotalYield);
    event AgentDeactivated(address indexed agent);

    /* ════════════════════════ CONSTRUCTOR ════════════════════ */

    constructor() Ownable(msg.sender) {}

    /* ════════════════════════ WRITE ════════════════════════ */

    /**
     * @notice Register a new agent. Caller becomes the agent owner.
     * @param name     Human-readable agent name.
     * @param strategy Description of the agent's strategy.
     */
    function registerAgent(string calldata name, string calldata strategy) public {
        require(!isRegistered[msg.sender], "Already registered");
        require(bytes(name).length > 0, "Name required");

        agents[msg.sender] = Agent({
            name:           name,
            strategy:       strategy,
            owner:          msg.sender,
            totalYield:     0,
            rebalanceCount: 0,
            createdAt:      block.timestamp,
            active:         true
        });

        isRegistered[msg.sender] = true;
        agentAddresses.push(msg.sender);

        emit AgentRegistered(msg.sender, name, strategy);
    }

    /**
     * @notice Register an agent at a specific address (owner-only, used by simulator).
     */
    function registerAgentAt(
        address agentAddr,
        string calldata name,
        string calldata strategy
    ) public onlyOwner {
        require(!isRegistered[agentAddr], "Already registered");

        agents[agentAddr] = Agent({
            name:           name,
            strategy:       strategy,
            owner:          msg.sender,
            totalYield:     0,
            rebalanceCount: 0,
            createdAt:      block.timestamp,
            active:         true
        });

        isRegistered[agentAddr] = true;
        agentAddresses.push(agentAddr);

        emit AgentRegistered(agentAddr, name, strategy);
    }

    /**
     * @notice Update an agent's yield stats. Only callable by contract owner
     *         (i.e. the AgentSimulator or deployer).
     * @param agent       Address of the agent to update.
     * @param yieldEarned Amount of yield credited this round.
     */
    function updateAgentStats(address agent, uint256 yieldEarned) public onlyOwner {
        require(isRegistered[agent], "Agent not registered");

        agents[agent].totalYield     += yieldEarned;
        agents[agent].rebalanceCount += 1;

        emit AgentStatsUpdated(agent, yieldEarned, agents[agent].totalYield);
    }

    /**
     * @notice Deactivate an agent.
     */
    function deactivateAgent(address agent) external onlyOwner {
        require(isRegistered[agent], "Agent not registered");
        agents[agent].active = false;
        emit AgentDeactivated(agent);
    }

    /* ════════════════════════ READ ════════════════════════ */

    /**
     * @notice Return all registered agents (leaderboard data).
     */
    function getLeaderboard() public view returns (Agent[] memory) {
        uint256 len = agentAddresses.length;
        Agent[] memory board = new Agent[](len);
        for (uint256 i = 0; i < len; i++) {
            board[i] = agents[agentAddresses[i]];
        }
        return board;
    }

    /**
     * @notice Look up a single agent.
     */
    function getAgent(address agent) external view returns (Agent memory) {
        require(isRegistered[agent], "Agent not registered");
        return agents[agent];
    }

    /**
     * @notice Total number of registered agents.
     */
    function agentCount() external view returns (uint256) {
        return agentAddresses.length;
    }
}
