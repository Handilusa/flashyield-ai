// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "./BaseAgent.sol";

/**
 * @title AgentGamma
 * @dev Aggressive strategy (0.5% threshold).
 */
contract AgentGamma is BaseAgent {
    constructor() BaseAgent("Agent Gamma", 50) {}
}
