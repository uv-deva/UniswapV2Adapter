import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../contexts/WalletConnect";
import { Button } from "../../components/UI/Button/Button";
import { Wallet } from "lucide-react"

const Header = () => {
  const navigate = useNavigate();

  const { walletAddress, connectWallet } = useWallet();

  return (
    <header className="header" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'linear-gradient(to top right, #0f172a, #6b21a8, #0f172a)',
      color: 'white',
      gap: '1rem',
    }}>
      <div className="logo" style={{ fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        Swap
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          style={{ background: 'rgba(31, 41, 55, 0.5)', color: 'white' }}
          onClick={() => navigate("/add-liquidity")}
        >
          Add Liquidity
        </Button>
      </div>

      <Button className="wallet-btn" onClick={connectWallet} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#4c51bf',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer'
      }}>
        <Wallet size={16} />
        {walletAddress
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "Connect Wallet"
        }
      </Button>
    </header>
  );
};

export default Header;
