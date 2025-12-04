'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Errore già gestito nel context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
          <ArrowLeft className="w-5 h-5" />
          Torna alla Home
        </Link>

        <div className="glass-dark rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bentornato!
            </h1>
            <p className="text-gray-400">
              Accedi al tuo account HashBurst
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 glass rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white`}
                  placeholder="mario@email.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 glass rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Password dimenticata */}
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                Password dimenticata?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner mr-3"></div>
                  Accesso...
                </span>
              ) : (
                'Accedi'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Non hai un account?{' '}
              <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                Registrati
              </Link>
            </p>
          </div>

          {/* Social Login (futuro) */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-gray-500 mb-4">Oppure continua con</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="glass rounded-lg py-3 px-4 hover:bg-white/10 transition text-sm text-gray-400 disabled:opacity-50" disabled>
                Google (Presto)
              </button>
              <button className="glass rounded-lg py-3 px-4 hover:bg-white/10 transition text-sm text-gray-400 disabled:opacity-50" disabled>
                MetaMask (Presto)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
