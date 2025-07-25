## Demo
Check out the live demo here: [Uniswap V2 Adapter Demo](https://uniswap-v2-adapter.vercel.app/)

# Uniswap Adapter Hardhat Project

This project is a Hardhat-based testing environment for a UniswapV2 Adapter smart contract. It supports local development, testing, and deployment using the Uniswap V2 protocol.

## Requirements

- Node.js >= 14.x
- Yarn or npm
- Hardhat

---

## Installation

```bash
git clone <repo-url>
cd task
npm install
```

## Run Tests
```bash
npx hardhat test
```

## Environment Variables
Create a .env file in the root directory and define the following:

```env
SEPOLIA_RPC_URL="RPC_URL"
PRIVATE_KEY="update your private_key"
ROUTER_ADDRESS="Router Address"
WETH_ADDRESS="Weth address"
```
## Install Dependencies**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv @nomiclabs/hardhat-ethers
```

## Compile Contracts
```bash
npx hardhat compile
```
## Deploy Contracts
```bash
npx hardhat ignition deploy ./ignition/modules/UniswapModule.js --network sepolia
```
## Run Tests
```bash
npx hardhat test --network sepolia
```

# Swap App

A React-based token swapping interface integrated with Uniswap using `ethers.js`. This project includes basic token selection, real-time quote updates, and add liquidity functionalities.

## Tech Stack

- React 18
- Ethers.js v6
- React Router DOM
- React Toastify

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/swap-app.git
   cd swap-app
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of the project:

   ```env
   REACT_APP_UNISWAP_ADAPTER_ADDRESS=0xa43852Ca6247b39eB0AAE8c1Ab05fFF220CAadBC
   REACT_APP_WETH_ADDRESS=0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
   REACT_APP_TOKEN_A_ADDRESS=0x2C1b47D6e4EAA6CdB4B7C660bb5aFcbB34be2f75
   REACT_APP_TOKEN_B_ADDRESS=0x8276ffD5c6b30DE344DAcd4f840fd65A15f2B847
   REACT_APP_SLIPPAGE_TOLERANCE=100
   ```
4. **Run the App**
   ```bash
   npm start
   ```

5. **Supported Tokens**
   ```
   Uniswap Address: 0xa43852Ca6247b39eB0AAE8c1Ab05fFF220CAadBC
   TokenA: 0x2C1b47D6e4EAA6CdB4B7C660bb5aFcbB34be2f75
   TokenB: 0x8276ffD5c6b30DE344DAcd4f840fd65A15f2B847
   Weth: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
   Router Address: 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
   Weth address: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
   ```

