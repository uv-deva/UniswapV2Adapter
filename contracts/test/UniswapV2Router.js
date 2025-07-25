const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniswapV2Adapter", function () {
  this.timeout(100000);
  let adapter, router, WETH;
  let tokenA, tokenB;
  let user;
  const amountA = ethers.utils.parseUnits("10", 18);
  const amountB = ethers.utils.parseUnits("10", 18);

  const adapterAddress = "0x6Bcb85D4D4A9B5D530A1DE2150b7d2348d39F576";
  const tokenAAddress = "0xEe530e1a6973216CC5cEe84131B8eeC8eA428f08";
  const tokenBAddress = "0xEAB9C0b53f432eB9493381e04899f61ba10141f2";

  before(async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    user = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Uniswap V2 router and WETH
    router = process.env.ROUTER_ADDRESS;
    WETH = process.env.WETH_ADDRESS;

    // Deploy Mock Tokens
    const MockToken = await ethers.getContractFactory("MockERC20");
    // tokenA = await MockToken.deploy("TokenA", "TKA", 18);
    // tokenB = await MockToken.deploy("TokenB", "TKB", 18);
    tokenA = await MockToken.attach(tokenAAddress);
    tokenB = await MockToken.attach(tokenBAddress);

    // Mint tokens to user
    await tokenA.mint(user.address, amountA.mul(10));
    await tokenB.mint(user.address, amountB.mul(10));

    // Deploy Adapter
    const Adapter = await ethers.getContractFactory("UniswapV2Adapter");
    // adapter = await Adapter.deploy(router, WETH);
    adapter = await Adapter.attach(adapterAddress);
  });

  it("should add liquidity with slippage protection", async () => {
    await tokenA.connect(user).approve(adapter.address, amountA);
    await tokenB.connect(user).approve(adapter.address, amountB);

    await adapter.connect(user).addLiquidity(tokenA.address, tokenB.address, amountA, amountB)
  });

  it("should swap tokenA to tokenB", async () => {
    const quote = await adapter.getQuote(tokenA.address, tokenB.address, ethers.utils.parseUnits("1", 18));
    const minOut = quote.mul(99).div(100);

    await tokenA.connect(user).approve(adapter.address, ethers.utils.parseUnits("1", 18));

    await adapter.connect(user).swapExactInput(tokenA.address, tokenB.address, ethers.utils.parseUnits("1", 18), minOut);
  });

});
