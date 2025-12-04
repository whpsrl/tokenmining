'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/');
      return;
    }
    
    setUser({ id: userId, email: 'user@example.com' });
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Link
              href="/affiliates"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded transition"
            >
              Affiliati
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-2">Token Balance</div>
            <div className="text-3xl font-bold">0 HBT</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-2">Mining Power</div>
            <div className="text-3xl font-bold">0 GH/s</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-2">Referral Earnings</div>
            <div className="text-3xl font-bold text-green-400">$0.00</div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-semibold transition">
              Buy Tokens
            </button>
            <Link
              href="/affiliates"
              className="bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-semibold transition text-center"
            >
              View Referral Stats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
