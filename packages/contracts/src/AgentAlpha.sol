// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "./BaseAgent.sol";

/**
 * @title AgentAlpha
 * @dev Conservative strategy (3% threshold).
 */
contract AgentAlpha is BaseAgent {
    constructor() BaseAgent("Agent Alpha", 300) {}
}
