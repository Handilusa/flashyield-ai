// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleDEX
 * @dev Basic AMM for swapping MON <-> USDC.
 * Implements x * y = k constant product formula.
 * Simple implementation for Monad Testnet demonstration.
 */
contract SimpleDEX is ReentrancyGuard, Ownable {
    IERC20 public usdcToken;

    uint256 public reserveMON;
    uint256 public reserveUSDC;

    uint256 public constant FEE_BASIS_POINTS = 30; // 0.3%

    event LiquidityAdded(uint256 monAmount, uint256 usdcAmount);
    event LiquidityRemoved(uint256 monAmount, uint256 usdcAmount);
    event Swapped(address indexed user, string direction, uint256 inputAmount, uint256 outputAmount);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    receive() external payable {}

     /**
     * @dev Add liquidity to the pool.
     * @param usdcAmount Amount of USDC to add.
     */
    function addLiquidity(uint256 usdcAmount) external payable nonReentrant onlyOwner {
        require(msg.value > 0, "Must send MON");
        require(usdcAmount > 0, "Must send USDC");

        // Transfer USDC from user to contract
        usdcToken.transferFrom(msg.sender, address(this), usdcAmount);

        reserveMON += msg.value;
        reserveUSDC += usdcAmount;

        emit LiquidityAdded(msg.value, usdcAmount);
    }

    /**
     * @dev Swap MON for USDC.
     */
    function swapMONForUSDC() external payable nonReentrant {
        require(msg.value > 0, "Must send MON");

        uint256 amountInWithFee = msg.value * (10000 - FEE_BASIS_POINTS);
        uint256 numerator = amountInWithFee * reserveUSDC;
        uint256 denominator = (reserveMON * 10000) + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        require(amountOut > 0, "Insufficient output amount");
        require(reserveUSDC >= amountOut, "Insufficient liquidity");

        reserveMON += msg.value;
        reserveUSDC -= amountOut;

        usdcToken.transfer(msg.sender, amountOut);

        emit Swapped(msg.sender, "MON -> USDC", msg.value, amountOut);
    }

    /**
     * @dev Swap USDC for MON.
     * @param amountIn Amount of USDC to swap.
     */
    function swapUSDCForMON(uint256 amountIn) external nonReentrant {
        require(amountIn > 0, "Must send USDC");

        // Transfer USDC from user to contract
        usdcToken.transferFrom(msg.sender, address(this), amountIn);

        uint256 amountInWithFee = amountIn * (10000 - FEE_BASIS_POINTS);
        uint256 numerator = amountInWithFee * reserveMON;
        uint256 denominator = (reserveUSDC * 10000) + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        require(amountOut > 0, "Insufficient output amount");
        require(reserveMON >= amountOut, "Insufficient liquidity");

        reserveUSDC += amountIn;
        reserveMON -= amountOut;

        (bool success, ) = msg.sender.call{value: amountOut}("");
        require(success, "MON transfer failed");

        emit Swapped(msg.sender, "USDC -> MON", amountIn, amountOut);
    }

    /**
     * @dev Get current price of 1 MON in USDC.
     */
    function getPrice(uint256 amountIn) external view returns (uint256) {
        if (reserveMON == 0 || reserveUSDC == 0) return 0;
        
        uint256 amountInWithFee = amountIn * (10000 - FEE_BASIS_POINTS);
        uint256 numerator = amountInWithFee * reserveUSDC;
        uint256 denominator = (reserveMON * 10000) + amountInWithFee;
        return numerator / denominator;
    }
}
