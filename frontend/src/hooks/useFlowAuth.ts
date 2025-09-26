// src/hooks/useFlowAuth.ts
import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import { FlowUser } from '@/types/staking';

export const useFlowAuth = () => {
  const [user, setUser] = useState<FlowUser>({
    addr: null,
    cid: null,
    loggedIn: false,
    services: []
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to FCL user changes with proper typing
    const unsubscribe = fcl.currentUser.subscribe((currentUser: any) => {
      setUser({
        addr: currentUser.addr || null,
        cid: currentUser.cid || null,
        loggedIn: currentUser.loggedIn || false,
        services: currentUser.services || []
      });
    });
    setIsInitialized(true);
    
    return () => {
      unsubscribe();
    };
  }, []);

  const logIn = async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountBalance = async (address: string): Promise<number> => {
    try {
      const response = await fcl.query({
        cadence: `
          import FlowToken from 0xFlowToken

          access(all) fun main(address: Address): UFix64 {
            let account = getAccount(address)
            let vaultRef = account.capabilities
                              .get(/public/flowTokenBalance)
                              .borrow<&{FungibleToken.Balance}>()
                              ?? panic("Could not borrow Balance reference to the Vault")
            
            return vaultRef.balance
          }
        `,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      
      return Number(response);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  return {
    user,
    isInitialized,
    isLoading,
    logIn,
    logOut,
    getAccountBalance,
    isLoggedIn: user.loggedIn,
    address: user.addr
  };
};