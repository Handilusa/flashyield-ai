// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentRegistry.sol";
import "../src/AgentSimulator.sol";

contract AgentTest is Test {
    AgentRegistry public registry;
    AgentSimulator public simulator;
    
    function setUp() public {
        registry = new AgentRegistry();
        simulator = new AgentSimulator(
            address(registry),
            0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85 // YieldOptimizer
        );
        registry.transferOwnership(address(simulator));
    }
    
    function testRegisterAgent() public {
        simulator.registerInitialAgents();
        AgentRegistry.Agent[] memory agents = registry.getLeaderboard();
        assertEq(agents.length, 3);
        assertEq(agents[0].name, "Agent Alpha");
    }
}
