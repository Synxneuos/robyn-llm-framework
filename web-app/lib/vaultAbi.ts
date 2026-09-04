export const VAULT_ABI = [
  {
    "inputs": [{"internalType": "address","name": "_agentKeeper","type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false,"internalType": "uint256","name": "dividendAmount","type": "uint256"}
    ],
    "name": "DividendStreamDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "user","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
    ],
    "name": "DividendsClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false,"internalType": "uint256","name": "addedStockUsd","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "totalCollateralUsd","type": "uint256"}
    ],
    "name": "StockCollateralAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "user","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "unlockTime","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "duration","type": "uint256"}
    ],
    "name": "TokensLocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "address","name": "user","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
    ],
    "name": "TokensUnlocked",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "uint256","name": "addedUsd","type": "uint256"},
      {"internalType": "uint256","name": "addedNvdaShares","type": "uint256"}
    ],
    "name": "addStockCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "user","type": "address"}],
    "name": "calculatePendingDividends",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimDividends",
    "outputs": [{"internalType": "uint256","name": "payout","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositDividends",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "user","type": "address"}],
    "name": "getUserVaultOverview",
    "outputs": [
      {"internalType": "uint256","name": "lockedAmount","type": "uint256"},
      {"internalType": "uint256","name": "unlockTime","type": "uint256"},
      {"internalType": "uint256","name": "userShareBps","type": "uint256"},
      {"internalType": "uint256","name": "stockCollateralUsd","type": "uint256"},
      {"internalType": "uint256","name": "stockSharesNvda","type": "uint256"},
      {"internalType": "uint256","name": "pendingDividends","type": "uint256"},
      {"internalType": "uint256","name": "guaranteedFloorPriceUsd","type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "tokenAddress","type": "address"},
      {"internalType": "uint256","name": "tokenAmount","type": "uint256"},
      {"internalType": "uint256","name": "durationDays","type": "uint256"}
    ],
    "name": "lockTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDividendsStreamed",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStockSharesNvda",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTokensLocked",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTreasuryStockUsd",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"}],
    "name": "unlockTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "userClaimedDividends",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"}],
    "name": "userPositions",
    "outputs": [
      {"internalType": "uint256","name": "amount","type": "uint256"},
      {"internalType": "uint256","name": "unlockTime","type": "uint256"},
      {"internalType": "uint256","name": "lockDuration","type": "uint256"},
      {"internalType": "uint256","name": "rewardDebt","type": "uint256"},
      {"internalType": "uint256","name": "sharesMinted","type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const
