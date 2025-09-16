"use client";

import React, { useState, useEffect } from 'react';

interface Market {
  id: string;
  title: string;
  category: 'sports' | 'entertainment' | 'politics';
  image: string;
  yesOdds: number;
  noOdds: number;
  volume: string;
  endTime: string;
  endTimeMs: number;
  isHot: boolean;
  recentWinner?: string;
  recentWinAmount?: string;
  activeBettors: number;
  friendsActivity?: number;
}

const mockMarkets: Market[] = [
  {
    id: '1',
    title: 'Will Taylor Swift announce a new album in 2025?',
    category: 'entertainment',
    image: '/api/placeholder/400/200',
    yesOdds: 65,
    noOdds: 35,
    volume: '$12.5K',
    endTime: '2h 15m',
    endTimeMs: Date.now() + (2 * 60 + 15) * 60 * 1000,
    isHot: true,
    recentWinner: 'Sarah M.',
    recentWinAmount: '$340',
    activeBettors: 127,
    friendsActivity: 3
  },
  {
    id: '2',
    title: 'Will Lakers make it to NBA playoffs this season?',
    category: 'sports',
    image: '/api/placeholder/400/200',
    yesOdds: 72,
    noOdds: 28,
    volume: '$8.9K',
    endTime: '5h 32m',
    endTimeMs: Date.now() + (5 * 60 + 32) * 60 * 1000,
    isHot: false,
    activeBettors: 89,
    friendsActivity: 1
  },
  {
    id: '3',
    title: 'Will Biden run for re-election in 2028?',
    category: 'politics',
    image: '/api/placeholder/400/200',
    yesOdds: 45,
    noOdds: 55,
    volume: '$25.1K',
    endTime: '1d 4h',
    endTimeMs: Date.now() + (28 * 60) * 60 * 1000,
    isHot: true,
    recentWinner: 'Mike K.',
    recentWinAmount: '$750',
    activeBettors: 203,
    friendsActivity: 5
  },
  {
    id: '4',
    title: 'Will Netflix cancel Stranger Things after season 5?',
    category: 'entertainment',
    image: '/api/placeholder/400/200',
    yesOdds: 38,
    noOdds: 62,
    volume: '$6.7K',
    endTime: '12h 45m',
    endTimeMs: Date.now() + (12 * 60 + 45) * 60 * 1000,
    isHot: false,
    activeBettors: 56,
  },
  {
    id: '5',
    title: 'Will Manchester City win Premier League 2025?',
    category: 'sports',
    image: '/api/placeholder/400/200',
    yesOdds: 58,
    noOdds: 42,
    volume: '$18.3K',
    endTime: '3h 20m',
    endTimeMs: Date.now() + (3 * 60 + 20) * 60 * 1000,
    isHot: true,
    activeBettors: 145,
    friendsActivity: 2
  }
];

export default function MarketCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animatedOdds, setAnimatedOdds] = useState<{[key: string]: {yes: number, no: number}}>({});

  const filteredMarkets = selectedCategory === 'all' 
    ? mockMarkets 
    : mockMarkets.filter(market => market.category === selectedCategory);

  // Initialize animated odds
  useEffect(() => {
    const initialOdds: {[key: string]: {yes: number, no: number}} = {};
    mockMarkets.forEach(market => {
      initialOdds[market.id] = { yes: market.yesOdds, no: market.noOdds };
    });
    setAnimatedOdds(initialOdds);

    // Simulate real-time odds changes
    const interval = setInterval(() => {
      setAnimatedOdds(prev => {
        const newOdds = { ...prev };
        mockMarkets.forEach(market => {
          if (Math.random() > 0.7) { // 30% chance to update
            const change = Math.random() * 4 - 2; // -2 to +2 change
            const newYes = Math.max(10, Math.min(90, market.yesOdds + change));
            const newNo = 100 - newYes;
            newOdds[market.id] = { yes: Math.round(newYes), no: Math.round(newNo) };
          }
        });
        return newOdds;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getUrgencyColor = (endTimeMs: number) => {
    const timeLeft = endTimeMs - Date.now();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (hoursLeft <= 2) return 'text-red-400';
    if (hoursLeft <= 6) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const handleBet = (marketId: string, choice: 'yes' | 'no') => {
    console.log(`Betting ${choice} on market ${marketId}`);
    // Add satisfying click animation
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="flex items-center justify-center mb-8 px-4">
        <div className="inline-flex bg-gray-800 rounded-lg p-1 w-full max-w-md">
          {['all', 'sports', 'entertainment', 'politics'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 rounded-md ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All' : 
               category === 'sports' ? 'Sports' :
               category === 'entertainment' ? 'Entertainment' : 'Politics'}
            </button>
          ))}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map((market, index) => (
          <div
            key={market.id}
            className={`bg-gray-900 rounded-xl overflow-hidden border transition-all duration-300 ${
              market.isHot 
                ? 'border-orange-500/20' 
                : 'border-gray-800 hover:border-gray-700'
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            {/* Hot Indicator */}
            {market.isHot && (
              <div className="absolute top-3 left-3 z-10 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}

            {/* Market Image */}
            <div className="relative h-32 bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            {/* Market Content */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm mb-3 line-clamp-2">
                {market.title}
              </h3>

              {/* Live Activity */}
              <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                <span>👥 {market.activeBettors}</span>
              </div>

              {/* Betting Progress Bar */}
              <div className="mb-4">
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-500 ease-in-out"
                    style={{ width: `${animatedOdds[market.id]?.yes || market.yesOdds}%` }}
                  ></div>
                  <div 
                    className="h-full bg-rose-400 transition-all duration-500 ease-in-out"
                    style={{ width: `${animatedOdds[market.id]?.no || market.noOdds}%` }}
                  ></div>
                </div>
              </div>

              {/* Betting Options */}
              <div className="space-y-2 mb-4">
                {/* Yes Button */}
                <button
                  onClick={() => handleBet(market.id, 'yes')}
                  className="w-full bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-300 py-3 px-4 rounded-lg font-medium text-sm transition-colors duration-200"
                >
                  Yes ({animatedOdds[market.id]?.yes || market.yesOdds}%)
                </button>
                
                {/* No Button */}
                <button
                  onClick={() => handleBet(market.id, 'no')}
                  className="w-full bg-rose-900 hover:bg-rose-800 border border-rose-700 text-rose-300 py-3 px-4 rounded-lg font-medium text-sm transition-colors duration-200"
                >
                  No ({animatedOdds[market.id]?.no || market.noOdds}%)
                </button>
              </div>

              {/* Market Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Volume: {market.volume}</span>
                <span className={getUrgencyColor(market.endTimeMs)}>{market.endTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
          Load More Markets
        </button>
      </div>
    </div>
  );
}