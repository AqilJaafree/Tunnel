// src/components/ui/Navbar.tsx
'use client';

import React from 'react';
import { useFlowAuth } from '@/hooks/useFlowAuth';

export default function Navbar() {
  const { user, isLoggedIn, logIn, isLoading } = useFlowAuth();

  const handleConnectWallet = async () => {
    if (!isLoggedIn) {
      await logIn();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-black font-bold text-lg">T</span>
            </div>
            <span className="text-white text-xl font-semibold">Tunnel</span>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-8">
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Dashboard
            </button>
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Markets
            </button>
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Leaderboards
            </button>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-300">
                    {user.addr ? formatAddress(user.addr) : 'Connected'}
                  </span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}