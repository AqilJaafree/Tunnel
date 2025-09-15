import React from 'react';

export default function Navbar() {
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
              Markets
            </button>
            <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Leaderboards
            </button>
          </div>

          {/* Connect Wallet Button */}
          <div>
            <button className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}