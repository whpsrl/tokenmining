'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalReferralEarnings: 0,
    activeReferrers: 0
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!userData?.is_admin) {
      router.push('/dashboard');
      return;
    }

    setIsAdmin(true);
    await fetchAdminStats();
  }

  async function fetchAdminStats() {
    try {
      // Total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Total revenue
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Referral stats
      const { data: referralStats } = await supabase
        .from('user_referral_stats')
        .select('referral_earnings, direct_referrals');

      const totalReferralEarnings = referralStats?.reduce((sum, s) => sum + Number(s.referral_earnings), 0) || 0;
      const activeReferrers = referralStats?.filter(s => s.direct_referrals > 0).length || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalRevenue,
        totalReferralEarnings,
        activeReferrers
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Admin Panel</span>
          </h1>
          <p className="text-white/70">System overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-dark p-6">
            <Users className="w-10 h-10 text-primary-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-white/60">Total Users</div>
          </div>

          <div className="card-dark p-6">
            <DollarSign className="w-10 h-10 text-green-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-white/60">Total Revenue</div>
          </div>

          <div className="card-dark p-6">
            <Award className="w-10 h-10 text-yellow-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              ${stats.totalReferralEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-white/60">Referral Earnings</div>
          </div>

          <div className="card-dark p-6">
            <TrendingUp className="w-10 h-10 text-accent-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.activeReferrers}
            </div>
            <div className="text-sm text-white/60">Active Referrers</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">Referral Settings</h3>
            <p className="text-white/60 mb-4">Configure commission rates and bonuses</p>
            <a href="/api/admin/referral-settings" className="text-primary-400">
              View Settings →
            </a>
          </div>

          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
            <p className="text-white/60 mb-4">Manage users and permissions</p>
            <button className="text-primary-400">
              View Users →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
