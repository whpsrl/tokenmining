'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Cpu, TrendingUp, Users, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function ReferralLandingPage() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  if (!referralCode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Link non valido</h1>
          <Link href="/" className="btn-primary">
            Vai alla Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6 px-6 py-3 glass rounded-full border border-primary-500/30">
            <span className="text-primary-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Invito Esclusivo
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Sei Stato Invitato a
            <br />
            <span className="gradient-text">HashBurst Token</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Unisciti al futuro del mining crypto con un codice referral esclusivo
          </p>

          <div className="glass-dark rounded-2xl p-6 max-w-md mx-auto mb-8">
            <p className="text-sm text-gray-400 mb-2">Codice Referral Applicato:</p>
            <p className="text-3xl font-bold text-primary-400 tracking-wider">
              {referralCode}
            </p>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {[
            {
              icon: TrendingUp,
              title: 'Bonus Benvenuto',
              description: 'Ricevi token HBT extra come bonus di benvenuto',
              color: 'from-green-600 to-emerald-600'
            },
            {
              icon: Shield,
              title: 'Accesso Prioritario',
              description: 'Private sale e features esclusive per te',
              color: 'from-blue-600 to-cyan-600'
            },
            {
              icon: Users,
              title: 'Community VIP',
              description: 'Entra nella community referral con vantaggi extra',
              color: 'from-purple-600 to-pink-600'
            },
            {
              icon: Cpu,
              title: 'Mining Gratuito',
              description: 'Accesso al programma di mining gratuito immediato',
              color: 'from-orange-600 to-red-600'
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card hover:scale-105 cursor-pointer"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-dark rounded-3xl p-12 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto a Iniziare?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Registrati ora con il codice referral e ricevi tutti i vantaggi esclusivi
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link 
              href={`/auth/register?ref=${referralCode}`}
              className="btn-primary text-lg group w-full sm:w-auto"
            >
              Registrati Ora
              <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link 
              href={`/auth/login`}
              className="btn-secondary w-full sm:w-auto"
            >
              Ho già un account
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Registrandoti accetti i termini e condizioni di HashBurst Token
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: 'Miners Attivi', value: '950+' },
            { label: 'Token Holders', value: '1.2K+' },
            { label: 'Daily Rewards', value: '$15K+' },
            { label: 'Uptime', value: '99.9%' }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
