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
            0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85
        );
        registry.transferOwnership(address(simulator));
    }
    
    function testDeployment() public {
        assertTrue(address(registry) != address(0));
        assertTrue(address(simulator) != address(0));
    }
    
    function testGetAllAgents() public view {
        AgentSimulator.SimAgent[3] memory agents = simulator.getAllSimAgents();
        assertEq(agents[0].name, "Agent Alpha");
        assertEq(agents[1].name, "Agent Beta");
        assertEq(agents[2].name, "Agent Gamma");
    }
}
