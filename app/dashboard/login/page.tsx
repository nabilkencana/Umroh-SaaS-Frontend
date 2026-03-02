'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="islamic-pattern flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-[#0F5132] to-[#1B5E20] p-10 text-white md:flex">
            <div>
              <p className="mb-3 text-sm uppercase tracking-wider text-[#D4AF37]">Umroh SaaS</p>
              <h2 className="text-3xl font-bold leading-tight">Kelola Operasional Umroh Lebih Mudah</h2>
              <p className="mt-4 text-emerald-100">Akses dashboard untuk monitoring jamaah, tracking, promo, dan analitik.</p>
            </div>
            <p className="text-sm text-emerald-100">Trusted by travel umroh di Indonesia 🇮🇩</p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="mb-3 text-5xl">🕌</div>
              <h1 className="text-3xl font-bold text-[#0F5132]">Masuk Dashboard</h1>
              <p className="text-gray-600">Silakan login untuk melanjutkan</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="w-full rounded-lg bg-[#0F5132] py-3 font-bold text-white hover:bg-[#1B5E20]">
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="font-semibold text-[#0F5132] hover:text-[#1B5E20]">
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
