// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

contract UniswapV2Adapter {
    using TransferHelper for address;

    IUniswapV2Router02 public immutable router;
    
    address public immutable WETH;

    uint256 public constant SLIPPAGE_TOLERANCE = 100;
    
    event LiquidityAdded(
        address indexed user,
        address indexed tokenA,
        address indexed tokenB,
        uint amountA,
        uint amountB,
        uint amountAMin,
        uint amountBMin,
        uint liquidity
    );

    event TokenSwapped(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint amountIn,
        uint amountOutMin
    );

    constructor(address _router, address _WETH) {
        require(_router != address(0), "Invalid router address");
        router = IUniswapV2Router02(_router);
        WETH = _WETH;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountA,
        uint amountB
    ) external {
        
        require(amountA > 0 && amountB > 0, "Invalid amounts");
        
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(address(router), amountA);
        IERC20(tokenB).approve(address(router), amountB);

        uint amountAMin = (amountA * (10_000 - SLIPPAGE_TOLERANCE)) / 10_000;
        uint amountBMin = (amountB * (10_000 - SLIPPAGE_TOLERANCE)) / 10_000;

        (uint actualAmountA, uint actualAmountB, uint liquidity) = router.addLiquidity(
            tokenA,
            tokenB,
            amountA,
            amountB,
            amountAMin,
            amountBMin,
            msg.sender,
            block.timestamp
        );

        emit LiquidityAdded(
            msg.sender,
            tokenA,
            tokenB,
            actualAmountA,
            actualAmountB,
            amountAMin,
            amountBMin,
            liquidity
        );
    }

    function swapExactInput(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint minOut
    ) external payable {
        
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        if (tokenIn == WETH) {
            require(msg.value == amountIn, "ETH sent must match amountIn");
            router.swapExactETHForTokens{value: msg.value}(
                minOut,
                path,
                msg.sender,
                block.timestamp
            );
        }
        else if (tokenOut == WETH) {
            router.swapExactTokensForETH(
                amountIn,
                minOut,
                path,
                msg.sender,
                block.timestamp
            );
        } else {
            router.swapExactTokensForTokens(
                amountIn,
                minOut,
                path,
                msg.sender,
                block.timestamp
            );
        }

        emit TokenSwapped(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            minOut
        );
    }

    function getQuote(address tokenIn, address tokenOut, uint amountIn) external view returns (uint amountOut) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        uint[] memory amounts = router.getAmountsOut(amountIn, path);
        amountOut = amounts[1];
    }

}
