"use client";

import React, { useState } from 'react';

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [balance] = useState("$1,500");

  const handleConnectWallet = () => {
    setIsConnected(!isConnected);
  };

  return (
    <nav className="bg-transparent border-b border-gray-900">
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
          <div className="hidden md:flex items-center space-x-8">
            <button className="text-white hover:text-orange-400 text-sm font-medium transition-colors duration-200">
              Markets
            </button>
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Leaderboards
            </button>
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Portfolio
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-900 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">{balance}</span>
              </div>
            )}
            
            <button 
              onClick={handleConnectWallet}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isConnected 
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black"
              }`}
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}