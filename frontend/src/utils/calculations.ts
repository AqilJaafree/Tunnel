// src/utils/calculations.ts
import { FLOW_CONSTANTS } from '@/config/flow.config';

/**
 * Calculate daily credit points based on staking position
 * Formula: currentCredit = (principalShare + lockedYield) * dailyRate
 */
export const calculateDailyCredit = (
  principalShare: number, 
  lockedYield: number, 
  dailyRate: number = FLOW_CONSTANTS.DAILY_CREDIT_RATE
): number => {
  return (principalShare + lockedYield) * dailyRate;
};

/**
 * Calculate pro-rata yield distribution for user
 * Formula: userYield = (userStake / totalPoolStake) * totalRewards
 */
export const calculateProRataYield = (
  userStake: number,
  totalPoolStake: number,
  totalRewards: number
): number => {
  if (totalPoolStake === 0) return 0;
  return (userStake / totalPoolStake) * totalRewards;
};

/**
 * Calculate bonus reward with multiplier
 */
export const calculateBonusReward = (
  baseReward: number,
  multiplier: number = FLOW_CONSTANTS.BONUS_MULTIPLIER
): number => {
  return baseReward * multiplier;
};

/**
 * Calculate user level based on experience points
 * Each level requires exponentially more XP
 */
export const calculateLevel = (experience: number): number => {
  if (experience <= 0) return 1;
  return Math.floor(Math.log2(experience / 100) + 1);
};

/**
 * Calculate experience needed for next level
 */
export const calculateXPForNextLevel = (currentLevel: number): number => {
  return Math.pow(2, currentLevel) * 100;
};

/**
 * Check if vesting period is complete
 */
export const isVestingComplete = (
  stakeDate: number, 
  vestingDays: number = 30
): boolean => {
  const vestingPeriod = vestingDays * 24 * 60 * 60 * 1000; // Convert to milliseconds
  return Date.now() - stakeDate >= vestingPeriod;
};

/**
 * Calculate time until next daily credit refresh
 */
export const timeUntilCreditRefresh = (lastRefresh: number): number => {
  const nextRefresh = lastRefresh + (24 * 60 * 60 * 1000); // 24 hours in ms
  const timeLeft = nextRefresh - Date.now();
  return Math.max(0, timeLeft);
};

/**
 * Check if user can refresh daily credits
 */
export const canRefreshCredits = (lastRefresh: number): boolean => {
  return timeUntilCreditRefresh(lastRefresh) === 0;
};

/**
 * Calculate accuracy rate percentage
 */
export const calculateAccuracyRate = (
  challengesWon: number, 
  totalChallenges: number
): number => {
  if (totalChallenges === 0) return 0;
  return Math.round((challengesWon / totalChallenges) * 100);
};

/**
 * Calculate APR based on Flow staking rewards
 * Assumes 92% goes to delegators (8% node operator fee)
 */
export const calculateStakingAPR = (
  totalNetworkRewards: number,
  totalNetworkStaked: number
): number => {
  if (totalNetworkStaked === 0) return 0;
  const delegatorShare = 1 - FLOW_CONSTANTS.NODE_OPERATOR_FEE; // 92%
  const annualRewards = totalNetworkRewards * 365; // Assuming daily rewards
  return (annualRewards * delegatorShare / totalNetworkStaked) * 100;
};

/**
 * Convert FLOW tokens to smallest unit (1 FLOW = 100,000,000 units)
 */
export const flowToUnits = (flow: number): string => {
  return (flow * 100000000).toFixed(0);
};

/**
 * Convert smallest units back to FLOW tokens
 */
export const unitsToFlow = (units: string | number): number => {
  return Number(units) / 100000000;
};

/**
 * Format FLOW amount for display
 */
export const formatFlowAmount = (amount: number, decimals: number = 4): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

/**
 * Calculate compound interest for staking rewards
 */
export const calculateCompoundRewards = (
  principal: number,
  apr: number,
  compoundingPeriods: number,
  years: number = 1
): number => {
  const rate = apr / 100;
  return principal * Math.pow(1 + rate / compoundingPeriods, compoundingPeriods * years);
};

/**
 * Calculate estimated rewards over time period
 */
export const estimateRewards = (
  stakedAmount: number,
  aprPercent: number,
  days: number
): number => {
  const dailyRate = aprPercent / 100 / 365;
  return stakedAmount * dailyRate * days;
};

/**
 * Calculate challenge difficulty multiplier based on category
 */
export const getChallengeMultiplier = (category: string): number => {
  const multipliers: Record<string, number> = {
    'economics': 1.1,
    'technology': 1.05,
    'politics': 1.15,
    'sports': 1.0,
    'crypto': 1.2
  };
  return multipliers[category] || 1.0;
};