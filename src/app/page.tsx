'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referralCode })
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage('✅ Registrazione completata! Accedi ora.');
        setShowSignup(false);
        setShowLogin(true);
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Errore di connessione');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('userId', data.userId);
        router.push('/dashboard');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Errore di connessione');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          HashBurst Token
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Mining AI-Powered con Referral a 3 Livelli
        </p>
        
        {!showSignup && !showLogin && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
            >
              Registrati
            </button>
          </div>
        )}
      </div>

      {showSignup && (
        <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Registrazione</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Codice Referral (opzionale)</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-4 py-2"
              />
            </div>
            {message && (
              <div className="text-sm p-3 bg-gray-800 rounded">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Caricamento...' : 'Registrati'}
            </button>
            <button
              type="button"
              onClick={() => { setShowSignup(false); setMessage(''); }}
              className="w-full text-gray-400 hover:text-white text-sm"
            >
              Annulla
            </button>
          </form>
        </div>
      )}

      {showLogin && (
        <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-4 py-2"
                required
              />
            </div>
            {message && (
              <div className="text-sm p-3 bg-gray-800 rounded">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Caricamento...' : 'Accedi'}
            </button>
            <button
              type="button"
              onClick={() => { setShowLogin(false); setMessage(''); }}
              className="w-full text-gray-400 hover:text-white text-sm"
            >
              Annulla
            </button>
          </form>
        </div>
      )}

      {!showSignup && !showLogin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Mining AI</h3>
            <p className="text-gray-400">950+ macchine attive con algoritmi ottimizzati</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">3 Livelli</h3>
            <p className="text-gray-400">Guadagna 10%, 5%, 2.5% sui referral</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Instant</h3>
            <p className="text-gray-400">Commissioni calcolate automaticamente</p>
          </div>
        </div>
      )}
    </div>
  );
}
