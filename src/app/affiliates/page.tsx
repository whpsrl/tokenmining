'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Copy,
  Share2,
  BarChart3,
  Link as LinkIcon,
  ExternalLink,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AffiliatesPage() {
  const [user] = useState({
    referralCode: 'HB8X4K9P',
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 2847.30,
    pendingEarnings: 456.78,
    conversionRate: 67.5
  });

  const [referrals] = useState([
    {
      id: 1,
      name: 'Mario R.',
      email: 'mario@email.com',
      joinDate: '2025-01-15',
      totalPurchased: 5000,
      commission: 500,
      status: 'active'
    },
    {
      id: 2,
      name: 'Laura B.',
      email: 'laura@email.com',
      joinDate: '2025-01-12',
      totalPurchased: 3500,
      commission: 350,
      status: 'active'
    },
    {
      id: 3,
      name: 'Giovanni M.',
      email: 'giovanni@email.com',
      joinDate: '2025-01-08',
      totalPurchased: 7500,
      commission: 750,
      status: 'active'
    },
    {
      id: 4,
      name: 'Francesca P.',
      email: 'francesca@email.com',
      joinDate: '2025-01-05',
      totalPurchased: 2000,
      commission: 200,
      status: 'pending'
    }
  ]);

  const [clicks] = useState([
    { date: '2025-01-20', clicks: 45, conversions: 3 },
    { date: '2025-01-19', clicks: 38, conversions: 2 },
    { date: '2025-01-18', clicks: 52, conversions: 4 },
    { date: '2025-01-17', clicks: 41, conversions: 2 },
    { date: '2025-01-16', clicks: 49, conversions: 3 },
  ]);

  const referralLink = `https://hashburst.io/?ref=${user.referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiato negli appunti!');
  };

  const shareVia = (platform: string) => {
    const text = 'Scopri HashBurst Token - Mining crypto AI-powered! 🚀';
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(referralLink);

    const urls: { [key: string]: string } = {
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Affiliati</span>
            </Link>

            <Link href="/dashboard" className="btn-secondary text-sm">
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 text-white">
              Programma <span className="gradient-text">Affiliati</span>
            </h1>
            <p className="text-gray-400">
              Guadagna fino al 10% di commissione su ogni referral
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Referral Totali',
                value: user.totalReferrals.toString(),
                icon: Users,
                color: 'from-primary-600 to-primary-800',
                subtext: `${user.activeReferrals} attivi`
              },
              {
                label: 'Guadagni Totali',
                value: user.totalEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'USD' }),
                icon: DollarSign,
                color: 'from-green-600 to-emerald-800',
                subtext: 'Lifetime earnings'
              },
              {
                label: 'In Attesa',
                value: user.pendingEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'USD' }),
                icon: TrendingUp,
                color: 'from-accent-600 to-accent-800',
                subtext: 'Prossimo payout'
              },
              {
                label: 'Tasso Conversione',
                value: user.conversionRate + '%',
                icon: BarChart3,
                color: 'from-orange-600 to-red-800',
                subtext: 'Click → Acquisto'
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
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.subtext}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Referral Link Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <LinkIcon className="w-7 h-7 text-primary-400" />
                  Il Tuo Link Referral
                </h2>

                <div className="glass rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-4 py-3 glass rounded-lg border border-white/10 text-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(referralLink)}
                      className="btn-primary whitespace-nowrap"
                    >
                      <Copy className="inline w-5 h-5 mr-2" />
                      Copia
                    </button>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-400 mb-3">Oppure condividi tramite:</div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => shareVia('email')}
                        className="w-12 h-12 glass rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                        title="Email"
                      >
                        <Mail className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => shareVia('whatsapp')}
                        className="w-12 h-12 glass rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 text-green-400" />
                      </button>
                      <button
                        onClick={() => shareVia('telegram')}
                        className="w-12 h-12 glass rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                        title="Telegram"
                      >
                        <ExternalLink className="w-5 h-5 text-primary-400" />
                      </button>
                      <button
                        onClick={() => shareVia('twitter')}
                        className="w-12 h-12 glass rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                        title="Twitter"
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => shareVia('facebook')}
                        className="w-12 h-12 glass rounded-lg hover:bg-white/10 transition flex items-center justify-center"
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary-400 mb-1">10%</div>
                    <div className="text-sm text-gray-400">Commissione Base</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent-400 mb-1">15%</div>
                    <div className="text-sm text-gray-400">Con 10+ Referral</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">∞</div>
                    <div className="text-sm text-gray-400">Guadagni Lifetime</div>
                  </div>
                </div>
              </motion.div>

              {/* Referrals List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <Users className="w-7 h-7 text-accent-400" />
                  I Tuoi Referral
                </h2>

                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="glass rounded-xl p-4 hover:bg-white/10 transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {referral.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{referral.name}</div>
                            <div className="text-sm text-gray-400">{referral.email}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          referral.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {referral.status === 'active' ? 'Attivo' : 'In Attesa'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">Iscritto</div>
                          <div className="text-white font-semibold">{referral.joinDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Acquistato</div>
                          <div className="text-white font-semibold">${referral.totalPurchased.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Tua Commissione</div>
                          <div className="text-green-400 font-bold">${referral.commission.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Commission Structure */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Struttura Commissioni</h3>
                <div className="space-y-3">
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">0-9 Referral</span>
                      <span className="text-primary-400 font-bold">10%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 w-1/3"></div>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">10-49 Referral</span>
                      <span className="text-accent-400 font-bold">15%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-600 w-2/3"></div>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">50+ Referral</span>
                      <span className="text-green-400 font-bold">20%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 w-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Click Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">Click Recenti</h3>
                <div className="space-y-3">
                  {clicks.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{day.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{day.clicks} 👁️</span>
                        <span className="text-green-400 font-semibold">{day.conversions} ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">💡 Suggerimenti</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Condividi sui social per massimizzare reach</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Spiega i vantaggi del mining AI-powered</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Evidenzia rewards garantiti e anti-dump</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Usa i nostri materiali marketing ufficiali</span>
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
