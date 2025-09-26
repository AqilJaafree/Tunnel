import * as fcl from "@onflow/fcl"

// Flow Testnet Configuration
export const flowConfig = {
  // Testnet Access Node
  accessNode: "https://rest-testnet.onflow.org",
  // Discovery Wallet for testnet
  discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
  // Network
  network: "testnet",
  // Contract Addresses on Testnet
  contracts: {
    FlowStakingCollection: "0x95e019a17d0e23d7",
    FlowIDTableStaking: "0x9eca2b38b18b5dfe", 
    FlowToken: "0x7e60df042a9c0868",
    LockedTokens: "0x95e019a17d0e23d7"
  }
}

// Initialize FCL
export const initFlow = () => {
  fcl.config({
    "accessNode.api": flowConfig.accessNode,
    "discovery.wallet": flowConfig.discoveryWallet,
    "0xFlowStakingCollection": flowConfig.contracts.FlowStakingCollection,
    "0xFlowIDTableStaking": flowConfig.contracts.FlowIDTableStaking,
    "0xFlowToken": flowConfig.contracts.FlowToken,
    "0xLockedTokens": flowConfig.contracts.LockedTokens
  })
}

// Flow Testnet Constants
export const FLOW_CONSTANTS = {
  // Testnet epoch duration (12 hours)
  EPOCH_DURATION: 12 * 60 * 60 * 1000, // milliseconds
  // Minimum delegation amount (50 FLOW)
  MIN_DELEGATION_AMOUNT: 50.0,
  // Node operator fee (8%)
  NODE_OPERATOR_FEE: 0.08,
  // Daily credit rate (10% of staked amount)
  DAILY_CREDIT_RATE: 0.1,
  // Bonus multiplier for correct answers
  BONUS_MULTIPLIER: 1.05, // 5% bonus
  // Testnet faucet URL
  FAUCET_URL: "https://testnet-faucet.onflow.org/"
}