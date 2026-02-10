// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Simple ERC20 token for testing purposes on Monad Testnet.
 * Allows anyone to mint tokens to facilitate testing.
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply of 1,000,000 USDC to deployer
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    /**
     * @dev Override decimals to 6, matching real USDC
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /**
     * @dev Public mint function for testing.
     * @param to Address to receive the tokens.
     * @param amount Amount to mint (in base units, e.g. 1000000 for 1 USDC).
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
