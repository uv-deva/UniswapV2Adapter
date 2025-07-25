import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed")

      const _provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await _provider.send("eth_requestAccounts", [])
      const _signer = await _provider.getSigner()

      setProvider(_provider)
      setSigner(_signer)
      setWalletAddress(accounts[0])
    } catch (err) {
      console.error("Connection Error:", err)
    }
  }

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await _provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const _signer = await _provider.getSigner();
          setProvider(_provider);
          setSigner(_signer);
          setWalletAddress(accounts[0]);
        }
      }
    };

    autoConnect();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        walletAddress,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)