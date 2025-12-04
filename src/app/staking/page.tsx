'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowLeft, CheckCircle, Lock, TrendingUp, Calendar, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function StakingPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [tokenAmount, setTokenAmount] = useState('10000');

  const stakingPlans = [
    {
      id: 1,
      name: 'Nessun Lock',
      duration: '0 giorni',
      multiplier: '1x',
      bonus: 'Normale',
      description: 'Non blocchi niente. Puoi vendere quando vuoi.',
      color: 'from-gray-600 to-gray-800',
      icon: Zap
    },
    {
      id: 2,
      name: '3 Mesi',
      duration: '90 giorni',
      multiplier: '1.2x',
      bonus: '+20%',
      description: 'Blocchi 3 mesi. Guadagni 20% in più.',
      color: 'from-blue-600 to-blue-800',
      icon: Calendar
    },
    {
      id: 3,
      name: '6 Mesi',
      duration: '180 giorni',
      multiplier: '1.5x',
      bonus: '+50%',
      description: 'Blocchi 6 mesi. Guadagni 50% in più.',
      color: 'from-purple-600 to-purple-800',
      icon: TrendingUp,
      popular: true
    },
    {
      id: 4,
      name: '12 Mesi',
      duration: '365 giorni',
      multiplier: '2x',
      bonus: '+100%',
      description: 'Blocchi 1 anno. Guadagni IL DOPPIO.',
      color: 'from-primary-600 to-primary-800',
      icon: Lock
    }
  ];

  const calculateEarnings = (planId: number) => {
    const tokens = parseFloat(tokenAmount) || 10000;
    const baseMonthly = (tokens / 1000000) * 30800;
    const plan = stakingPlans.find(p => p.id === planId);
    const multiplier = plan ? parseFloat(plan.multiplier) : 1;
    const monthly = baseMonthly * multiplier;
    const yearly = monthly * 12;
    
    return {
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 hover:text-white transition">Torna alla Home</span>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Blocca i Tuoi Token. <span className="gradient-text">Guadagna di Più.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Più a lungo tieni i token, più guadagni. Chi fa staking riceve bonus extra.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card max-w-md mx-auto mb-16"
          >
            <h3 className="text-xl font-bold text-white mb-4">Calcola i Tuoi Guadagni</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Quanti token hai?</label>
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  placeholder="10000"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stakingPlans.map((plan, index) => {
              const earnings = calculateEarnings(plan.id);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:scale-105 transition relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 rounded-full text-xs font-bold text-white">
                      POPOLARE
                    </div>
                  )}

                  <plan.icon className="w-10 h-10 text-primary-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{plan.duration}</p>
                  <p className="text-3xl font-bold text-white mb-4">{plan.multiplier}</p>
                  <p className="text-sm text-gray-300 mb-6">{plan.description}</p>

                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mensile:</span>
                      <span className="text-white font-bold">${earnings.monthly}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Annuale:</span>
                      <span className="text-white font-bold">${earnings.yearly}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/dashboard" className="btn-primary inline-block">
              Inizia Staking Ora
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Devi prima comprare token nella <Link href="/token-sale" className="text-primary-400 hover:underline">Token Sale</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
