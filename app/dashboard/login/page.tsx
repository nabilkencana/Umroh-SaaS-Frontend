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
        // Mock login - redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center islamic-pattern">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-[#D4AF37]">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🕌</div>
                    <h1 className="text-3xl font-bold text-[#0F5132] mb-2">Umroh SaaS</h1>
                    <p className="text-gray-600">Login ke Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0F5132] text-white py-3 rounded-lg font-bold hover:bg-[#1B5E20] transition-colors"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-[#0F5132] hover:text-[#1B5E20] font-semibold">
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
