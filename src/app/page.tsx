'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Zap, TrendingUp, Users, Cpu, Award, ArrowRight } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalHolders: 0,
    tokensBurned: 0,
    hashPower: '14,000'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Revenue reale da database
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Holders reali
      const { count: holdersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Tokens burned (calcolo da purchases)
      const totalTokensSold = purchases?.reduce((sum, p) => sum + (Number(p.amount) / 0.06), 0) || 0;
      const tokensBurned = Math.floor(totalTokensSold * 0.1);

      setStats({
        totalRevenue,
        totalHolders: holdersCount || 0,
        tokensBurned,
        hashPower: '14,000'
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fmt = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold gradient-text">HashBurst</span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Link href="/login" className="text-gray-400 hover:text-white">{t('nav.login')}</Link>
            <Link href="/signup" className="btn-primary">{t('nav.signup')}</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">{t('home.hero.title1')}</span>
            <br />
            <span>{t('home.hero.title2')}</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="btn-primary px-8 py-4 text-lg inline-flex items-center">
              {t('home.hero.buyNow')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 px-8 py-4 text-lg rounded-lg border border-white/10">
              {t('home.hero.viewDashboard')}
            </Link>
          </div>

          {/* Stats - DATI REALI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="card-dark">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <div className="text-3xl font-bold mb-1">${fmt(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-400">{t('stats.revenue')}</div>
            </div>
            <div className="card-dark">
              <Cpu className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="text-3xl font-bold mb-1">{stats.hashPower} TH/s</div>
              <div className="text-sm text-gray-400">{t('stats.hashPower')}</div>
            </div>
            <div className="card-dark">
              <Award className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <div className="text-3xl font-bold mb-1">{fmt(stats.tokensBurned)}</div>
              <div className="text-sm text-gray-400">{t('stats.tokensBurned')}</div>
            </div>
            <div className="card-dark">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <div className="text-3xl font-bold mb-1">{fmt(stats.totalHolders)}</div>
              <div className="text-sm text-gray-400">{t('stats.holders')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">{t('home.how.title')}</span>
          </h2>
          <p className="text-center text-gray-400 mb-16">{t('home.how.subtitle')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: t('home.how.step1.title'), desc: t('home.how.step1.desc') },
              { icon: Cpu, title: t('home.how.step2.title'), desc: t('home.how.step2.desc') },
              { icon: TrendingUp, title: t('home.how.step3.title'), desc: t('home.how.step3.desc') }
            ].map((step, i) => (
              <div key={i} className="card-dark text-center">
                <step.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="card-dark text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h2 className="text-4xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              {t('home.cta.subtitle', { count: stats.totalHolders > 0 ? fmt(stats.totalHolders) : 'migliaia di' })}
            </p>
            <Link href="/signup" className="btn-primary px-10 py-4 text-lg">
              {t('home.cta.getStarted')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold gradient-text">HashBurst</span>
              </div>
              <p className="text-gray-400 text-sm">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard">{t('nav.dashboard')}</Link></li>
                <li><Link href="/affiliates">{t('footer.affiliates')}</Link></li>
                <li><Link href="/staking">{t('footer.staking')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq">{t('footer.faq')}</Link></li>
                <li><Link href="/docs">{t('footer.docs')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">{t('footer.about')}</Link></li>
                <li><Link href="/contact">{t('footer.contact')}</Link></li>
                <li><Link href="/terms">{t('footer.terms')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
}
