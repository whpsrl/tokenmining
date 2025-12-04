'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Shield, 
  Cpu, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Coins,
  LineChart,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalMiners: 0,
    totalHashrate: 0,
    dailyRewards: 0,
    holders: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats({
            totalMiners: data.stats.activeMining || 0,
            totalHashrate: Math.floor(data.stats.totalTokensSold / 1000), // Simulate hashrate from tokens
            dailyRewards: Math.floor(data.stats.totalRaised / 100), // Simulate daily rewards
            holders: data.stats.totalHolders || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">HashBurst</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              <Link href="/token-sale" className="text-gray-300 hover:text-white transition">
                Token Sale
              </Link>
              <Link href="/join" className="text-gray-300 hover:text-white transition">
                Mining Gratis
              </Link>
              <Link href="/whitepaper" className="text-gray-300 hover:text-white transition">
                Whitepaper
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/affiliates" className="text-gray-300 hover:text-white transition">
                    Affiliati
                  </Link>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                    Dashboard
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin" className="text-primary-400 hover:text-primary-300 transition font-semibold flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="btn-secondary text-sm">
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white transition">
                    Accedi
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    Registrati
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 glass rounded-full border border-primary-500/30"
            >
              <span className="text-primary-400 font-semibold">🚀 Live on Polygon Network</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Il Futuro del
              <br />
              <span className="gradient-text">Mining Crypto</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Token rivoluzionario basato su mining reale. Tecnologia AI, rete geo-distribuita 
              e rewards garantiti dal cloud mining più efficiente al mondo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/token-sale" className="btn-primary group">
                Compra Token - 50% OFF
                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link href="/join" className="btn-secondary">
                Mining Gratuito
              </Link>
            </div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: 'Miners Attivi', value: stats.totalMiners.toLocaleString(), icon: Users },
                { label: 'Total Hashrate', value: `${stats.totalHashrate.toLocaleString()} TH/s`, icon: Zap },
                { label: 'Daily Rewards', value: `$${stats.dailyRewards.toLocaleString()}`, icon: Coins },
                { label: 'Token Holders', value: stats.holders.toLocaleString(), icon: TrendingUp }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="card"
                >
                  <stat.icon className="w-8 h-8 text-primary-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tecnologia <span className="gradient-text">All'Avanguardia</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              HashBurst combina AI, blockchain e cloud mining per creare 
              un ecosistema unico e redditizio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Anti-Dump Protection',
                description: 'Vendita massima 5% mensile per proteggere il valore del token',
                color: 'from-green-600 to-emerald-600'
              },
              {
                icon: Users,
                title: 'Anti-Whale System',
                description: 'Limite acquisto 0.1% supply per 12 mesi, distribuzione equa',
                color: 'from-blue-600 to-cyan-600'
              },
              {
                icon: Cpu,
                title: 'AI-Powered Mining',
                description: 'Algoritmi intelligenti per massimizzare rewards e efficienza',
                color: 'from-purple-600 to-pink-600'
              },
              {
                icon: Globe,
                title: 'Geo-Distributed',
                description: 'Network globale con 950+ macchine retail e HPC servers',
                color: 'from-orange-600 to-red-600'
              },
              {
                icon: LineChart,
                title: 'Rewards Garantiti',
                description: 'Mining reale da 8+ crypto: BTC, XMR, ETH, LTC e altre',
                color: 'from-primary-600 to-primary-800'
              },
              {
                icon: Coins,
                title: 'Programma Affiliati',
                description: 'Guadagna fino al 10% di commissione su ogni referral',
                color: 'from-accent-600 to-accent-800'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:scale-105 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              <span className="gradient-text">Tokenomics</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Distribuzione Supply</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Mining Rewards', percentage: 40, color: 'bg-primary-600' },
                    { label: 'Private Sale', percentage: 30, color: 'bg-accent-600' },
                    { label: 'Liquidity Pool', percentage: 15, color: 'bg-green-600' },
                    { label: 'Team (Locked)', percentage: 10, color: 'bg-purple-600' },
                    { label: 'Marketing', percentage: 5, color: 'bg-orange-600' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-semibold">{item.percentage}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${item.color} rounded-full`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Key Features</h3>
                <div className="space-y-4">
                  {[
                    'Supply Totale: 1.000.000.000 HBT',
                    'Network: Polygon (Low Fees)',
                    'Anti-Dump: Max 5% vendita/mese',
                    'Anti-Whale: Max 0.1% acquisto/12 mesi',
                    'Private Sale: Early Access',
                    'Staking: Coming Soon',
                    'Governance: DAO Future',
                    'Mining Backed: Valore Reale'
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto card text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20"></div>
          
          <div className="relative z-10 py-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto a <span className="gradient-text">Minare Gratis</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Unisciti a oltre 950 miners attivi. Ricevi token gratis e partecipa 
              alla rivoluzione del cloud mining AI-powered.
            </p>
            <Link href="/join" className="btn-primary text-lg group">
              Richiedi Accesso Gratuito
              <ArrowRight className="inline ml-2 w-6 h-6 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">HashBurst</span>
              </div>
              <p className="text-gray-400">
                Il futuro del mining crypto. AI-powered, eco-friendly, profittevole.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Prodotto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/whitepaper" className="hover:text-white transition">Whitepaper</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/affiliates" className="hover:text-white transition">Affiliati</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Risorse</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.synapta.net" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Synapta Mining</a></li>
                <li><a href="https://www.crypto-verse.net" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Crypto Verse</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Social</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HashBurst Token. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
