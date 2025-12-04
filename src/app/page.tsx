'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold gradient-text">HashBurst</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-white/70 hover:text-white transition">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Buy Tokens.</span>
              <br />
              <span className="text-white">Own Real Hardware.</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              HashBurst token holders own real Bitcoin mining hardware. 
              Your tokens represent actual mining power generating Bitcoin 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary px-8 py-4 text-lg rounded-lg">
                Buy Tokens Now
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Link>
              <Link href="/whitepaper" className="btn-secondary px-8 py-4 text-lg rounded-lg">
                Read Whitepaper
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: 'Monthly Revenue', value: '$77,000+', icon: TrendingUp },
              { label: 'Hash Power', value: '14,000 TH/s', icon: Cpu },
              { label: 'Tokens Burned', value: '125,000+', icon: Award },
              { label: 'Token Holders', value: '2,847', icon: Users }
            ].map((stat, index) => (
              <div key={index} className="card-dark p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">Simple.</span> Transparent. Profitable.
          </h2>
          <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
            Buy HashBurst tokens and automatically own a share of real Bitcoin mining hardware.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: '1. Buy Tokens',
                description: 'Purchase HashBurst tokens during our token sale. Starting at $0.06 per token.'
              },
              {
                icon: Cpu,
                title: '2. Own Hardware',
                description: 'Your tokens represent ownership of real mining equipment generating Bitcoin.'
              },
              {
                icon: TrendingUp,
                title: '3. Earn Bitcoin',
                description: 'Mining revenue is used to buy back and burn tokens, increasing your share value.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="card-dark p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-400/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Sale */}
      <section className="py-20 px-6 bg-gradient-to-b from-dark-100 to-dark-50">
        <div className="container mx-auto max-w-4xl">
          <div className="card-dark p-12">
            <h2 className="text-4xl font-bold text-center mb-4">
              Token Sale - <span className="gradient-text">3 Phases</span>
            </h2>
            <p className="text-center text-white/70 mb-12">
              Early investors get the best price. Price increases with each phase.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { phase: 'Phase 1', price: '$0.06', status: 'Active', color: 'primary' },
                { phase: 'Phase 2', price: '$0.10', status: 'Coming', color: 'accent' },
                { phase: 'Phase 3', price: '$0.15', status: 'Coming', color: 'white' }
              ].map((phase, index) => (
                <div key={index} className={`p-6 rounded-xl border-2 ${
                  phase.status === 'Active' 
                    ? 'border-primary-400 bg-primary-400/5' 
                    : 'border-white/10 bg-white/5'
                }`}>
                  <div className="text-sm text-white/60 mb-2">{phase.phase}</div>
                  <div className="text-3xl font-bold text-white mb-2">{phase.price}</div>
                  <div className={`text-sm ${
                    phase.status === 'Active' ? 'text-primary-400' : 'text-white/40'
                  }`}>
                    {phase.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/signup" className="btn-primary px-12 py-4 text-lg rounded-lg inline-flex items-center">
                Buy Tokens Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why <span className="gradient-text">HashBurst?</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Real Hardware',
                description: 'Your tokens represent ownership of actual Bitcoin mining equipment, not promises.'
              },
              {
                icon: Lock,
                title: 'Transparent',
                description: 'All mining operations and revenue are tracked and reported publicly on-chain.'
              },
              {
                icon: TrendingUp,
                title: 'Deflationary',
                description: 'Mining profits buy back and burn tokens, reducing supply and increasing value.'
              },
              {
                icon: Cpu,
                title: '14,000 TH/s',
                description: 'Industrial-scale mining operation with enterprise-grade hardware and optimization.'
              },
              {
                icon: Award,
                title: 'Staking Rewards',
                description: 'Stake your tokens for up to 2x bonus on future mining distributions.'
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Token holders vote on major decisions affecting the mining operation.'
              }
            ].map((feature, index) => (
              <div key={index} className="card-dark p-6">
                <feature.icon className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="card-dark p-12 text-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-400/20">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start <span className="gradient-text">Mining Bitcoin?</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join 2,847 token holders who own real Bitcoin mining hardware.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary px-10 py-4 text-lg rounded-lg">
                Get Started Now
              </Link>
              <Link href="/whitepaper" className="btn-secondary px-10 py-4 text-lg rounded-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold gradient-text">HashBurst</span>
              </div>
              <p className="text-white/60 text-sm">
                Real Bitcoin mining hardware tokenized for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/token-sale">Token Sale</Link></li>
                <li><Link href="/staking">Staking</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/whitepaper">Whitepaper</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
            © 2024 HashBurst. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
