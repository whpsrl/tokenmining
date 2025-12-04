'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Users, 
  DollarSign, 
  TrendingUp,
  Gift,
  Award,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReferralSettings {
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
  structureBonusThreshold: number;
  structureBonusAmount: number;
  programActive: boolean;
  programEndDate: string;
}

interface AdminStats {
  overview: {
    totalUsers: number;
    referredUsers: number;
    activeReferrers: number;
    totalCommissionsPaid: number;
    avgReferralsPerUser: string;
  };
  commissionsByLevel: {
    level1: { count: number; amount: number };
    level2: { count: number; amount: number };
    level3: { count: number; amount: number };
  };
  structureBonuses: {
    totalBonuses: number;
    totalAmount: number;
  };
  treeStats: {
    level1: number;
    level2: number;
    level3: number;
  };
  topReferrers: Array<{
    id: number;
    email: string;
    referralCode: string;
    directReferrals: number;
    totalReferrals: number;
    networkSize: number;
    earnings: number;
    structureBonusEarned: boolean;
  }>;
  recentCommissions: Array<{
    id: number;
    level: number;
    amount: number;
    earner: string;
    buyer: string;
    date: string;
  }>;
}

export default function ReferralSettingsComponent({ token }: { token: string }) {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/referral/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Errore nel caricamento settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/referral-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/referral/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Settings salvati!');
      } else {
        toast.error(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings || !stats) {
    return <div className="text-white">Caricamento...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <Users className="w-8 h-8 text-primary-400 mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{stats.overview.totalUsers}</div>
          <div className="text-sm text-gray-400">Utenti Totali</div>
          <div className="text-xs text-gray-500 mt-1">{stats.overview.referredUsers} con referrer</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{stats.overview.activeReferrers}</div>
          <div className="text-sm text-gray-400">Referrer Attivi</div>
          <div className="text-xs text-gray-500 mt-1">Media: {stats.overview.avgReferralsPerUser} ref/utente</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <DollarSign className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white mb-1">${stats.overview.totalCommissionsPaid.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Commissioni Totali</div>
          <div className="text-xs text-gray-500 mt-1">L1: {stats.commissionsByLevel.level1.count} • L2: {stats.commissionsByLevel.level2.count} • L3: {stats.commissionsByLevel.level3.count}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <Gift className="w-8 h-8 text-accent-400 mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{stats.structureBonuses.totalBonuses}</div>
          <div className="text-sm text-gray-400">Premi Struttura</div>
          <div className="text-xs text-gray-500 mt-1">${stats.structureBonuses.totalAmount.toFixed(2)} totali</div>
        </motion.div>
      </div>

      {/* Settings Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-primary-400" />
          <h3 className="text-xl font-bold text-white">Impostazioni Programma Referral</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Commissione Livello 1 (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.level1Commission}
              onChange={(e) => setSettings({...settings, level1Commission: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Commissione Livello 2 (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.level2Commission}
              onChange={(e) => setSettings({...settings, level2Commission: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Commissione Livello 3 (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.level3Commission}
              onChange={(e) => setSettings({...settings, level3Commission: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Premio Struttura ($)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={settings.structureBonusAmount}
              onChange={(e) => setSettings({...settings, structureBonusAmount: parseFloat(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Threshold Premio (N° referral)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={settings.structureBonusThreshold}
              onChange={(e) => setSettings({...settings, structureBonusThreshold: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Data Fine Programma</label>
            <input
              type="date"
              value={settings.programEndDate ? settings.programEndDate.split('T')[0] : ''}
              onChange={(e) => setSettings({...settings, programEndDate: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg mb-6">
          <div>
            <h4 className="text-white font-semibold">Programma Attivo</h4>
            <p className="text-sm text-gray-400">Nuove registrazioni possono usare referral</p>
          </div>
          <button
            onClick={() => setSettings({...settings, programActive: !settings.programActive})}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              settings.programActive 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            {settings.programActive ? 'ATTIVO' : 'DISATTIVO'}
          </button>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </motion.div>

      {/* Tree Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
        <h3 className="text-xl font-bold text-white mb-6">Statistiche Network</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-primary-600/10 border border-primary-500/30 rounded-lg p-4">
            <div className="text-primary-400 font-semibold mb-2">Livello 1</div>
            <div className="text-3xl font-bold text-white mb-1">{stats.treeStats.level1}</div>
            <div className="text-sm text-gray-400">${stats.commissionsByLevel.level1.amount.toFixed(2)} commissioni</div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">Livello 2</div>
            <div className="text-3xl font-bold text-white mb-1">{stats.treeStats.level2}</div>
            <div className="text-sm text-gray-400">${stats.commissionsByLevel.level2.amount.toFixed(2)} commissioni</div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 font-semibold mb-2">Livello 3</div>
            <div className="text-3xl font-bold text-white mb-1">{stats.treeStats.level3}</div>
            <div className="text-sm text-gray-400">${stats.commissionsByLevel.level3.amount.toFixed(2)} commissioni</div>
          </div>
        </div>
      </motion.div>

      {/* Top Referrers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-accent-400" />
          <h3 className="text-xl font-bold text-white">Top 20 Referrers</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-sm text-gray-400 pb-3">Email</th>
                <th className="text-left text-sm text-gray-400 pb-3">Code</th>
                <th className="text-right text-sm text-gray-400 pb-3">Diretti</th>
                <th className="text-right text-sm text-gray-400 pb-3">Network</th>
                <th className="text-right text-sm text-gray-400 pb-3">Guadagno</th>
                <th className="text-center text-sm text-gray-400 pb-3">Bonus</th>
              </tr>
            </thead>
            <tbody>
              {stats.topReferrers.map((user, idx) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-3 text-white">{user.email}</td>
                  <td className="py-3 text-gray-400 text-sm">{user.referralCode}</td>
                  <td className="py-3 text-right text-white">{user.directReferrals}</td>
                  <td className="py-3 text-right text-white">{user.networkSize}</td>
                  <td className="py-3 text-right text-green-400 font-semibold">${user.earnings.toFixed(2)}</td>
                  <td className="py-3 text-center">
                    {user.structureBonusEarned && <Gift className="w-5 h-5 text-accent-400 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Commissions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card">
        <h3 className="text-xl font-bold text-white mb-6">Ultime 50 Commissioni</h3>

        <div className="space-y-2">
          {stats.recentCommissions.map(comm => (
            <div key={comm.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  comm.level === 1 ? 'bg-primary-600 text-white' :
                  comm.level === 2 ? 'bg-blue-600 text-white' :
                  'bg-purple-600 text-white'
                }`}>
                  L{comm.level}
                </span>
                <div>
                  <div className="text-white text-sm">{comm.earner} ← {comm.buyer}</div>
                  <div className="text-xs text-gray-500">{new Date(comm.date).toLocaleDateString('it-IT')}</div>
                </div>
              </div>
              <div className="text-green-400 font-semibold">${comm.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
