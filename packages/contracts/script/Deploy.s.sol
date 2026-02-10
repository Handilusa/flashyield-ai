// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/SimpleDEX.sol";
import "../src/YieldVault.sol";
import "../src/YieldOptimizer.sol";

contract DeployFlashYield is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));

        // 2. Deploy Simple DEX
        SimpleDEX dex = new SimpleDEX(address(usdc));
        console.log("SimpleDEX deployed at:", address(dex));

        // 3. Deploy Yield Vault
        YieldVault vault = new YieldVault(address(usdc));
        console.log("YieldVault deployed at:", address(vault));

        // 4. Deploy Yield Optimizer (AI Agent)
        YieldOptimizer optimizer = new YieldOptimizer(address(usdc), address(vault));
        console.log("YieldOptimizer deployed at:", address(optimizer));

        // 5. Connect Vault to Optimizer
        vault.setOptimizer(address(optimizer));
        console.log("Vault connected to Optimizer");

        // 6. Add Initial Liquidity to DEX (1 MON : 2 USDC)
        // Mint USDC to deployer for liquidity
        // 1 MON (1e18) : 2 USDC (2e6)
        // Changed from 1000 MON to 1 MON to avoid OutOfFunds error
        uint256 liqMON = 1 ether;
        uint256 liqUSDC = 2 * 10**6;

        usdc.approve(address(dex), liqUSDC);
        dex.addLiquidity{value: liqMON}(liqUSDC);
        console.log("Initial Liquidity Added to DEX");

        vm.stopBroadcast();
    }
}
