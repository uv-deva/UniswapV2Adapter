export const UNISWAP_ADAPTER_ADDRESS = process.env.REACT_APP_UNISWAP_ADAPTER_ADDRESS;
export const WETH_ADDRESS = process.env.REACT_APP_WETH_ADDRESS;
export const TOKEN_A_ADDRESS = process.env.REACT_APP_TOKEN_A_ADDRESS;
export const TOKEN_B_ADDRESS = process.env.REACT_APP_TOKEN_B_ADDRESS;
export const SLIPPAGE_TOLERANCE = parseInt(process.env.REACT_APP_SLIPPAGE_TOLERANCE || "100");

export const TOKEN_MAP = {
  WETH: WETH_ADDRESS,
  TKN_A: TOKEN_A_ADDRESS,
  TKN_B: TOKEN_B_ADDRESS
};

export const ADAPTER_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_WETH",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountA",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountB",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountAMin",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountBMin",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"name": "LiquidityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenIn",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenOut",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountOutMin",
				"type": "uint256"
			}
		],
		"name": "TokenSwapped",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "SLIPPAGE_TOLERANCE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WETH",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenA",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenB",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountB",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenIn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"name": "getQuote",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "router",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Router02",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenIn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minOut",
				"type": "uint256"
			}
		],
		"name": "swapExactInput",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint)",
  "function allowance(address owner, address spender) view returns (uint)",
  "function approve(address spender, uint value) returns (bool)",
  "function decimals() view returns (uint8)"
];
