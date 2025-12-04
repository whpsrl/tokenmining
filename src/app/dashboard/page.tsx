'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  ExternalLink,
  Settings,
  LogOut,
  BarChart3,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user: authUser, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect se non autenticato
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Mostra loading
  if (loading || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (authUser) {
      fetchDashboardData();
    }
  }, [authUser]);

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  const user = {
    email: dashboardData?.user?.email || authUser.email || 'demo@hashburst.io',
    wallet: dashboardData?.user?.walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    tokenBalance: dashboardData?.balance?.tokenBalance || 0,
    referralCode: dashboardData?.user?.referralCode || authUser.referralCode || 'HB8X4K9P',
    totalReferrals: dashboardData?.referrals?.totalReferrals || 0,
    totalCommission: dashboardData?.referrals?.totalCommission || 0
  };

  const stats = {
    totalPurchased: dashboardData?.balance?.totalPurchased || 0,
    currentValue: dashboardData?.balance?.currentValue || 0,
    profitLoss: dashboardData?.balance?.profitLossPercent || 0,
    monthlyRewards: 0 // Calculate based on holdings
  };

  const transactions = dashboardData?.transactions || [];
    },
    {
      id: 3,
      type: 'referral',
      amount: 500,
      price: 0.11,
      total: 55,
      date: '2025-01-05',
      status: 'completed'
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiato negli appunti!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">HashBurst</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/affiliates" className="btn-secondary text-sm">
                Affiliati
              </Link>
              <button className="p-2 glass rounded-lg hover:bg-white/10 transition">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                onClick={logout}
                className="p-2 glass rounded-lg hover:bg-white/10 transition hover:text-red-400 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 text-white">
              Benvenuto, <span className="gradient-text">Investitore</span>
            </h1>
            <p className="text-gray-400">
              Gestisci i tuoi token HBT e monitora i tuoi guadagni
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Balance Token',
                value: user.tokenBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 }),
                unit: 'HBT',
                icon: Wallet,
                color: 'from-primary-600 to-primary-800',
                change: '+' + stats.profitLoss + '%'
              },
              {
                label: 'Valore Attuale',
                value: (user.tokenBalance * 0.12).toLocaleString('it-IT', { style: 'currency', currency: 'USD' }),
                unit: '',
                icon: TrendingUp,
                color: 'from-green-600 to-emerald-800',
                change: '+$' + (stats.currentValue - stats.totalPurchased).toFixed(2)
              },
              {
                label: 'Referral Attivi',
                value: user.totalReferrals.toString(),
                unit: 'utenti',
                icon: Users,
                color: 'from-accent-600 to-accent-800',
                change: '+2 questo mese'
              },
              {
                label: 'Commissioni',
                value: user.totalCommission.toLocaleString('it-IT', { style: 'currency', currency: 'USD' }),
                unit: '',
                icon: Coins,
                color: 'from-orange-600 to-red-800',
                change: '+$456 questo mese'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Referral Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="glass-dark rounded-2xl p-6 border border-primary-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary-400" />
                  Il Tuo Link Referral
                </h3>
                <Link href="/affiliates" className="text-primary-400 hover:text-primary-300 text-sm font-semibold flex items-center gap-1">
                  Vedi Dettagli
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Referral Link Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Link di Invito Personale
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 glass rounded-lg px-4 py-3 border border-white/10">
                      <p className="text-white text-sm truncate">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://tuosito.com'}/ref?ref={user.referralCode}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://tuosito.com'}/ref?ref=${user.referralCode}`;
                        navigator.clipboard.writeText(link);
                        toast.success('Link copiato!');
                      }}
                      className="btn-primary px-6 flex items-center gap-2"
                      title="Copia Link"
                    >
                      <Copy className="w-4 h-4" />
                      Copia
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Condividi questo link per guadagnare commissioni del 10% su ogni acquisto
                  </p>
                </div>

                {/* Referral Code Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Il Tuo Codice Referral
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 glass rounded-lg px-4 py-3 border border-primary-500/30 bg-primary-500/10">
                      <p className="text-2xl font-bold gradient-text text-center tracking-wider">
                        {user.referralCode}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode);
                        toast.success('Codice copiato!');
                      }}
                      className="btn-secondary px-6 flex items-center gap-2"
                      title="Copia Codice"
                    >
                      <Copy className="w-4 h-4" />
                      Copia
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    I tuoi amici possono usare questo codice durante la registrazione
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{user.totalReferrals}</div>
                  <div className="text-xs text-gray-400">Utenti Invitati</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${user.totalCommission.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Commissioni Totali</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">10%</div>
                  <div className="text-xs text-gray-400">Tasso Commissione</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Buy Token Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <Coins className="w-7 h-7 text-primary-400" />
                  Acquista Token HBT
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Importo USDT
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token HBT Ricevuti
                    </label>
                    <input
                      type="number"
                      placeholder="833.33"
                      disabled
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white opacity-75"
                    />
                  </div>
                </div>

                <div className="glass rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Prezzo per Token</span>
                    <span className="text-white font-semibold">$0.12 USD</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white font-semibold">~$0.50 USD</span>
                  </div>
                  <div className="border-t border-white/10 my-3"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Totale</span>
                    <span className="text-white font-bold text-lg">$100.50 USD</span>
                  </div>
                </div>

                <button className="w-full btn-primary text-lg">
                  <Wallet className="inline mr-2 w-5 h-5" />
                  Connetti Wallet & Acquista
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Assicurati di avere USDT sul network Polygon nel tuo wallet
                </p>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <Clock className="w-7 h-7 text-accent-400" />
                  Transazioni Recenti
                </h2>

                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="glass rounded-xl p-4 hover:bg-white/10 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            tx.type === 'purchase' ? 'bg-primary-600/20' :
                            tx.type === 'reward' ? 'bg-green-600/20' :
                            'bg-accent-600/20'
                          }`}>
                            {tx.type === 'purchase' ? <Coins className="w-5 h-5 text-primary-400" /> :
                             tx.type === 'reward' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                             <Users className="w-5 h-5 text-accent-400" />}
                          </div>
                          <div>
                            <div className="font-semibold text-white capitalize">
                              {tx.type === 'purchase' ? 'Acquisto Token' :
                               tx.type === 'reward' ? 'Mining Reward' :
                               'Commissione Referral'}
                            </div>
                            <div className="text-sm text-gray-400">{tx.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">+{tx.amount.toLocaleString()} HBT</div>
                          <div className="text-sm text-gray-400">${tx.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/dashboard/transactions" className="block text-center mt-6 text-primary-400 hover:text-primary-300 font-semibold">
                  Vedi Tutte le Transazioni →
                </Link>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Wallet Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Wallet Connesso</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Indirizzo</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(user.wallet)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <a 
                  href={`https://polygonscan.com/address/${user.wallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2 glass rounded-lg hover:bg-white/10 transition text-sm text-primary-400"
                >
                  <ExternalLink className="inline w-4 h-4 mr-2" />
                  Vedi su Polygonscan
                </a>
              </motion.div>

              {/* Referral Code */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Codice Referral</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="text-2xl font-bold text-center text-primary-400 mb-2">
                    {user.referralCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`https://hashburst.io/?ref=${user.referralCode}`)}
                    className="w-full py-2 glass rounded-lg hover:bg-white/10 transition text-sm text-white"
                  >
                    <Copy className="inline w-4 h-4 mr-2" />
                    Copia Link
                  </button>
                </div>
                <Link href="/affiliates" className="block text-center text-accent-400 hover:text-accent-300 font-semibold">
                  Gestisci Affiliazioni →
                </Link>
              </motion.div>

              {/* Mining Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Mining Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Rewards Mensili</span>
                    <span className="text-white font-semibold">${stats.monthlyRewards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">APY Stimato</span>
                    <span className="text-green-400 font-semibold">45.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Prossimo Payout</span>
                    <span className="text-white font-semibold">3 giorni</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
