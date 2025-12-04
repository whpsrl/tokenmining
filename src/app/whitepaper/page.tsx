'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 hover:text-white transition">Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="btn-secondary text-sm">
                <Download className="inline w-4 h-4 mr-2" />
                Scarica PDF
              </button>
              <button className="btn-secondary text-sm">
                <Share2 className="inline w-4 h-4 mr-2" />
                Condividi
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              HashBurst Token <span className="gradient-text">Whitepaper</span>
            </h1>
            <p className="text-xl text-gray-400">
              Versione 1.0 - Gennaio 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-3xl p-12 space-y-12"
          >
            {/* Abstract */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Abstract</h2>
              <p className="text-gray-300 leading-relaxed">
                HashBurst Token (HBT) è un token ERC-20 innovativo basato su Polygon che rappresenta 
                un sistema rivoluzionario di cloud mining AI-powered. Attraverso una rete geo-distribuita 
                di oltre 950 macchine mining e server HPC, HashBurst garantisce rewards reali e sostenibili 
                basati sul mining di 8+ criptovalute principali (BTC, XMR, ETH, LTC, DASH, ETC, DOGE, RVN).
              </p>
            </section>

            {/* Problema */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">1. Il Problema</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Il mercato crypto è saturo di token senza valore reale sottostante. La maggior parte 
                dei progetti promette rendimenti elevati senza asset tangibili o infrastrutture reali.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-primary-400">•</span>
                  <span>Token speculativi senza utility reale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400">•</span>
                  <span>Mining centralizzato e poco efficiente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400">•</span>
                  <span>Mancanza di protezioni contro dump e whale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-400">•</span>
                  <span>Distribuzione iniqua dei rewards</span>
                </li>
              </ul>
            </section>

            {/* Soluzione */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">2. La Soluzione HashBurst</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                HashBurst combina tecnologia blockchain, AI e infrastruttura mining reale per creare 
                un ecosistema sostenibile e profittevole.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-white">2.1 Tecnologia AI-Powered</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Il sistema HashBurst utilizza algoritmi AI per ottimizzare in tempo reale la 
                distribuzione della potenza di calcolo tra 59+ mining pool, selezionando 
                automaticamente le 15 più profittevoli.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-white">2.2 Network Geo-Distribuito</h3>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li>• 950+ Macchine Retail attive</li>
                <li>• Server HPC (HPE Cray series)</li>
                <li>• Master Nodes ottimizzati</li>
                <li>• Connettività globale low-latency</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-3 text-white">2.3 Multi-Coin Mining</h3>
              <p className="text-gray-300 leading-relaxed">
                HashBurst mina simultaneamente 8+ criptovalute con un valore combinato stimato 
                di oltre $16,000 USDT giornalieri.
              </p>
            </section>

            {/* Tokenomics */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">3. Tokenomics</h2>
              
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Supply Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Mining Rewards</span>
                    <span className="text-white font-bold">40% (400M HBT)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Private Sale</span>
                    <span className="text-white font-bold">30% (300M HBT)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Liquidity Pool</span>
                    <span className="text-white font-bold">15% (150M HBT)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Team (Locked 2 years)</span>
                    <span className="text-white font-bold">10% (100M HBT)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Marketing</span>
                    <span className="text-white font-bold">5% (50M HBT)</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Supply</span>
                      <span className="text-primary-400 font-bold text-lg">1,000,000,000 HBT</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-white">3.1 Anti-Dump Mechanism</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Per proteggere il valore del token, HashBurst implementa un sistema anti-dump che 
                limita le vendite al 5% del balance mensile per wallet.
              </p>

              <h3 className="text-2xl font-semibold mb-3 text-white">3.2 Anti-Whale Protection</h3>
              <p className="text-gray-300 leading-relaxed">
                Gli acquisti sono limitati allo 0.1% della supply totale (o 0.001% configurabile) 
                per un periodo di 12 mesi, garantendo una distribuzione equa.
              </p>
            </section>

            {/* Roadmap */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">4. Roadmap</h2>
              
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Q1 2025 - Launch</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>✅ Smart Contract Deployment</li>
                    <li>✅ Private Sale</li>
                    <li>✅ Website & Dashboard Launch</li>
                    <li>✅ Initial Mining Operations</li>
                  </ul>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Q2 2025 - Expansion</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>🔄 DEX Listing (Uniswap/Quickswap)</li>
                    <li>🔄 Staking Platform Launch</li>
                    <li>🔄 Mobile App Development</li>
                    <li>🔄 Expansion to 1500+ Mining Machines</li>
                  </ul>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Q3 2025 - Optimization</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>🎯 CEX Listings</li>
                    <li>🎯 DAO Governance Implementation</li>
                    <li>🎯 Advanced AI Algorithms v2</li>
                    <li>🎯 Multi-Chain Bridge (ETH, BSC)</li>
                  </ul>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Q4 2025 - Ecosystem</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>🎯 NFT Mining Machines</li>
                    <li>🎯 HashBurst Marketplace</li>
                    <li>🎯 Institutional Partnerships</li>
                    <li>🎯 Global Marketing Campaign</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Team */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">5. Team & Partners</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                HashBurst è supportato da un team esperto in blockchain, AI, e infrastrutture mining 
                con oltre 20 anni di esperienza combinata.
              </p>
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Partners</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Synapta Mining Network</li>
                  <li>• Crypto Verse Infrastructure</li>
                  <li>• ViaBTC Mining Pool</li>
                  <li>• Nanopool</li>
                </ul>
              </div>
            </section>

            {/* Legal */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">6. Legal & Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                HashBurst Token non è un security ma un utility token che garantisce accesso ai 
                servizi della piattaforma. Il progetto rispetta tutte le normative applicabili.
              </p>
              <div className="glass rounded-xl p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-400">
                  <strong className="text-yellow-400">Disclaimer:</strong> L'investimento in criptovalute 
                  comporta rischi. Le performance passate non garantiscono risultati futuri. 
                  Investire solo ciò che si è disposti a perdere.
                </p>
              </div>
            </section>

            {/* Conclusion */}
            <section>
              <h2 className="text-3xl font-bold mb-4 gradient-text">7. Conclusione</h2>
              <p className="text-gray-300 leading-relaxed">
                HashBurst Token rappresenta una nuova era nel mining crypto, combinando tecnologia 
                all'avanguardia con sostenibilità economica. Attraverso un sistema di rewards garantiti, 
                protezioni anti-dump/whale e un'infrastruttura mining reale, HBT offre valore tangibile 
                agli holder e crea un ecosistema equo e profittevole per tutti i partecipanti.
              </p>
            </section>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/dashboard" className="btn-primary text-lg">
              Inizia Ora →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
