'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [referralCode, setReferralCode] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Rileva referral code da URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  // Genera captcha
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: '' });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome richiesto';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (formData.phone && !/^(\+39)?[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numero non valido';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimo 8 caratteri';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Deve contenere almeno 1 numero';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    if (!captcha.answer) {
      newErrors.captcha = 'Completa il captcha';
    } else if (parseInt(captcha.answer) !== (captcha.num1 + captcha.num2)) {
      newErrors.captcha = 'Risposta errata';
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
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        referredBy: referralCode || undefined,
      });
    } catch (error) {
      // Errore già gestito nel context con toast
      generateCaptcha(); // Rigenera captcha dopo errore
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
              Crea Account
            </h1>
            <p className="text-gray-400">
              Unisciti a HashBurst Token e inizia a minare
            </p>
          </div>

          {referralCode && (
            <div className="glass rounded-xl p-4 mb-6 border border-primary-500/30">
              <div className="flex items-center gap-2 text-primary-400 mb-1">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Referral Code Applicato!</span>
              </div>
              <p className="text-sm text-gray-300">
                Codice: <strong>{referralCode}</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 glass rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white`}
                  placeholder="Mario Rossi"
                />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
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

            {/* Telefono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cellulare (Opzionale)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 glass rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white`}
                  placeholder="+39 123 456 7890"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password *
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
              <p className="text-xs text-gray-500 mt-1">
                Minimo 8 caratteri, almeno 1 numero
              </p>
            </div>

            {/* Conferma Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conferma Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 glass rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Captcha Antibot */}
            <div className="glass rounded-xl p-4 border border-primary-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary-400" />
                <label className="text-sm font-medium text-gray-300">
                  Verifica Antibot *
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white">
                  {captcha.num1} + {captcha.num2} =
                </div>
                <input
                  type="number"
                  value={captcha.answer}
                  onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
                  className={`w-24 px-4 py-2 glass rounded-lg border ${
                    errors.captcha ? 'border-red-500' : 'border-white/10'
                  } focus:border-primary-500 focus:outline-none text-white text-center`}
                  placeholder="?"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-sm text-primary-400 hover:text-primary-300"
                >
                  Rigenera
                </button>
              </div>
              {errors.captcha && <p className="text-red-400 text-sm mt-2">{errors.captcha}</p>}
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
                  Registrazione...
                </span>
              ) : (
                'Crea Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Hai già un account?{' '}
              <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
