// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockPool {
    string public name;
    
    constructor(string memory _name) {
        name = _name;
    }

    function swap(uint256 amountIn) external pure returns (uint256 amountOut) {
        return amountIn; // 1:1 swap for simplicity in mock
    }
}
