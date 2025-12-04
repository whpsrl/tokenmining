'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Award,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalInvested: 0,
    tokensOwned: 0,
    currentValue: 0,
    referralEarnings: 0,
    networkSize: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    setUser(session.user);
    await fetchUserStats(session.user.id);
  }

  async function fetchUserStats(userId: string) {
    try {
      // Get user purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount, tokens')
        .eq('user_id', userId)
        .eq('status', 'completed');

      const totalInvested = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const tokensOwned = purchases?.reduce((sum, p) => sum + Number(p.tokens), 0) || 0;

      // Get referral stats
      const { data: referralData } = await supabase
        .from('user_referral_stats')
        .select('referral_earnings, network_size')
        .eq('user_id', userId)
        .single();

      setStats({
        totalInvested,
        tokensOwned,
        currentValue: tokensOwned * 0.06, // Current price
        referralEarnings: referralData?.referral_earnings || 0,
        networkSize: referralData?.network_size || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/70">Welcome back, {user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-green-400" />
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats.totalInvested.toFixed(2)}
            </div>
            <div className="text-sm text-white/60">Total Invested</div>
          </div>

          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-10 h-10 text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.tokensOwned.toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Tokens Owned</div>
          </div>

          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-accent-400" />
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats.currentValue.toFixed(2)}
            </div>
            <div className="text-sm text-white/60">Current Value</div>
          </div>

          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${stats.referralEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-white/60">Referral Earnings</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/signup" className="card-dark p-6 hover:border-primary-400/50 transition cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-2">Buy More Tokens</h3>
            <p className="text-white/60 mb-4">Increase your mining power</p>
            <div className="text-primary-400 flex items-center">
              Buy Now <ArrowUpRight className="ml-2 w-4 h-4" />
            </div>
          </a>

          <a href="/affiliates" className="card-dark p-6 hover:border-accent-400/50 transition cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-2">Referral Program</h3>
            <p className="text-white/60 mb-4">Earn {stats.networkSize > 0 ? `from ${stats.networkSize} referrals` : 'up to 17.5%'}</p>
            <div className="text-accent-400 flex items-center">
              View Details <ArrowUpRight className="ml-2 w-4 h-4" />
            </div>
          </a>

          <a href="/staking" className="card-dark p-6 hover:border-yellow-400/50 transition cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-2">Stake Tokens</h3>
            <p className="text-white/60 mb-4">Lock for bonus rewards</p>
            <div className="text-yellow-400 flex items-center">
              Start Staking <ArrowUpRight className="ml-2 w-4 h-4" />
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="card-dark p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="text-white/40 text-center py-8">
            No recent activity
          </div>
        </div>

      </div>
    </div>
  );
}
