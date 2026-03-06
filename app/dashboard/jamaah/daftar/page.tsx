'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jamaahService } from '@/services/jamaah.service';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Pricing constants
const PACKAGES = {
    reguler: { name: 'Paket Reguler', price: 25000000 },
    silver: { name: 'Paket Silver', price: 30000000 },
    gold: { name: 'Paket Gold', price: 35000000 },
    vip: { name: 'Paket VIP', price: 45000000 },
};

const ROOM_TYPES = {
    '4_person': { name: '4 Orang per Kamar', price: 0 },
    '3_person': { name: '3 Orang per Kamar', price: 3000000 },
    '2_person': { name: '2 Orang per Kamar', price: 7000000 },
};

const TOUR_OPTIONS = {
    none: { name: 'Tanpa Tambahan Wisata', price: 0 },
    '1_location': { name: '1 Lokasi Wisata', price: 2000000 },
};

export default function DaftarJamaahPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        full_name: '',
        ktp_number: '',
        phone: '',
        email: '',
        address: '',
        passport_number: '',
        package_type: 'reguler',
        room_type: '4_person',
        additional_tour: 'none',
    });

    // File states
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [vaccineFile, setVaccineFile] = useState<File | null>(null);

    // Calculate prices
    const calculatePrices = () => {
        const basePrice = PACKAGES[formData.package_type as keyof typeof PACKAGES]?.price || 0;
        const roomPrice = ROOM_TYPES[formData.room_type as keyof typeof ROOM_TYPES]?.price || 0;
        const tourPrice = TOUR_OPTIONS[formData.additional_tour as keyof typeof TOUR_OPTIONS]?.price || 0;

        return {
            base_price: basePrice,
            room_upgrade_price: roomPrice,
            tour_price: tourPrice,
            total_price: basePrice + roomPrice + tourPrice,
        };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'ktp' | 'passport' | 'vaccine') => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB');
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setError('Format file harus JPG, PNG, atau PDF');
                return;
            }

            if (fileType === 'ktp') setKtpFile(file);
            if (fileType === 'passport') setPassportFile(file);
            if (fileType === 'vaccine') setVaccineFile(file);
            setError('');
        }
    };

    const validateStep = (step: number) => {
        setError('');

        if (step === 1) {
            if (!formData.full_name || !formData.phone) {
                setError('Nama lengkap dan nomor telepon wajib diisi');
                return false;
            }
            if (formData.phone && !/^08\d{8,11}$/.test(formData.phone)) {
                setError('Format nomor telepon tidak valid (contoh: 081234567890)');
                return false;
            }
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Format email tidak valid');
                return false;
            }
        }

        if (step === 2) {
            if (!formData.passport_number) {
                setError('Nomor paspor wajib diisi');
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setError('');
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setLoading(true);
        setError('');

        try {
            const tenantId = localStorage.getItem('tenant_id');
            if (!tenantId) {
                throw new Error('Tenant ID tidak ditemukan');
            }

            // Upload files to Supabase (optional - skip if Supabase not configured)
            let ktpUrl = '';
            let passportUrl = '';
            let vaccineUrl = '';

            const timestamp = Date.now();

            try {
                if (ktpFile) {
                    ktpUrl = await uploadToCloudinary(ktpFile, 'ktp');
                }

                if (passportFile) {
                    passportUrl = await uploadToCloudinary(passportFile, 'passport');
                }

                if (vaccineFile) {
                    vaccineUrl = await uploadToCloudinary(vaccineFile, 'vaccine');
                }
            } catch (uploadError) {
                console.warn('File upload skipped (Cloudinary not configured):', uploadError);
                // Continue without file URLs - files are optional
            }

            // Calculate prices
            const prices = calculatePrices();

            // Create jamaah
            await jamaahService.create({
                ...formData,
                tenant_id: tenantId,
                ktp_image_url: ktpUrl || undefined,
                passport_image_url: passportUrl || undefined,
                vaccine_certificate_url: vaccineUrl || undefined,
                ...prices,
            });

            alert('Pendaftaran jamaah berhasil!');
            router.push('/dashboard/jamaah');
        } catch (err: any) {
            console.error('Error creating jamaah:', err);
            setError(err.response?.data?.message || 'Gagal mendaftarkan jamaah');
        } finally {
            setLoading(false);
        }
    };

    const prices = calculatePrices();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pendaftaran Jamaah</h1>
                    <p className="text-gray-600 mb-8">Lengkapi data pendaftaran jamaah umroh</p>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Data Pribadi */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Data Pribadi</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor KTP
                                </label>
                                <input
                                    type="text"
                                    name="ktp_number"
                                    value={formData.ktp_number}
                                    onChange={handleInputChange}
                                    maxLength={16}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="16 digit nomor KTP"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Foto KTP
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(e) => handleFileChange(e, 'ktp')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                {ktpFile && (
                                    <p className="mt-2 text-sm text-gray-600">File: {ktpFile.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telepon <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="081234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Masukkan alamat lengkap"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Lanjut →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Dokumen */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Dokumen Perjalanan</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Paspor <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="passport_number"
                                    value={formData.passport_number}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Masukkan nomor paspor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Foto Paspor
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(e) => handleFileChange(e, 'passport')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                {passportFile && (
                                    <p className="mt-2 text-sm text-gray-600">File: {passportFile.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Sertifikat Vaksin
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={(e) => handleFileChange(e, 'vaccine')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                {vaccineFile && (
                                    <p className="mt-2 text-sm text-gray-600">File: {vaccineFile.name}</p>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    ← Kembali
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Lanjut →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Paket & Harga */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Paket & Harga</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Pilih Paket Umroh <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {Object.entries(PACKAGES).map(([key, pkg]) => (
                                        <label key={key} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="package_type"
                                                value={key}
                                                checked={formData.package_type === key}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-emerald-600"
                                            />
                                            <span className="ml-3 flex-1 font-medium">{pkg.name}</span>
                                            <span className="text-emerald-600 font-semibold">{formatCurrency(pkg.price)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Tipe Kamar <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {Object.entries(ROOM_TYPES).map(([key, room]) => (
                                        <label key={key} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="room_type"
                                                value={key}
                                                checked={formData.room_type === key}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-emerald-600"
                                            />
                                            <span className="ml-3 flex-1 font-medium">{room.name}</span>
                                            <span className="text-emerald-600 font-semibold">
                                                {room.price === 0 ? 'Gratis' : `+ ${formatCurrency(room.price)}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Tambahan Wisata <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {Object.entries(TOUR_OPTIONS).map(([key, tour]) => (
                                        <label key={key} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="additional_tour"
                                                value={key}
                                                checked={formData.additional_tour === key}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-emerald-600"
                                            />
                                            <span className="ml-3 flex-1 font-medium">{tour.name}</span>
                                            <span className="text-emerald-600 font-semibold">
                                                {tour.price === 0 ? 'Gratis' : `+ ${formatCurrency(tour.price)}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rincian Harga</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Harga Paket:</span>
                                        <span className="font-medium">{formatCurrency(prices.base_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Upgrade Kamar:</span>
                                        <span className="font-medium">{formatCurrency(prices.room_upgrade_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tambahan Wisata:</span>
                                        <span className="font-medium">{formatCurrency(prices.tour_price)}</span>
                                    </div>
                                    <div className="border-t border-emerald-300 pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold text-emerald-700">
                                            <span>TOTAL:</span>
                                            <span>{formatCurrency(prices.total_price)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    ← Kembali
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Lanjut →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Konfirmasi */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 4: Konfirmasi</h2>

                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Data Pribadi</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Lengkap</p>
                                        <p className="font-medium">{formData.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nomor KTP</p>
                                        <p className="font-medium">{formData.ktp_number || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Telepon</p>
                                        <p className="font-medium">{formData.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{formData.email || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Alamat</p>
                                        <p className="font-medium">{formData.address || '-'}</p>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-800 mb-3 mt-6">Dokumen</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nomor Paspor</p>
                                        <p className="font-medium">{formData.passport_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Foto KTP</p>
                                        <p className="font-medium">{ktpFile ? '✓ Uploaded' : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Foto Paspor</p>
                                        <p className="font-medium">{passportFile ? '✓ Uploaded' : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Sertifikat Vaksin</p>
                                        <p className="font-medium">{vaccineFile ? '✓ Uploaded' : '-'}</p>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-800 mb-3 mt-6">Paket & Harga</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Paket</p>
                                        <p className="font-medium">{PACKAGES[formData.package_type as keyof typeof PACKAGES]?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tipe Kamar</p>
                                        <p className="font-medium">{ROOM_TYPES[formData.room_type as keyof typeof ROOM_TYPES]?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tambahan Wisata</p>
                                        <p className="font-medium">{TOUR_OPTIONS[formData.additional_tour as keyof typeof TOUR_OPTIONS]?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">TOTAL BAYAR:</span>
                                    <span className="text-2xl font-bold text-emerald-700">{formatCurrency(prices.total_price)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    disabled={loading}
                                >
                                    ← Kembali
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Memproses...' : 'Daftar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
