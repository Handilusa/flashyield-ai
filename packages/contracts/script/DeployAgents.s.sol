// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "../src/AgentRegistry.sol";
import "../src/AgentSimulator.sol";

/**
 * @title DeployAgents
 * @dev Deployment script for the multi-agent system.
 *      Targets Monad Mainnet (Chain ID 143).
 *
 *  Usage:
 *      forge script script/DeployAgents.s.sol:DeployAgents \
 *          --rpc-url https://rpc.monad.xyz \
 *          --broadcast \
 *          --private-key $PRIVATE_KEY
 */
contract DeployAgents is Script {

    // ── Existing mainnet addresses ──
    address constant YIELD_OPTIMIZER = 0x21bB72aD7EBa1cFDEc61c5103829a572F007bF85;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // ────────────────────────────────────────────
        // 1. Deploy AgentRegistry
        // ────────────────────────────────────────────
        AgentRegistry registry = new AgentRegistry();
        console.log("AgentRegistry deployed at:", address(registry));

        // ────────────────────────────────────────────
        // 2. Deploy AgentSimulator
        // ────────────────────────────────────────────
        AgentSimulator simulator = new AgentSimulator(
            address(registry),
            YIELD_OPTIMIZER
        );
        console.log("AgentSimulator deployed at:", address(simulator));

        // ────────────────────────────────────────────
        // 3. Register the 3 predefined agents
        //    (We do this BEFORE transferring ownership of the registry
        //     so that we [the deployer] can call registerAgentAt)
        // ────────────────────────────────────────────
        
        // Replicate the deterministic ID generation from AgentSimulator
        address alphaId = address(uint160(uint256(keccak256(abi.encodePacked("AgentAlpha")))));
        address betaId  = address(uint160(uint256(keccak256(abi.encodePacked("AgentBeta")))));
        address gammaId = address(uint160(uint256(keccak256(abi.encodePacked("AgentGamma")))));

        registry.registerAgentAt(alphaId, "Agent Alpha", "Conservative - rebalance only on large APY gaps");
        console.log("Registered Agent Alpha:", alphaId);

        registry.registerAgentAt(betaId, "Agent Beta", "Balanced - moderate threshold with steady swaps");
        console.log("Registered Agent Beta:", betaId);

        registry.registerAgentAt(gammaId, "Agent Gamma", "Aggressive - rebalance on any positive delta");
        console.log("Registered Agent Gamma:", gammaId);

        // ────────────────────────────────────────────
        // 4. Transfer AgentRegistry ownership to the
        //    simulator so it can call updateAgentStats
        // ────────────────────────────────────────────
        registry.transferOwnership(address(simulator));
        console.log("Registry ownership transferred to AgentSimulator");

        vm.stopBroadcast();
    }
}
