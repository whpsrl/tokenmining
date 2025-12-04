'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'purchases' | 'settings'>('users');
  
  const [stats] = useState({
    totalUsers: 1289,
    totalRevenue: 147853,
    pendingRequests: 24,
    activeMining: 950
  });

  const [users] = useState([
    {
      id: 1,
      email: 'mario@email.com',
      wallet: '0x742...bEb1',
      tokenBalance: 15234,
      referrals: 12,
      status: 'active',
      joinDate: '2025-01-15'
    },
    {
      id: 2,
      email: 'laura@email.com',
      wallet: '0x8f3...Ac2',
      tokenBalance: 8456,
      referrals: 5,
      status: 'active',
      joinDate: '2025-01-12'
    }
  ]);

  const [requests] = useState([
    {
      id: 1,
      name: 'Giovanni Rossi',
      email: 'giovanni@email.com',
      wallet: '0x5a1...De8',
      message: 'Interessato al mining gratuito',
      status: 'pending',
      date: '2025-01-20'
    },
    {
      id: 2,
      name: 'Francesca Bianchi',
      email: 'francesca@email.com',
      wallet: '0x9b2...Ff4',
      message: 'Vorrei partecipare al webinar',
      status: 'pending',
      date: '2025-01-19'
    }
  ]);

  const handleApproveRequest = (id: number) => {
    console.log('Approved request:', id);
    // TODO: Implementa logica approvazione
  };

  const handleRejectRequest = (id: number) => {
    console.log('Rejected request:', id);
    // TODO: Implementa logica rifiuto
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Admin Panel</span>
            </div>

            <Link href="/dashboard" className="btn-secondary text-sm">
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Utenti Totali',
                value: stats.totalUsers.toLocaleString(),
                icon: Users,
                color: 'from-primary-600 to-primary-800'
              },
              {
                label: 'Revenue Totale',
                value: '$' + stats.totalRevenue.toLocaleString(),
                icon: DollarSign,
                color: 'from-green-600 to-emerald-800'
              },
              {
                label: 'Richieste Pending',
                value: stats.pendingRequests.toString(),
                icon: AlertCircle,
                color: 'from-yellow-600 to-orange-800'
              },
              {
                label: 'Mining Attivo',
                value: stats.activeMining.toString(),
                icon: TrendingUp,
                color: 'from-accent-600 to-accent-800'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="glass-dark rounded-2xl p-2 mb-8 flex gap-2">
            {[
              { id: 'users', label: 'Utenti', icon: Users },
              { id: 'requests', label: 'Richieste Mining', icon: FileText },
              { id: 'purchases', label: 'Acquisti', icon: DollarSign },
              { id: 'settings', label: 'Impostazioni', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-8"
          >
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Gestione Utenti</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cerca utente..."
                        className="pl-10 pr-4 py-2 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white"
                      />
                    </div>
                    <button className="btn-secondary text-sm">
                      <Download className="inline w-4 h-4 mr-2" />
                      Esporta CSV
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="glass rounded-xl p-6 hover:bg-white/10 transition">
                      <div className="grid md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Email</div>
                          <div className="text-white font-semibold">{user.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Wallet</div>
                          <div className="text-white font-mono text-sm">{user.wallet}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Token Balance</div>
                          <div className="text-white font-semibold">{user.tokenBalance.toLocaleString()} HBT</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Referral</div>
                          <div className="text-white font-semibold">{user.referrals}</div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 glass rounded-lg hover:bg-white/10 transition">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </button>
                          <button className="p-2 glass rounded-lg hover:bg-white/10 transition">
                            <Settings className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Richieste Mining Gratuito</h2>
                  <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                    {requests.filter(r => r.status === 'pending').length} in attesa
                  </span>
                </div>

                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="glass rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{request.name}</h3>
                          <div className="text-sm text-gray-400 mb-2">{request.email}</div>
                          {request.wallet && (
                            <div className="text-sm text-gray-400 font-mono">{request.wallet}</div>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{request.date}</span>
                      </div>

                      {request.message && (
                        <div className="glass rounded-lg p-4 mb-4">
                          <div className="text-sm text-gray-400 mb-1">Messaggio:</div>
                          <div className="text-white">{request.message}</div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 btn-primary text-sm"
                        >
                          <CheckCircle className="inline w-4 h-4 mr-2" />
                          Approva
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 glass rounded-lg py-2 px-4 hover:bg-red-500/20 transition text-red-400 font-semibold"
                        >
                          <XCircle className="inline w-4 h-4 mr-2" />
                          Rifiuta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Storico Acquisti</h3>
                <p className="text-gray-400">Visualizza tutte le transazioni di acquisto token</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Impostazioni Sistema</h2>
                
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Token Settings</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Prezzo Token (USD)</label>
                          <input
                            type="number"
                            defaultValue="0.12"
                            step="0.01"
                            className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Max Buy % Supply</label>
                          <input
                            type="number"
                            defaultValue="0.1"
                            step="0.001"
                            className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white"
                          />
                        </div>
                      </div>
                      <button className="btn-primary">
                        Salva Modifiche
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Private Sale</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold mb-1">Private Sale Attiva</div>
                        <div className="text-sm text-gray-400">Abilita/disabilita private sale</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
