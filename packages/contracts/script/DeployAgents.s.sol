// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "../src/AgentAlpha.sol";
import "../src/AgentBeta.sol";
import "../src/AgentGamma.sol";

contract DeployAgents is Script {

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Agents
        AgentAlpha alpha = new AgentAlpha();
        console.log("AgentAlpha deployed at:", address(alpha));

        AgentBeta beta = new AgentBeta();
        console.log("AgentBeta deployed at:", address(beta));

        AgentGamma gamma = new AgentGamma();
        console.log("AgentGamma deployed at:", address(gamma));

        vm.stopBroadcast();
    }
}
