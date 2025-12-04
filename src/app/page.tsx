import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-4xl">
        <Zap className="w-20 h-20 mx-auto mb-6 text-blue-400" />
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            HashBurst
          </span>
        </h1>
        <p className="text-2xl text-gray-400 mb-8">
          Bitcoin Mining Token
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
