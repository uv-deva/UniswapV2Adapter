const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UniswapModule", (m) => {
  // Deploy TokenA
  const tokenA = m.contract("MockERC20", ["TokenA", "TKA", 18], { id: "TokenA" });

  // Deploy TokenB
  const tokenB = m.contract("MockERC20", ["TokenB", "TKB", 18], { id: "TokenB" });

  // Use m.getParameter to pass router and WETH externally if needed
  const router = process.env.ROUTER_ADDRESS;
  const weth = process.env.WETH_ADDRESS;

  // Deploy Adapter
  const adapter = m.contract("UniswapV2Adapter", [router, weth], { id: "Adapter" });

  return { tokenA, tokenB, adapter };
});
