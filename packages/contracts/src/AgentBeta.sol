// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "./BaseAgent.sol";

/**
 * @title AgentBeta
 * @dev Balanced strategy (1.5% threshold).
 */
contract AgentBeta is BaseAgent {
    constructor() BaseAgent("Agent Beta", 150) {}
}
