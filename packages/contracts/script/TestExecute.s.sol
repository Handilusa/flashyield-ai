// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/BaseAgent.sol";

contract TestExecute is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address alphaAddr = 0x4d3cba3b8dc6c9cd4ae38f6f08ccc10de76ce6e1;
        BaseAgent alpha = BaseAgent(alphaAddr);

        // console.log("Before rebalance:", alpha.totalRebalances());

        // Simulate Pool B (14%) > Pool A (6.5%) -> Delta ~115% > 3% threshold
        // Pool A = 650 bps, Pool B = 1400 bps, Profit = 1000000 (1 USDC)
        alpha.executeStrategy(650, 1400, 1000000);

        // console.log("After rebalance:", alpha.totalRebalances());

        vm.stopBroadcast();
    }
}
