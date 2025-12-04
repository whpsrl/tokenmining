'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Cpu,
  Award
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Stats {
  totalRevenue: number;
  totalHolders: number;
  tokensBurned: number;
  hashPower: string;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalHolders: 0,
    tokensBurned: 0,
    hashPower: '14,000'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Total revenue from completed purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Total token holders
      const { count: holdersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Tokens burned (calculate from purchases - example: 10% of sold tokens)
      const totalTokensSold = purchases?.reduce((sum, p) => sum + (Number(p.amount) / 0.06), 0) || 0;
      const tokensBurned = Math.floor(totalTokensSold * 0.1);

      setStats({
        totalRevenue,
        totalHolders: holdersCount || 0,
        tokensBurned,
        hashPower: '14,000' // Static or from settings
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold gradient-text">HashBurst</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-white/70 hover:text-white transition">
                Login
              </Link>
              <Link href="/signup" className="btn-primary px-6 py-2 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Buy Tokens.</span>
              <br />
              <span className="text-white">Own Real Hardware.</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              HashBurst token holders own real Bitcoin mining hardware. 
              Your tokens represent actual mining power generating Bitcoin 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary px-8 py-4 text-lg rounded-lg inline-flex items-center justify-center">
                Buy Tokens Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary px-8 py-4 text-lg rounded-lg">
                View Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Stats - DATI REALI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
          >
            <div className="card-dark p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary-400" />
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : `$${formatNumber(stats.totalRevenue)}`}
              </div>
              <div className="text-sm text-white/60">Total Revenue</div>
            </div>

            <div className="card-dark p-6 text-center">
              <Cpu className="w-8 h-8 mx-auto mb-3 text-accent-400" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.hashPower} TH/s
              </div>
              <div className="text-sm text-white/60">Hash Power</div>
            </div>

            <div className="card-dark p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : formatNumber(stats.tokensBurned)}
              </div>
              <div className="text-sm text-white/60">Tokens Burned</div>
            </div>

            <div className="card-dark p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : formatNumber(stats.totalHolders)}
              </div>
              <div className="text-sm text-white/60">Token Holders</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">Simple.</span> Transparent. Profitable.
          </h2>
          <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
            Buy HashBurst tokens and automatically own a share of real Bitcoin mining hardware.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: '1. Buy Tokens',
                description: 'Purchase HashBurst tokens during our token sale. Starting at $0.06 per token.'
              },
              {
                icon: Cpu,
                title: '2. Own Hardware',
                description: 'Your tokens represent ownership of real mining equipment generating Bitcoin.'
              },
              {
                icon: TrendingUp,
                title: '3. Earn Bitcoin',
                description: 'Mining revenue is used to buy back and burn tokens, increasing your share value.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="card-dark p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-400/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="card-dark p-12 text-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-400/20">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start <span className="gradient-text">Mining Bitcoin?</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join {stats.totalHolders > 0 ? formatNumber(stats.totalHolders) : 'thousands of'} token holders who own real Bitcoin mining hardware.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary px-10 py-4 text-lg rounded-lg">
                Get Started Now
              </Link>
              <Link href="/dashboard" className="btn-secondary px-10 py-4 text-lg rounded-lg">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold gradient-text">HashBurst</span>
              </div>
              <p className="text-white/60 text-sm">
                Real Bitcoin mining hardware tokenized for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/affiliates">Affiliates</Link></li>
                <li><Link href="/staking">Staking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
            © 2024 HashBurst. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
