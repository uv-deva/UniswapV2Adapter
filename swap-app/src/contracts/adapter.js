import { ethers } from "ethers"
import { ADAPTER_ABI, UNISWAP_ADAPTER_ADDRESS, WETH_ADDRESS } from "./constants"

export const getAdapterInstance = (signerOrProvider) => {
    console.log(UNISWAP_ADAPTER_ADDRESS)
  return new ethers.Contract(UNISWAP_ADAPTER_ADDRESS, ADAPTER_ABI, signerOrProvider);
};

export const fetchQuote = async (adapter, tokenA, tokenB, amountIn) => {
  const quote = await adapter.getQuote(tokenA, tokenB, amountIn);
  console.log("quote",quote)
  return quote;
};

export const performSwap = async (adapter, tokenA, tokenB, amountIn, minOut) => {
  const overrides = tokenA === WETH_ADDRESS
    ? { value: amountIn }
    : {};
  const tx = await adapter.swapExactInput(tokenA, tokenB, amountIn, minOut, overrides);
  await tx.wait();
};

export const addLiquidity = async (adapter, tokenA, tokenB, amountA, amountB) => {
    const tx = await adapter.addLiquidity(tokenA, tokenB, amountA, amountB);
    await tx.wait();
  };
  
