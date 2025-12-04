'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function TokenSalePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 7,
    minutes: 32,
    seconds: 45
  });

  const [stats, setStats] = useState({
    raised: 0,
    target: 5000000,
    progress: 0,
    holders: 0,
    tokensSold: 0
  });

  const [loading, setLoading] = useState(true);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats({
            raised: data.stats.totalRaised || 0,
            target: data.stats.presaleTarget || 5000000,
            progress: data.stats.presaleProgress || 0,
            holders: data.stats.totalHolders || 0,
            tokensSold: data.stats.totalTokensSold || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Update every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saleStages = [
    {
      stage: 'Private Sale',
      price: '$0.08',
      discount: '60%',
      status: 'completed',
      raised: '2.5M'
    },
    {
      stage: 'Pre-Sale',
      price: '$0.10',
      discount: '50%',
      status: 'active',
      raised: '3.8M',
      target: '5M'
    },
    {
      stage: 'Public Sale',
      price: '$0.15',
      discount: '25%',
      status: 'upcoming',
      target: '10M'
    },
    {
      stage: 'Launch',
      price: '$0.20',
      discount: '-',
      status: 'upcoming',
      exchange: 'DEX/CEX'
    }
  ];

  const tokenomics = [
    { label: 'Total Supply', value: '100,000,000 HBT', color: 'from-primary-600 to-primary-400' },
    { label: 'Public Sale', value: '35%', color: 'from-accent-600 to-accent-400' },
    { label: 'Team & Advisors', value: '15%', color: 'from-purple-600 to-purple-400', locked: '2 years' },
    { label: 'Staking Rewards', value: '20%', color: 'from-green-600 to-green-400' },
    { label: 'Liquidity', value: '15%', color: 'from-blue-600 to-blue-400', locked: '1 year' },
    { label: 'Marketing', value: '10%', color: 'from-orange-600 to-orange-400' },
    { label: 'Reserve', value: '5%', color: 'from-red-600 to-red-400' }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Early Bird Bonus',
      description: 'Acquista ora con 50% di sconto sul prezzo di lancio',
      color: 'text-primary-400'
    },
    {
      icon: Lock,
      title: 'Vesting Graduale',
      description: '10% unlock immediato, resto distribuito in 6 mesi',
      color: 'text-accent-400'
    },
    {
      icon: Sparkles,
      title: 'Staking Rewards',
      description: 'APY fino al 120% per i primi stakers',
      color: 'text-green-400'
    },
    {
      icon: Shield,
      title: 'Audit Completato',
      description: 'Smart contract verificato da CertiK',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold gradient-text">HashBurst</span>
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Acquista Ora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-primary-300 font-semibold">Pre-Sale Attiva - 50% di Sconto</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Token Sale</span>
              <br />
              <span className="text-white">HashBurst</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Investi nel futuro del mining AI-powered. Pre-sale limitata con bonus esclusivi 
              e accesso prioritario alla piattaforma.
            </p>

            {/* Countdown */}
            <div className="glass-dark rounded-3xl p-8 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-accent-400" />
                <span className="text-gray-300 font-semibold">Pre-Sale Termina Tra:</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {[
                  { value: timeLeft.days, label: 'Giorni' },
                  { value: timeLeft.hours, label: 'Ore' },
                  { value: timeLeft.minutes, label: 'Minuti' },
                  { value: timeLeft.seconds, label: 'Secondi' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-6xl font-bold gradient-text mb-2">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-sm md:text-base text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between text-sm text-gray-300 mb-3">
                <span>Raccolti: <strong className="text-primary-400">${(stats.raised / 1000000).toFixed(2)}M</strong></span>
                <span>Target: <strong>${(stats.target / 1000000).toFixed(1)}M</strong></span>
              </div>
              <div className="h-4 bg-dark-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                />
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">
                {stats.progress.toFixed(1)}% completato - Solo ${((stats.target - stats.raised) / 1000000).toFixed(2)}M rimasti!
              </p>
            </div>
          </motion.div>

          {/* Sale Stages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Fasi della Sale
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {saleStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glass rounded-2xl p-6 text-center relative ${
                    stage.status === 'active' ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {stage.status === 'active' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                        ATTIVA ORA
                      </span>
                    </div>
                  )}
                  
                  {stage.status === 'completed' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  )}

                  <div className={`text-sm font-semibold mb-3 ${
                    stage.status === 'completed' ? 'text-green-400' :
                    stage.status === 'active' ? 'text-primary-400' :
                    'text-gray-500'
                  }`}>
                    {stage.stage.toUpperCase()}
                  </div>

                  <div className="text-3xl font-bold text-white mb-2">
                    {stage.price}
                  </div>

                  <div className="text-sm text-accent-400 mb-4">
                    {stage.discount} discount
                  </div>

                  {stage.raised && (
                    <div className="text-sm text-gray-300">
                      Raccolti: <strong className="text-primary-400">${stage.raised}</strong>
                      {stage.target && ` / $${stage.target}`}
                    </div>
                  )}

                  {stage.exchange && (
                    <div className="text-sm text-gray-400">
                      {stage.exchange}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Perché Investire Ora
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-dark rounded-2xl p-6"
                >
                  <benefit.icon className={`w-12 h-12 ${benefit.color} mb-4`} />
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tokenomics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Tokenomics
            </h2>

            <div className="glass-dark rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                {tokenomics.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-white font-semibold">{item.label}</span>
                        {item.locked && (
                          <span className="ml-2 text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                            🔒 Locked {item.locked}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-300 font-bold">{item.value}</span>
                    </div>
                    <div className="h-3 bg-dark-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        style={{ 
                          width: typeof item.value === 'string' && item.value.includes('%') 
                            ? item.value 
                            : '100%' 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold gradient-text mb-1">100M</div>
                    <div className="text-sm text-gray-400">Total Supply</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold gradient-text mb-1">$0.10</div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-3xl p-12 text-center"
          >
            <Target className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Non Perdere l'Opportunità
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              La pre-sale termina tra {timeLeft.days} giorni. Dopo il lancio, 
              il prezzo del token sarà di $0.20 - il doppio del prezzo attuale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary text-lg px-8">
                Acquista Token
                <ArrowRight className="inline w-5 h-5 ml-2" />
              </Link>
              <Link href="/whitepaper" className="btn-secondary text-lg px-8">
                Leggi Whitepaper
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Minimo acquisto: 100 HBT ($10) • Pagamenti: ETH, USDT, Carta
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}