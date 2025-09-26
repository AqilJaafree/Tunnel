// src/utils/flow-scripts.ts
import * as fcl from "@onflow/fcl";
import { StakingInfo, EpochInfo, NodeOperator } from '@/types/staking';
import { unitsToFlow } from './calculations';

// Get user's staking collection delegator IDs
export const getDelegatorIDs = async (address: string): Promise<any[]> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowStakingCollection from 0xFlowStakingCollection

        access(all) fun main(address: Address): [FlowStakingCollection.DelegatorInfo] {
          return FlowStakingCollection.getAllDelegatorInfo(address: address)
        }
      `,
      args: (arg: any, t: any) => [arg(address, t.Address)]
    });
    
    return response || [];
  } catch (error) {
    console.error('Error fetching delegator IDs:', error);
    return [];
  }
};

// Get staking info for a specific delegation
export const getStakingInfo = async (address: string, nodeID: string, delegatorID?: number): Promise<StakingInfo | null> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowStakingCollection from 0xFlowStakingCollection

        access(all) fun main(address: Address, nodeID: String, delegatorID: UInt32?): [UFix64; 5] {
          let tokensCommitted = FlowStakingCollection.getCommittedTokens(address: address, nodeID: nodeID, delegatorID: delegatorID) ?? 0.0
          let tokensStaked = FlowStakingCollection.getStakedTokens(address: address, nodeID: nodeID, delegatorID: delegatorID) ?? 0.0
          let tokensUnstaking = FlowStakingCollection.getUnstakingTokens(address: address, nodeID: nodeID, delegatorID: delegatorID) ?? 0.0
          let tokensUnstaked = FlowStakingCollection.getUnstakedTokens(address: address, nodeID: nodeID, delegatorID: delegatorID) ?? 0.0
          let tokensRewarded = FlowStakingCollection.getRewardTokens(address: address, nodeID: nodeID, delegatorID: delegatorID) ?? 0.0
          
          return [tokensCommitted, tokensStaked, tokensUnstaking, tokensUnstaked, tokensRewarded]
        }
      `,
      args: (arg: any, t: any) => [
        arg(address, t.Address),
        arg(nodeID, t.String),
        arg(delegatorID, t.Optional(t.UInt32))
      ]
    });
    
    if (!response || response.length !== 5) return null;
    
    return {
      nodeID,
      delegatorID,
      tokensCommitted: unitsToFlow(response[0]),
      tokensStaked: unitsToFlow(response[1]),
      tokensUnstaking: unitsToFlow(response[2]),
      tokensUnstaked: unitsToFlow(response[3]),
      tokensRewarded: unitsToFlow(response[4])
    };
  } catch (error) {
    console.error('Error fetching staking info:', error);
    return null;
  }
};

// Get current epoch information
export const getCurrentEpoch = async (): Promise<EpochInfo | null> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowIDTableStaking from 0xFlowIDTableStaking

        access(all) fun main(): [AnyStruct] {
          let epochCounter = FlowIDTableStaking.getEpochCounter()
          let totalStaked = FlowIDTableStaking.getTotalStaked()
          let totalRewardsPaid = FlowIDTableStaking.getEpochTokenPayout()
          
          return [epochCounter, totalStaked, totalRewardsPaid]
        }
      `
    });
    
    if (!response || response.length !== 3) return null;
    
    return {
      counter: Number(response[0]),
      phase: "STAKING" as any, // Simplified for now
      startView: 0,
      endView: 0,
      totalStaked: unitsToFlow(response[1]),
      totalRewardsPaid: unitsToFlow(response[2]),
      stakingAuctionEndsAt: Date.now() + (12 * 60 * 60 * 1000) // 12 hours for testnet
    };
  } catch (error) {
    console.error('Error fetching epoch info:', error);
    return null;
  }
};

// Get available node operators for delegation
export const getAvailableNodes = async (): Promise<NodeOperator[]> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowIDTableStaking from 0xFlowIDTableStaking

        access(all) fun main(): [String] {
          return FlowIDTableStaking.getApprovedList() ?? []
        }
      `
    });
    
    // Convert node IDs to NodeOperator objects with basic info
    // In a real implementation, you'd fetch full node details
    return (response || []).map((nodeID: string) => ({
      id: nodeID,
      role: 4, // Assume consensus node
      networkingAddress: "",
      networkingKey: "",
      stakingKey: "",
      tokensStaked: 0,
      tokensCommitted: 0,
      tokensUnstaking: 0,
      tokensUnstaked: 0,
      tokensRewarded: 0,
      delegators: 0,
      delegatorRewards: 0,
      description: `Node ${nodeID}`,
      website: ""
    }));
  } catch (error) {
    console.error('Error fetching available nodes:', error);
    return [];
  }
};

// Check if user has staking collection set up
export const hasStakingCollection = async (address: string): Promise<boolean> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowStakingCollection from 0xFlowStakingCollection

        access(all) fun main(address: Address): Bool {
          let account = getAccount(address)
          let cap = account.capabilities.get<&FlowStakingCollection.StakingCollection>(FlowStakingCollection.StakingCollectionPublicPath)
          return cap.check()
        }
      `,
      args: (arg: any, t: any) => [arg(address, t.Address)]
    });
    
    return response === true;
  } catch (error) {
    console.error('Error checking staking collection:', error);
    return false;
  }
};

// Get network staking statistics
export const getNetworkStats = async (): Promise<{
  totalStaked: number;
  totalNodes: number;
  averageAPR: number;
}> => {
  try {
    const response = await fcl.query({
      cadence: `
        import FlowIDTableStaking from 0xFlowIDTableStaking

        access(all) fun main(): [UFix64; 3] {
          let totalStaked = FlowIDTableStaking.getTotalStaked()
          let approvedNodes = FlowIDTableStaking.getApprovedList()?.length ?? 0
          let totalRewards = FlowIDTableStaking.getEpochTokenPayout()
          
          return [totalStaked, UFix64(approvedNodes), totalRewards]
        }
      `
    });
    
    const totalStaked = unitsToFlow(response?.[0] || "0");
    const totalNodes = Number(response?.[1] || 0);
    const totalRewards = unitsToFlow(response?.[2] || "0");
    
    // Calculate approximate APR (assuming rewards are per epoch, testnet has ~30 epochs/year)
    const averageAPR = totalStaked > 0 ? (totalRewards * 30 / totalStaked) * 100 : 0;
    
    return {
      totalStaked,
      totalNodes,
      averageAPR
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return {
      totalStaked: 0,
      totalNodes: 0,
      averageAPR: 0
    };
  }
};