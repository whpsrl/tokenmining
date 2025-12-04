'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReferralStats {
  directReferrals: number;
  level2Referrals: number;
  level3Referrals: number;
  networkSize: number;
  level1Earnings: number;
  level2Earnings: number;
  level3Earnings: number;
  totalEarnings: number;
}

interface Commission {
  id: string;
  commission_earned: number;
  purchase_amount: number;
  level: number;
  created_at: string;
  referred: { email: string };
}

export default function AffiliatesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState('ABC123');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/');
      return;
    }
    
    setUserId(id);
    fetchStats(id);
    fetchCommissions(id);
  }, [router]);

  const fetchStats = async (id: string) => {
    try {
      const res = await fetch('/api/referrals/stats', {
        headers: { 'x-user-id': id }
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const fetchCommissions = async (id: string) => {
    try {
      const res = await fetch('/api/referrals/commissions', {
        headers: { 'x-user-id': id }
      });
      const data = await res.json();
      if (data.success) setCommissions(data.commissions);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    }
  };

  const copyLink = () => {
    const link = \`\${window.location.origin}?ref=\${referralCode}\`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Programma Affiliati</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded transition"
          >
            ← Dashboard
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Il Tuo Link Referral</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={\`\${typeof window !== 'undefined' ? window.location.origin : ''}?ref=\${referralCode}\`}
              readOnly
              className="flex-1 bg-black border border-gray-700 rounded px-4 py-2 text-sm"
            />
            <button
              onClick={copyLink}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition whitespace-nowrap"
            >
              {copied ? '✓ Copiato!' : 'Copia'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
            <div className="text-blue-200 text-sm mb-2">Livello 1 (10%)</div>
            <div className="text-3xl font-bold mb-1">{stats?.directReferrals || 0}</div>
            <div className="text-blue-300 text-sm">Referral Diretti</div>
            <div className="text-2xl font-bold text-green-400 mt-3">
              \${(stats?.level1Earnings || 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6">
            <div className="text-purple-200 text-sm mb-2">Livello 2 (5%)</div>
            <div className="text-3xl font-bold mb-1">{stats?.level2Referrals || 0}</div>
            <div className="text-purple-300 text-sm">Secondo Livello</div>
            <div className="text-2xl font-bold text-green-400 mt-3">
              \${(stats?.level2Earnings || 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-xl p-6">
            <div className="text-pink-200 text-sm mb-2">Livello 3 (2.5%)</div>
            <div className="text-3xl font-bold mb-1">{stats?.level3Referrals || 0}</div>
            <div className="text-pink-300 text-sm">Terzo Livello</div>
            <div className="text-2xl font-bold text-green-400 mt-3">
              \${(stats?.level3Earnings || 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6">
            <div className="text-green-200 text-sm mb-2">Totale Rete</div>
            <div className="text-3xl font-bold mb-1">{stats?.networkSize || 0}</div>
            <div className="text-green-300 text-sm">Persone</div>
            <div className="text-2xl font-bold text-yellow-400 mt-3">
              \${(stats?.totalEarnings || 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Commissioni Recenti</h2>
          {commissions.length === 0 ? (
            <p className="text-gray-400">Nessuna commissione ancora. Invita amici per iniziare a guadagnare!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2">Data</th>
                    <th className="text-left py-3 px-2">Utente</th>
                    <th className="text-center py-3 px-2">Livello</th>
                    <th className="text-right py-3 px-2">Acquisto</th>
                    <th className="text-right py-3 px-2">Commissione</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-b border-gray-800">
                      <td className="py-3 px-2 text-sm text-gray-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-sm">{c.referred?.email}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={\`
                          px-2 py-1 rounded text-xs font-medium
                          \${c.level === 1 ? 'bg-blue-900 text-blue-200' : ''}
                          \${c.level === 2 ? 'bg-purple-900 text-purple-200' : ''}
                          \${c.level === 3 ? 'bg-pink-900 text-pink-200' : ''}
                        \`}>
                          L{c.level}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-gray-400">
                        \${c.purchase_amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-green-400 font-medium">
                        \${c.commission_earned.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
