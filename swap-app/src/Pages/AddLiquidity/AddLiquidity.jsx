import React, { useState, useEffect, useCallback } from "react";
import { parseUnits } from "ethers"
import { toast } from "react-toastify";

import { useWallet } from "../../contexts/WalletConnect"
import { Card } from "../../components/UI/Card/Card";

import { TOKEN_MAP, UNISWAP_ADAPTER_ADDRESS } from "../../contracts/constants";
import { fetchBalance, ensureApproval } from "../../contracts/erc20"
import { fetchQuote, addLiquidity, getAdapterInstance } from "../../contracts/adapter"


import './AddLiquidity.css';

const AddLiquidity = () => {

  const { walletAddress, provider, signer } = useWallet()

  const tokenOptions = Object.keys(TOKEN_MAP);

  const [tokenA, setTokenA] = useState(tokenOptions[0]);
  const [tokenB, setTokenB] = useState(tokenOptions[1] || tokenOptions[0]);

  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");

  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddLiquidity = async() => {
    if (!amountA || !amountB || Number(amountA) <= 0 || Number(amountB) <= 0) {
      alert("Please enter valid token amounts.");
      return;
    }
    if (tokenA === tokenB) {
      alert("Please select two different tokens.");
      return;
    }

    try {
      setIsAdding(true);

      const tokenAAddress = TOKEN_MAP[tokenA];
      const tokenBAddress = TOKEN_MAP[tokenB];

      const adapter = getAdapterInstance(signer);
      const amountOutA = parseUnits(amountA.toString(), 18);
      const amountOutB = parseUnits(amountB.toString(), 18);
      await ensureApproval(tokenAAddress, walletAddress, UNISWAP_ADAPTER_ADDRESS, amountOutA, signer);
      await ensureApproval(tokenBAddress, walletAddress, UNISWAP_ADAPTER_ADDRESS, amountOutB, signer);
      await addLiquidity(adapter, tokenAAddress, tokenBAddress, amountOutA, amountOutB)
      toast.info("Liquidity Added");
    } catch(error) {
      toast.info("Add Liquidity Failed");
      console.error("Swap failed:", error);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    updateBalance();
    const getQuote = async () => {
      if (!amountA || isNaN(amountA) || Number(amountA) <= 0) return;
  
      const tokenAAddress = TOKEN_MAP[tokenA];
      const tokenBAddress = TOKEN_MAP[tokenB];
  
      try {
        const adapter = getAdapterInstance(provider);
        const quotedB = await fetchQuote(adapter, tokenAAddress, tokenBAddress, parseUnits(amountA, 18), provider);
        setAmountB(quotedB ? quotedB.toString() / 1e18 : "");
      } catch (err) {
        console.error("Quote error:", err);
      }
    };
  
    getQuote();
  }, [amountA, tokenA, tokenB, provider, updateBalance]);
  
  return (
    <div className="add-liquidity-container">
      <Card className="add-liquidity-box">
        <h2>Add Liquidity</h2>

        <div className="input-group">
          <div className="flex justify-between items-center mb-2">
            <select
              value={tokenA}
              onChange={(e) => setTokenA(e.target.value)}
              style={{ color: "white", backgroundColor: "unset", border: "unset", width: '25%' }}
            >
              {Object.keys(TOKEN_MAP)
                .filter((tokenSymbol) => tokenSymbol !== tokenB)
                .map((tokenSymbol) => (
                  <option key={tokenSymbol} value={tokenSymbol}>
                    {tokenSymbol}
                  </option>
                ))
              }
            </select>
            <span className="text-sm text-gray-300" style={{marginLeft: '170px'}}>
              Balance: {balanceA.slice(0, 8)}
            </span>
          </div>
          <input
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            placeholder={`Enter ${tokenA} amount`}
            style={{ marginTop: '0.5rem', width: '92%' }}
          />
        </div>

        <div className="input-group">
          <div className="flex justify-between items-center mb-2 text-white">
            <select
              value={tokenB}
              onChange={(e) => setTokenB(e.target.value)}
              style={{ color: "white", backgroundColor: "unset", border: "unset", width: '25%' }}
            >
              {Object.keys(TOKEN_MAP)
                .filter((tokenSymbol) => tokenSymbol !== tokenA)
                .map((tokenSymbol) => (
                  <option key={tokenSymbol} value={tokenSymbol}>
                    {tokenSymbol}
                  </option>
                ))
              }
            </select>
            <span className="text-sm text-gray-300" style={{marginLeft: '170px'}}>
              Balance: {balanceB.slice(0, 8)}
            </span>
          </div>
          <input
            type="number"
            value={amountB ? String(amountB).slice(0, 8) : 0 }
            onChange={(e) => setAmountB(e.target.value)}
            placeholder={`Enter ${tokenB} amount`}
            style={{ marginTop: '0.5rem', width: '92%' }}
          />
        </div>

        <button className="submit-btn" onClick={handleAddLiquidity} disabled={isAdding}>
        {isAdding ? "Adding Liquidity..." : "Add Liquidity"}
        </button>
      </Card>
    </div>
  );
};

export default AddLiquidity;
