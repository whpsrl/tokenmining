'use client';

import Link from 'next/link';
import { Lock, TrendingUp, Calendar, Award } from 'lucide-react';

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Token Staking</span>
          </h1>
          <p className="text-white/70">Lock your tokens for bonus rewards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-dark p-8 border-2 border-primary-400/20">
            <Calendar className="w-12 h-12 text-primary-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">3 Months</h3>
            <div className="text-4xl font-bold gradient-text mb-4">+25%</div>
            <p className="text-white/60 mb-6">Bonus on mining distributions</p>
            <button className="btn-primary w-full py-3 rounded-lg">
              Stake Now
            </button>
          </div>

          <div className="card-dark p-8 border-2 border-accent-400/50">
            <Calendar className="w-12 h-12 text-accent-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">6 Months</h3>
            <div className="text-4xl font-bold gradient-text mb-4">+50%</div>
            <p className="text-white/60 mb-6">Bonus on mining distributions</p>
            <button className="btn-primary w-full py-3 rounded-lg">
              Stake Now
            </button>
          </div>

          <div className="card-dark p-8 border-2 border-yellow-400/50">
            <Calendar className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">12 Months</h3>
            <div className="text-4xl font-bold gradient-text mb-4">+100%</div>
            <p className="text-white/60 mb-6">Bonus on mining distributions</p>
            <button className="btn-primary w-full py-3 rounded-lg">
              Stake Now
            </button>
          </div>
        </div>

        <div className="card-dark p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-primary-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-2">Lock Your Tokens</h3>
                <p className="text-white/60">Choose a staking period and lock your tokens</p>
              </div>
            </div>
            <div className="flex gap-4">
              <TrendingUp className="w-6 h-6 text-accent-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-2">Earn Bonus Rewards</h3>
                <p className="text-white/60">Receive multiplied mining distributions</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
