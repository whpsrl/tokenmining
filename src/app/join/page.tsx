'use client';

import { motion } from 'framer-motion';
import { Cpu, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 hover:text-white transition">Torna alla Home</span>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold gradient-text">HashBurst Mining</span>
              </div>

              <h1 className="text-5xl font-bold mb-6 text-white">
                Mina Gratis <span className="gradient-text">Con Noi</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                Partecipa al programma esclusivo di cloud mining gratuito. 
                Ricevi token HBT senza investire e scopri come funziona la nostra 
                tecnologia AI-powered.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Mining Reale</h3>
                    <p className="text-gray-400">
                      Accesso alla rete con 950+ macchine mining attive su 8+ criptovalute
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Token Gratuiti</h3>
                    <p className="text-gray-400">
                      Ricevi HBT token come reward per partecipare al programma
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Webinar Esclusivo</h3>
                    <p className="text-gray-400">
                      Partecipa al webinar per scoprire strategie e ottimizzare i guadagni
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Programma Affiliati</h3>
                    <p className="text-gray-400">
                      Accesso immediato al sistema di referral con commissioni fino al 10%
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/auth/register?source=free-mining" className="btn-primary text-lg w-full sm:w-auto">
                Partecipa Ora - È Gratis!
              </Link>

              <div className="glass rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-3">💎 Bonus Iscrizione</h4>
                <p className="text-gray-300 text-sm">
                  I primi 100 iscritti riceveranno un bonus di <strong className="text-primary-400">500 HBT</strong> extra 
                  e l'accesso prioritario alla private sale con sconti esclusivi.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Stats & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* CTA Card */}
              <div className="glass-dark rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Inizia Oggi
                </h2>
                <p className="text-gray-300 mb-6">
                  Registrati gratuitamente e accedi immediatamente al programma di mining, 
                  dashboard personale e sistema di affiliazione.
                </p>
                <Link 
                  href="/auth/register?source=free-mining" 
                  className="btn-primary text-lg w-full block text-center"
                >
                  Crea Account Gratuito
                </Link>
                <p className="text-sm text-gray-400 text-center mt-4">
                  ✅ Nessuna carta di credito richiesta
                </p>
              </div>

              {/* Stats Card */}
              <div className="glass rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-4">🚀 Community Attiva</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Miners Attivi</span>
                    <span className="text-white font-semibold">950+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Token Holders</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Daily Rewards</span>
                    <span className="text-primary-400 font-semibold">$15,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network Uptime</span>
                    <span className="text-green-400 font-semibold">99.9%</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="glass rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-3">🔒 Sicurezza & Trasparenza</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Smart Contract Verificato
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Audit di Sicurezza Completato
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    KYC Team Pubblico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    Liquidity Lock 2 Anni
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
