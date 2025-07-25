import { useState, useEffect, useCallback } from "react"
import { Button } from "../../components/UI/Button/Button"
import { Card } from "../../components/UI/Card/Card"
import { Input } from "../../components/UI/Input/Input"
import { ArrowUpDown } from "lucide-react"
import { toast } from "react-toastify";

import { useWallet } from "../../contexts/WalletConnect"
import { TOKEN_MAP, UNISWAP_ADAPTER_ADDRESS, SLIPPAGE_TOLERANCE } from "../../contracts/constants"
import { fetchBalance, ensureApproval } from "../../contracts/erc20"
import { fetchQuote, getAdapterInstance, performSwap } from "../../contracts/adapter"
import { toBigInt, parseUnits, formatUnits } from "ethers"

import "./Swap.css"
export default function Swap() {

  const { walletAddress, provider, signer } = useWallet()

  const [tokenA, setTokenA] = useState("WETH");
  const [tokenB, setTokenB] = useState("TKN_B");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [isSwapping, setIsSwapping] = useState(false);
  const [amountOutMin, setAmountOutMin] = useState("0");

  const handleFlip = () => {
    setTokenA(prev => {
      setTokenB(prev);
      return tokenB;
  })

    setAmountA(prev => {
      setAmountB(prev);
      return amountB;
    });
  };

  const updateBalance = useCallback(async () => {
    if (!walletAddress || !TOKEN_MAP[tokenA]) return;
    try {
      const balA = await fetchBalance(TOKEN_MAP[tokenA], walletAddress, provider);
      const balB = await fetchBalance(TOKEN_MAP[tokenB], walletAddress, provider);
      setBalanceA(balA);
      setBalanceB(balB);
    } catch (error) {
      toast.info("Swap Failed");
      console.error("Swap failed:", error);
    }
  }, [walletAddress, tokenA, tokenB, provider]);

  const updateQuote = useCallback(async () => {
    if (!amountA || isNaN(amountA)) {
      setAmountB("0");
      setAmountOutMin("0");
      return;
    }
    try {
      const adapter = getAdapterInstance(provider);
      const amountIn = parseUnits(amountA, 18);
      const quote = await fetchQuote(adapter, TOKEN_MAP[tokenA], TOKEN_MAP[tokenB], amountIn);
      setAmountB(formatUnits(quote, 18));
      setAmountOutMin((quote * (10000n - toBigInt(SLIPPAGE_TOLERANCE))) / 10000n);
    } catch (error) {
      !walletAddress
        ? toast.info("Connect wallet")
        : toast.info("Insufficient Liquidity");
      console.error("Swap failed:", error);
    }
  }, [amountA, tokenA, tokenB, provider, walletAddress]);

  const handleSwap = async () => {
    try {
      setIsSwapping(true);
      const adapter = getAdapterInstance(signer);
      const amountIn = parseUnits(amountA, 18);
      const amountOut = toBigInt(parseUnits(amountB.toString(), 18));
      const minOut = (amountOut * 99n) / 100n;
      await ensureApproval(TOKEN_MAP[tokenA], walletAddress, UNISWAP_ADAPTER_ADDRESS, amountIn, signer);
      await performSwap(adapter, TOKEN_MAP[tokenA], TOKEN_MAP[tokenB], amountIn, minOut)
      updateBalance();
      toast.info("Swap completed");
    } catch (error) {
      toast.info("Swap Failed");
      console.error("Swap failed:", error);
    } finally {
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  return (
    <div className="swap">
      <main className="main">
        <div className="left">
          <h1 className="headline">
            Swap Smarter. 
         <span className="highlight"> Trade Faster.</span> APP is Here
          </h1>
          <p className="description">
            Navigating decentralized exchanges shouldn't feel like solving a puzzle. Our swap platform brings you fast, intuitive, and secure token trades — so you can focus on what matters.
          </p>
        </div>

        <div className="right">
          <Card>
            <h2 className="swap-header">SWAP</h2>
            <div className="token-box">
              <div>
                <div className="flex justify-between items-center mb-2">
                <select
                  value={tokenA}
                  onChange={(e) => setTokenA(e.target.value)}
                  style={{ color: "white", backgroundColor: "unset", border: "unset" }}
                >
                  {Object.keys(TOKEN_MAP)
                    .filter((tokenSymbol) => tokenSymbol !== tokenB)
                    .map((tokenSymbol) => (
                      <option key={tokenSymbol} value={tokenSymbol}>
                        {tokenSymbol}
                      </option>
                    ))}
                </select>
                  <span className="text-sm text-gray-300" style={{marginLeft: '170px'}}>
                    Balance: {balanceA.slice(0, 8)}
                  </span>
                </div>

                <Input
                  type="number"
                  value={amountA.slice(0, 8)}
                  onChange={(e) => setAmountA(e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="arrow-container">
              <Button className="arrow-btn" onClick={handleFlip}>
                <ArrowUpDown size={16} />
              </Button>
            </div>

            <div className="token-box">
              <div>
                <div className="flex justify-between items-center mb-2 text-white">
                <select
                  value={tokenB}
                  onChange={(e) => setTokenB(e.target.value)}
                  style={{ color: "white", backgroundColor: "unset", border: "unset" }}
                >
                  {Object.keys(TOKEN_MAP)
                    .filter((tokenSymbol) => tokenSymbol !== tokenA)
                    .map((tokenSymbol) => (
                      <option key={tokenSymbol} value={tokenSymbol}>
                        {tokenSymbol}
                      </option>
                    ))}
                </select>
                  <span className="text-sm text-gray-300" style={{marginLeft: '170px'}}>
                    Balance: {balanceB.slice(0, 8)}
                  </span>
                </div>
                <div className="token-output">{amountB.slice(0, 8) || "0.0"}</div>
              </div>
            </div>

            <div 
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {`Estimated amount: ${amountOutMin ? formatUnits(amountOutMin, 18).slice(0, 8) : 0} ${tokenB}`}
            </div>

            <Button className="swap-button" onClick={handleSwap} disabled={isSwapping} >
              {isSwapping 
                ? "Swapping..."
                : "Swap"}
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
