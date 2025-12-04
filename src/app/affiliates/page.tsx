'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { 
  Users, 
  Network, 
  DollarSign, 
  Award, 
  Copy, 
  CheckCircle,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ReferralStats {
  referral_code: string;
  direct_referrals: number;
  total_referrals: number;
  network_size: number;
  referral_earnings: number;
  structure_bonus_earned: boolean;
  level1_earnings: number;
  level2_earnings: number;
  level3_earnings: number;
  structure_bonus_amount: number;
}

interface TreeNode {
  user_id: string;
  email: string;
  level: number;
  total_purchases: number;
  created_at: string;
}

interface ReferralSettings {
  level1_commission: number;
  level2_commission: number;
  level3_commission: number;
  structure_bonus_threshold: number;
  structure_bonus_amount: number;
  program_active: boolean;
  program_end_date: string | null;
}

interface Commission {
  id: number;
  level: number;
  commission_amount: number;
  purchase_amount: number;
  created_at: string;
  from_user: { email: string };
}

export default function AffiliatesPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [tree, setTree] = useState<{ level1: TreeNode[], level2: TreeNode[], level3: TreeNode[] }>({ level1: [], level2: [], level3: [] });
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      // Fetch stats
      const response = await fetch('/api/referral/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTree(data.tree);
        setCommissions(data.commissions);
        setSettings(data.settings);
        setReferralLink(data.referral_link);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const isProgramActive = settings?.program_active && 
    (!settings?.program_end_date || new Date(settings.program_end_date) > new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Programma Referral</span>
          </h1>
          <p className="text-white/70">Sistema a 3 livelli - Guadagna invitando amici</p>
        </div>

        {/* Program Status Warning */}
        {!isProgramActive && (
          <div className="card-dark p-6 mb-8 border-2 border-red-500/50 bg-red-500/10">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-xl font-bold text-red-400">Programma Terminato</h3>
                <p className="text-white/70">Il programma referral è attualmente disattivato.</p>
              </div>
            </div>
          </div>
        )}

        {/* Referral Link */}
        <div className="card-dark p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Il Tuo Link Referral</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-dark-100 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
            <button
              onClick={copyLink}
              className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copiato!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copia
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-dark p-6"
          >
            <Users className="w-10 h-10 text-primary-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats?.direct_referrals || 0}
            </div>
            <div className="text-sm text-white/60">Referral Diretti</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-dark p-6"
          >
            <Network className="w-10 h-10 text-accent-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats?.network_size || 0}
            </div>
            <div className="text-sm text-white/60">Rete Totale</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-dark p-6"
          >
            <DollarSign className="w-10 h-10 text-green-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              ${stats?.referral_earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-white/60">Guadagni Totali</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-dark p-6"
          >
            <Award className="w-10 h-10 text-yellow-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats?.structure_bonus_earned ? '✓' : `${stats?.network_size || 0}/${settings?.structure_bonus_threshold || 50}`}
            </div>
            <div className="text-sm text-white/60">Premio Struttura</div>
          </motion.div>
        </div>

        {/* Commission Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-dark p-6 border-l-4 border-primary-400">
            <div className="text-sm text-white/60 mb-2">Livello 1 ({settings?.level1_commission}%)</div>
            <div className="text-2xl font-bold text-white mb-1">
              ${stats?.level1_earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-white/40">Da referral diretti</div>
          </div>

          <div className="card-dark p-6 border-l-4 border-accent-400">
            <div className="text-sm text-white/60 mb-2">Livello 2 ({settings?.level2_commission}%)</div>
            <div className="text-2xl font-bold text-white mb-1">
              ${stats?.level2_earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-white/40">Da referral dei referral</div>
          </div>

          <div className="card-dark p-6 border-l-4 border-green-400">
            <div className="text-sm text-white/60 mb-2">Livello 3 ({settings?.level3_commission}%)</div>
            <div className="text-2xl font-bold text-white mb-1">
              ${stats?.level3_earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-white/40">Da livello 3 della rete</div>
          </div>
        </div>

        {/* Structure Bonus Progress */}
        {!stats?.structure_bonus_earned && settings && (
          <div className="card-dark p-8 mb-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">
            <div className="flex items-center gap-4 mb-4">
              <Target className="w-10 h-10 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Premio Struttura</h3>
                <p className="text-white/70">Raggiungi {settings.structure_bonus_threshold} persone nella rete e ricevi ${settings.structure_bonus_amount} bonus</p>
              </div>
            </div>
            <div className="relative w-full h-4 bg-dark-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                style={{ width: `${Math.min((stats?.network_size || 0) / settings.structure_bonus_threshold * 100, 100)}%` }}
              />
            </div>
            <div className="mt-3 text-center text-white/70">
              <span className="font-bold text-white">{stats?.network_size || 0}</span> / {settings.structure_bonus_threshold} persone
            </div>
          </div>
        )}

        {/* Structure Bonus Earned */}
        {stats?.structure_bonus_earned && (
          <div className="card-dark p-8 mb-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-green-400" />
              <div>
                <h3 className="text-2xl font-bold text-green-400">🎉 Premio Struttura Ricevuto!</h3>
                <p className="text-white/70">Hai ricevuto ${stats.structure_bonus_amount} per aver costruito una rete di {stats.network_size} persone</p>
              </div>
            </div>
          </div>
        )}

        {/* Referral Tree */}
        <div className="space-y-6 mb-8">
          {/* Level 1 */}
          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-primary-400 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Livello 1 - Referral Diretti ({tree.level1.length})
            </h3>
            {tree.level1.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tree.level1.map((node) => (
                  <div key={node.user_id} className="bg-dark-100 p-4 rounded-lg border border-primary-400/20">
                    <div className="text-white font-medium mb-2">{node.email}</div>
                    <div className="text-sm text-white/60">
                      Acquisti: ${node.total_purchases.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {new Date(node.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/40 text-center py-8">Ancora nessun referral diretto</div>
            )}
          </div>

          {/* Level 2 */}
          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-accent-400 mb-4 flex items-center gap-2">
              <Network className="w-6 h-6" />
              Livello 2 - Referral dei Referral ({tree.level2.length})
            </h3>
            {tree.level2.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tree.level2.map((node) => (
                  <div key={node.user_id} className="bg-dark-100 p-4 rounded-lg border border-accent-400/20">
                    <div className="text-white font-medium mb-2">{node.email}</div>
                    <div className="text-sm text-white/60">
                      Acquisti: ${node.total_purchases.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {new Date(node.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/40 text-center py-8">Nessun referral di secondo livello</div>
            )}
          </div>

          {/* Level 3 */}
          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Livello 3 - Rete Estesa ({tree.level3.length})
            </h3>
            {tree.level3.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tree.level3.map((node) => (
                  <div key={node.user_id} className="bg-dark-100 p-4 rounded-lg border border-green-400/20">
                    <div className="text-white font-medium mb-2">{node.email}</div>
                    <div className="text-sm text-white/60">
                      Acquisti: ${node.total_purchases.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {new Date(node.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/40 text-center py-8">Nessun referral di terzo livello</div>
            )}
          </div>
        </div>

        {/* Recent Commissions */}
        {commissions.length > 0 && (
          <div className="card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-6">Commissioni Recenti</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Data</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Da</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Livello</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium">Acquisto</th>
                    <th className="text-right py-3 px-4 text-white/60 font-medium">Commissione</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((comm) => (
                    <tr key={comm.id} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white/70">
                        {new Date(comm.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white">{comm.from_user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          comm.level === 1 ? 'bg-primary-400/10 text-primary-400' :
                          comm.level === 2 ? 'bg-accent-400/10 text-accent-400' :
                          'bg-green-400/10 text-green-400'
                        }`}>
                          Livello {comm.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white/70">
                        ${comm.purchase_amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-green-400 font-bold">
                        +${comm.commission_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
