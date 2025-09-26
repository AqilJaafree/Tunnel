// src/types/staking.ts

export interface FlowUser {
  addr: string | null | undefined;
  cid: string | null | undefined;
  loggedIn: boolean;
  services: any[];
}

export interface StakingInfo {
  nodeID: string;
  delegatorID?: number;
  tokensCommitted: number;
  tokensStaked: number;
  tokensUnstaking: number;
  tokensUnstaked: number;
  tokensRewarded: number;
}

export interface EpochInfo {
  counter: number;
  phase: EpochPhase;
  startView: number;
  endView: number;
  totalStaked: number;
  totalRewardsPaid: number;
  stakingAuctionEndsAt: number;
}

export enum EpochPhase {
  STAKING = "EPOCHSETUP",
  SETUP = "EPOCHSETUP", 
  COMMIT = "EPOCHCOMMIT"
}

export interface NodeOperator {
  id: string;
  role: number;
  networkingAddress: string;
  networkingKey: string;
  stakingKey: string;
  tokensStaked: number;
  tokensCommitted: number;
  tokensUnstaking: number;
  tokensUnstaked: number;
  tokensRewarded: number;
  delegators: number;
  delegatorRewards: number;
  description?: string;
  website?: string;
}

export interface UserStakingData {
  // Core staking amounts
  totalStaked: number;
  lockedYields: number;
  unlockedYields: number;
  
  // Credit system
  dailyCredit: number;
  creditLastRefresh: number;
  
  // Challenge history
  challengesWon: number;
  challengesLost: number;
  accuracyRate: number;
  currentStreak: number;
  longestStreak: number;
  
  // Gamification
  level: number;
  experience: number;
  badges: Badge[];
  
  // Staking positions
  delegations: StakingInfo[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  question: string;
  description: string;
  sources: string[];
  options: {
    yes: string;
    no: string;
  };
  creditCost: number;
  bonusMultiplier: number;
  resolutionDate: number;
  status: ChallengeStatus;
  correctAnswer?: boolean;
  category: ChallengeCategory;
}

export enum ChallengeStatus {
  ACTIVE = "active",
  RESOLVED = "resolved",
  PENDING = "pending"
}

export enum ChallengeCategory {
  ECONOMICS = "economics",
  TECHNOLOGY = "technology", 
  POLITICS = "politics",
  SPORTS = "sports",
  CRYPTO = "crypto"
}

export interface ChallengeEntry {
  challengeId: string;
  userAnswer: boolean;
  creditSpent: number;
  submittedAt: number;
  resolved: boolean;
  won?: boolean;
  rewardUnlocked?: number;
}

export interface LeaderboardEntry {
  address: string;
  username?: string;
  totalStaked: number;
  challengesWon: number;
  accuracyRate: number;
  level: number;
  rank: number;
}

// Transaction types
export interface TransactionStatus {
  status: number;
  statusCode: number;
  statusString: string;
  errorMessage?: string;
  events?: any[];
}

// Calculation utilities interface
export interface StakingCalculations {
  calculateDailyCredit: (principalShare: number, lockedYield: number) => number;
  calculateProRataYield: (userStake: number, totalStake: number, totalRewards: number) => number;
  calculateBonusReward: (baseReward: number, multiplier: number) => number;
  calculateLevel: (experience: number) => number;
  isVestingComplete: (stakeDate: number, vestingDays: number) => boolean;
}