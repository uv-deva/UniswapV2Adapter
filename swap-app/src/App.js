import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { WalletProvider } from "./contexts/WalletConnect"

import Header from "./components/Header/Header";
import Swap from './Pages/Swap/Swap.jsx'
import AddLiquidity from './Pages/AddLiquidity/AddLiquidity.jsx';

import './App.css';

function App() {
  return (
    <WalletProvider>
      <ToastContainer />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/add-liquidity" element={<AddLiquidity />} />
          </Routes>
        </Router>
    </ WalletProvider>
  )
}

export default App;
