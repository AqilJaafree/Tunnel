// src/utils/flow-transactions.ts
import * as fcl from "@onflow/fcl";
import { flowToUnits } from './calculations';

// Setup Staking Collection (one-time setup)
export const setupStakingCollection = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import FlowStakingCollection from 0xFlowStakingCollection

      transaction {
        prepare(signer: auth(BorrowValue, SaveValue, Capabilities) &Account) {
          // Check if Staking Collection already exists
          if signer.storage.borrow<&FlowStakingCollection.StakingCollection>(from: FlowStakingCollection.StakingCollectionStoragePath) == nil {
            // Create new Staking Collection
            let stakingCollection <- FlowStakingCollection.createStakingCollection()
            signer.storage.save(<-stakingCollection, to: FlowStakingCollection.StakingCollectionStoragePath)
            
            // Create public capability
            signer.capabilities.unpublish(FlowStakingCollection.StakingCollectionPublicPath)
            let cap = signer.capabilities.storage.issue<&FlowStakingCollection.StakingCollection>(FlowStakingCollection.StakingCollectionStoragePath)
            signer.capabilities.publish(cap, at: FlowStakingCollection.StakingCollectionPublicPath)
          }
        }
      }
    `,
    authorizations: [fcl.currentUser],
    payer: fcl.currentUser,
    proposer: fcl.currentUser
  });

  return transactionId;
};