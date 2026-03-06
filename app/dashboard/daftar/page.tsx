'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Register user with backend - default role is JAMAAH
            await authService.register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                tenant_name: formData.company,
                phone: formData.phone,
                role: 'JAMAAH', // Default role for new registration
            });

            // Show success message
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/dashboard/login?registered=true');
            }, 2000);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        setIsGoogleLoading(true);

        // Simulasi registrasi dengan Google
        setTimeout(() => {
            setIsGoogleLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    const passwordsMatch = formData.password === formData.confirmPassword;
    const isPasswordValid = formData.password.length >= 8;
    const isFormValid =
        formData.name &&
        formData.email &&
        formData.phone &&
        formData.company &&
        formData.password &&
        passwordsMatch &&
        isPasswordValid &&
        agreed;

    return (
        <div className="islamic-pattern flex min-h-screen items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Panel - Branding */}
                    <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#0F5132] to-[#1B5E20] p-10 text-white md:flex overflow-hidden">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="10" cy="10" r="2" fill="white" />
                                </pattern>
                                <rect x="0" y="0" width="100" height="100" fill="url(#pattern)" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="mb-3 text-sm uppercase tracking-wider text-[#D4AF37] font-semibold">Umroh SaaS</p>
                                <h2 className="text-3xl font-bold leading-tight">Mulai Kelola Operasional Umroh Anda</h2>
                                <p className="mt-4 text-emerald-100">Daftar sekarang dan nikmati fitur lengkap untuk manajemen travel umroh.</p>
                            </motion.div>

                            {/* Benefits List */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 space-y-3"
                            >
                                {[
                                    'Gratis 14 hari trial',
                                    'Support 24/7',
                                    'Update fitur rutin',
                                    'Data tersimpan aman'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-sm text-emerald-100">{benefit}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative z-10 text-sm text-emerald-100"
                        >
                            Bergabung dengan 500+ travel umroh di Indonesia
                        </motion.p>
                    </div>

                    {/* Right Panel - Sign Up Form */}
                    <div className="p-8 md:p-10 max-h-[600px] overflow-y-auto">
                        <div className="mb-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mb-3 text-5xl"
                            >
                                ✨
                            </motion.div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">
                                Daftar Akun
                            </h1>
                            <p className="text-gray-600 mt-2">Isi data Anda untuk memulai</p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                            >
                                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">Pendaftaran Berhasil!</p>
                                    <p className="text-xs text-green-600 mt-1">Anda akan diarahkan ke halaman login...</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                            >
                                <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-800">Pendaftaran Gagal</p>
                                    <p className="text-xs text-red-600 mt-1">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Google Sign Up Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleSignup}
                            disabled={isGoogleLoading}
                            className="w-full mb-4 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-700 font-medium">Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Lanjutkan dengan Google</span>
                                </>
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">atau daftar dengan email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                                <div className="relative">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* No. Telepon */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">No. Telepon</label>
                                <div className="relative">
                                    <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="08123456789"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Nama Perusahaan */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Nama Perusahaan</label>
                                <div className="relative">
                                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="Nama perusahaan travel"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formData.password && !isPasswordValid && (
                                    <p className="text-xs text-red-500 mt-1">Password minimal 8 karakter</p>
                                )}
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Konfirmasi Password</label>
                                <div className="relative">
                                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 pl-10 pr-12 py-3 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] transition-colors"
                                        placeholder="Masukkan ulang password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formData.confirmPassword && !passwordsMatch && (
                                    <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-4 h-4 mt-1 text-[#0F5132] rounded focus:ring-[#0F5132]"
                                />
                                <label htmlFor="agree" className="text-sm text-gray-600">
                                    Saya menyetujui{' '}
                                    <Link href="/terms" className="text-[#0F5132] hover:text-[#1B8C5E] font-medium">
                                        Syarat & Ketentuan
                                    </Link>{' '}
                                    dan{' '}
                                    <Link href="/privacy" className="text-[#0F5132] hover:text-[#1B8C5E] font-medium">
                                        Kebijakan Privasi
                                    </Link>
                                </label>
                            </div>

                            <motion.button
                                whileHover={isFormValid ? { scale: 1.02 } : {}}
                                whileTap={isFormValid ? { scale: 0.98 } : {}}
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className="w-full rounded-xl bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] py-3 font-bold text-white hover:from-[#1B8C5E] hover:to-[#0F5132] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Daftar Sekarang</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href="/dashboard/login" className="font-semibold text-[#0F5132] hover:text-[#1B8C5E] underline underline-offset-2">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#0F5132] transition-colors flex items-center justify-center gap-1">
                                <span>←</span>
                                <span>Kembali ke Beranda</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}