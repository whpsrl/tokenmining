'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowLeft, CheckCircle, Mail, User, Wallet, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/mining-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Richiesta inviata con successo!');
      } else {
        throw new Error('Errore invio richiesta');
      }
    } catch (error) {
      toast.error('Errore durante l\'invio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-3xl p-12 max-w-2xl text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Richiesta Ricevuta!</h2>
          <p className="text-xl text-gray-300 mb-8">
            Ti contatteremo presto via email con i dettagli per partecipare al nostro 
            programma di mining gratuito e al prossimo webinar esclusivo.
          </p>
          <Link href="/" className="btn-primary">
            Torna alla Home
          </Link>
        </motion.div>
      </div>
    );
  }

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

              <div className="glass rounded-2xl p-6">
                <h4 className="font-semibold text-white mb-3">💎 Bonus Iscrizione</h4>
                <p className="text-gray-300 text-sm">
                  I primi 100 iscritti riceveranno un bonus di <strong className="text-primary-400">500 HBT</strong> extra 
                  e l'accesso prioritario alla private sale con sconti esclusivi.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-dark rounded-3xl p-8 lg:sticky lg:top-24"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">
                Richiedi Accesso
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-gray-500"
                      placeholder="Mario Rossi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-gray-500"
                      placeholder="mario@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Address (Opzionale)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.wallet}
                      onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-gray-500"
                      placeholder="0x..."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Inserisci il tuo wallet Polygon per ricevere i token
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Messaggio (Opzionale)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 glass rounded-lg border border-white/10 focus:border-primary-500 focus:outline-none text-white placeholder-gray-500 resize-none"
                      placeholder="Raccontaci la tua esperienza nel mining o perché vuoi partecipare..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner mr-3"></div>
                      Invio in corso...
                    </span>
                  ) : (
                    'Invia Richiesta'
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Compilando il form accetti i nostri termini e condizioni e la privacy policy
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
