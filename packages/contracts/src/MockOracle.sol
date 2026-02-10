// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockOracle {
    mapping(address => uint256) public prices;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function setPrice(address asset, uint256 price) external {
        prices[asset] = price;
    }

    function getPrice(address asset) external view returns (uint256) {
        return prices[asset];
    }
}
