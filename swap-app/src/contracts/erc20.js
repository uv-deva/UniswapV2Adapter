import { Contract, formatUnits } from "ethers"
import { ERC20_ABI } from "./constants"

export const getERC20Instance = (address, signerOrProvider) => {
  return new Contract(address, ERC20_ABI, signerOrProvider);
};

export const fetchBalance = async (tokenAddress, userAddress, provider) => {
  const token = getERC20Instance(tokenAddress, provider);
  const decimals = await token.decimals();
  const balance = await token.balanceOf(userAddress);
  return formatUnits(balance, decimals);
};

export const ensureApproval = async (tokenAddress, userAddress, spender, amountIn, signer) => {
  const token = getERC20Instance(tokenAddress, signer);
  const allowance = await token.allowance(userAddress, spender);
  if (allowance< amountIn) {
    const tx = await token.approve(spender, amountIn);
    await tx.wait();
  }
};
