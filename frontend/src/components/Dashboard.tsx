'use client';

import React, { useState, useEffect } from 'react';
import { useFlowAuth } from '@/hooks/useFlowAuth';
import { 
  getDelegatorIDs, 
  getStakingInfo, 
  getCurrentEpoch, 
  getNetworkStats,
  hasStakingCollection 
} from '@/utils/flow-scripts';
import { setupStakingCollection } from '@/utils/flow-transactions';
import { 
  calculateDailyCredit, 
  formatFlowAmount, 
  timeUntilCreditRefresh 
} from '@/utils/calculations';
import { StakingInfo, EpochInfo, UserStakingData } from '@/types/staking';
import { FLOW_CONSTANTS } from '@/config/flow.config';

export default function Dashboard() {
  const { user, isLoggedIn, logIn, logOut, isLoading, getAccountBalance } = useFlowAuth();
  
  const [stakingData, setStakingData] = useState<UserStakingData | null>(null);
  const [epochInfo, setEpochInfo] = useState<EpochInfo | null>(null);
  const [networkStats, setNetworkStats] = useState({ totalStaked: 0, totalNodes: 0, averageAPR: 0 });
  const [balance, setBalance] = useState<number>(0);
  const [hasCollection, setHasCollection] = useState<boolean>(false);
  const [isSetupLoading, setIsSetupLoading] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState<number>(0);

  // Fetch user data when logged in
  useEffect(() => {
    if (isLoggedIn && user.addr) {
      fetchUserData();
      fetchNetworkData();
      
      // Set up refresh timer for credits
      const timer = setInterval(() => {
        if (stakingData) {
          const timeLeft = timeUntilCreditRefresh(stakingData.creditLastRefresh);
          setRefreshTimer(timeLeft);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoggedIn, user.addr]);

  const fetchUserData = async () => {
    if (!user.addr) return;

    try {
      // Get account balance
      const accountBalance = await getAccountBalance(user.addr);
      setBalance(accountBalance);

      // Check if user has staking collection
      const collectionExists = await hasStakingCollection(user.addr);
      setHasCollection(collectionExists);

      if (collectionExists) {
        // Get delegator info
        const delegatorIDs = await getDelegatorIDs(user.addr);
        const stakingPositions: StakingInfo[] = [];

        // Fetch staking info for each delegation
        for (const delegator of delegatorIDs) {
          const stakingInfo = await getStakingInfo(
            user.addr, 
            delegator.nodeID, 
            delegator.delegatorID
          );
          if (stakingInfo) {
            stakingPositions.push(stakingInfo);
          }
        }

        // Calculate totals
        const totalStaked = stakingPositions.reduce((sum, pos) => sum + pos.tokensStaked, 0);
        const lockedYields = stakingPositions.reduce((sum, pos) => sum + pos.tokensRewarded, 0);
        
        // Calculate daily credit (refresh every 24 hours)
        const lastRefresh = Date.now() - (Math.random() * 12 * 60 * 60 * 1000); // Random time in last 12 hours for demo
        const dailyCredit = calculateDailyCredit(totalStaked, lockedYields);

        setStakingData({
          totalStaked,
          lockedYields,
          unlockedYields: 0, // Simplified for now
          dailyCredit,
          creditLastRefresh: lastRefresh,
          challengesWon: 0,
          challengesLost: 0,
          accuracyRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          level: 1,
          experience: 0,
          badges: [],
          delegations: stakingPositions
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchNetworkData = async () => {
    try {
      const [epoch, stats] = await Promise.all([
        getCurrentEpoch(),
        getNetworkStats()
      ]);
      
      setEpochInfo(epoch);
      setNetworkStats(stats);
    } catch (error) {
      console.error('Error fetching network data:', error);
    }
  };

  const handleSetupCollection = async () => {
    setIsSetupLoading(true);
    try {
      const txId = await setupStakingCollection();
      console.log('Setup transaction sent:', txId);
      
      // Wait a bit then refresh user data
      setTimeout(() => {
        fetchUserData();
      }, 2000);
    } catch (error) {
      console.error('Error setting up staking collection:', error);
    } finally {
      setIsSetupLoading(false);
    }
  };

  const formatTimeLeft = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Ready to refresh!';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-2xl">T</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Flow Wallet</h2>
          <p className="text-gray-400 mb-8">
            Connect your wallet to start staking FLOW tokens and participate in knowledge challenges.
          </p>
          <button
            onClick={logIn}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black px-8 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <div className="mt-6 text-sm text-gray-500">
            Need testnet FLOW? Visit the{' '}
            <a 
              href={FLOW_CONSTANTS.FAUCET_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300"
            >
              Flow Testnet Faucet
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.addr?.slice(0, 8)}...{user.addr?.slice(-6)}</p>
        </div>
        <button
          onClick={logOut}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Account Balance</h3>
          <p className="text-3xl font-bold text-orange-400">{formatFlowAmount(balance)} FLOW</p>
          <p className="text-sm text-gray-500 mt-1">Available for staking</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Staked</h3>
          <p className="text-3xl font-bold text-green-400">
            {stakingData ? formatFlowAmount(stakingData.totalStaked) : '0'} FLOW
          </p>
          <p className="text-sm text-gray-500 mt-1">Earning {networkStats.averageAPR.toFixed(1)}% APR</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Daily Credits</h3>
          <p className="text-3xl font-bold text-blue-400">
            {stakingData ? stakingData.dailyCredit.toFixed(0) : '0'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Refresh in: {formatTimeLeft(refreshTimer)}
          </p>
        </div>
      </div>

      {/* Staking Collection Setup */}
      {!hasCollection && (
        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Setup Required</h3>
          <p className="text-gray-300 mb-4">
            Set up your Staking Collection to start delegating FLOW tokens and earning rewards.
          </p>
          <button
            onClick={handleSetupCollection}
            disabled={isSetupLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isSetupLoading ? 'Setting up...' : 'Setup Staking Collection'}
          </button>
        </div>
      )}

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Network Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Network Staked:</span>
              <span className="text-white font-medium">{formatFlowAmount(networkStats.totalStaked)} FLOW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Nodes:</span>
              <span className="text-white font-medium">{networkStats.totalNodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average APR:</span>
              <span className="text-green-400 font-medium">{networkStats.averageAPR.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Epoch</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Epoch Number:</span>
              <span className="text-white font-medium">#{epochInfo?.counter || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phase:</span>
              <span className="text-orange-400 font-medium">Staking Auction</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Left:</span>
              <span className="text-white font-medium">~6 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {hasCollection && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition-all">
              Stake FLOW
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              View Challenges
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Claim Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
}