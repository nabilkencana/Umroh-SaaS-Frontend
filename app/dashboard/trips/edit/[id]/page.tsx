'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import { motion } from 'framer-motion';
import { tripsService, Trip } from '@/services/trips.service';
import {
    PaperAirplaneIcon,
    CalendarIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    UsersIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    SparklesIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowLeftIcon,
    TrashIcon,
    CameraIcon,
    PlusIcon,
    ClockIcon,
    WifiIcon,
    HomeIcon,
    TruckIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    LanguageIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

export default function EditTripPage() {
    const router = useRouter();
    const params = useParams();
    const tripId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        destination: '',
        departure_date: '',
        return_date: '',
        capacity: 0,
        price: 0,
        status: 'upcoming',
        package_type: 'Reguler',
        organizer: 'PT. Amanah Travel',
        airline: 'Garuda Indonesia',
        hotel_rating: 5,
        inclusions: [] as string[],
        exclusions: [] as string[],
        itinerary: [] as { day: number; title: string; description: string; location: string }[],
        images: [] as string[],
        contact_person: '',
        contact_phone: '',
        notes: '',
    });

    // Daftar fasilitas yang tersedia
    const availableFacilities = [
        { id: 'hotel', name: 'Hotel Bintang 5', icon: HomeIcon },
        { id: 'transport', name: 'Transport AC', icon: TruckIcon },
        { id: 'meal', name: 'Makan 3x Sehari', icon: HeartIcon },
        { id: 'guide', name: 'Tour Guide', icon: UserGroupIcon },
        { id: 'visa', name: 'Visa', icon: DocumentTextIcon },
        { id: 'insurance', name: 'Asuransi', icon: ShieldCheckIcon },
        { id: 'wifi', name: 'WiFi Gratis', icon: WifiIcon },
        { id: 'language', name: 'Penerjemah', icon: LanguageIcon },
    ];

    // Daftar status
    const statusOptions = [
        { value: 'upcoming', label: 'Akan Datang', color: 'blue' },
        { value: 'ongoing', label: 'Sedang Berlangsung', color: 'green' },
        { value: 'completed', label: 'Selesai', color: 'gray' },
        { value: 'cancelled', label: 'Dibatalkan', color: 'red' },
    ];

    // Load trip data
    useEffect(() => {
        loadTripData();
    }, [tripId]);

    const loadTripData = async () => {
        try {
            setLoading(true);
            // Load real data from API
            const trip = await tripsService.getById(tripId);

            // Parse JSON strings if needed and format dates
            const parsedTrip = {
                ...trip,
                // Format dates to YYYY-MM-DD for input fields
                departure_date: trip.departure_date ? new Date(trip.departure_date).toISOString().split('T')[0] : '',
                return_date: trip.return_date ? new Date(trip.return_date).toISOString().split('T')[0] : '',
                // Parse JSON fields
                inclusions: trip.inclusions ? JSON.parse(trip.inclusions) : [],
                exclusions: trip.exclusions ? JSON.parse(trip.exclusions) : [],
                itinerary: trip.itinerary ? JSON.parse(trip.itinerary) : [],
                images: trip.images ? JSON.parse(trip.images) : [],
                // Ensure price is a number
                price: typeof trip.price === 'string' ? parseFloat(trip.price) : trip.price,
                // Convert null values to empty strings for input fields
                description: trip.description || '',
                contact_person: trip.contact_person || '',
                contact_phone: trip.contact_phone || '',
                notes: trip.notes || '',
                organizer: trip.organizer || 'PT. Amanah Travel',
                airline: trip.airline || 'Garuda Indonesia',
                package_type: trip.package_type || 'Reguler',
                hotel_rating: trip.hotel_rating || 5,
            };

            setFormData(prev => ({ ...prev, ...parsedTrip }));
            console.log('✅ Trip data loaded:', parsedTrip);
        } catch (error) {
            console.error('Failed to load trip:', error);
            alert('Gagal memuat data perjalanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const toggleInclusion = (facilityId: string) => {
        setFormData(prev => ({
            ...prev,
            inclusions: prev.inclusions.includes(facilityId)
                ? prev.inclusions.filter(id => id !== facilityId)
                : [...prev.inclusions, facilityId]
        }));
    };

    

    const handleSave = async () => {
        try {
            setSaving(true);

            // Prepare data - stringify JSON fields
            const updateData = {
                ...formData,
                inclusions: JSON.stringify(formData.inclusions),
                exclusions: JSON.stringify(formData.exclusions),
                itinerary: JSON.stringify(formData.itinerary),
                images: JSON.stringify(formData.images),
            };

            // Update via API
            await tripsService.update(tripId, updateData);
            console.log('✅ Trip updated successfully');

            // Redirect to trips page
            router.push('/dashboard/trips');
        } catch (error) {
            console.error('Failed to save trip:', error);
            alert('Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            // Delete via API
            await tripsService.delete(tripId);
            console.log('✅ Trip deleted successfully');

            // Redirect to trips page
            router.push('/dashboard/trips');
        } catch (error) {
            console.error('Failed to delete trip:', error);
            alert('Gagal menghapus perjalanan. Silakan coba lagi.');
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back button skeleton */}
                        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse mb-6"></div>

                        {/* Header skeleton */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>

                        {/* Tabs skeleton */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Delete Confirmation Modal
    const DeleteModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrashIcon className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Hapus Perjalanan
                </h3>

                <p className="text-gray-500 text-center mb-6">
                    Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900">{formData.name}</span>?
                    Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Menghapus...
                            </>
                        ) : (
                            'Ya, Hapus'
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </motion.button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-2xl flex items-center justify-center text-white">
                                    <PaperAirplaneIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Edit Perjalanan</h1>
                                    <p className="text-gray-500 mt-1">ID: {tripId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] text-sm"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="border-b border-gray-100 px-6">
                            <div className="flex gap-6 overflow-x-auto">
                                {[
                                    { id: 'general', label: 'Informasi Umum', icon: DocumentTextIcon },
                                    { id: 'facilities', label: 'Fasilitas', icon: SparklesIcon },
                                    { id: 'itinerary', label: 'Itinerary', icon: CalendarIcon },
                                    { id: 'media', label: 'Media', icon: CameraIcon },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                                            ? 'border-[#0F5132] text-[#0F5132]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Tab: Informasi Umum */}
                            {activeTab === 'general' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Paket <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="Contoh: Umroh Ramadhan 2026"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all resize-none"
                                            placeholder="Jelaskan detail paket perjalanan..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Destinasi
                                            </label>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                                placeholder="Makkah - Madinah"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipe Paket
                                            </label>
                                            <select
                                                name="package_type"
                                                value={formData.package_type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            >
                                                <option value="Reguler">Reguler</option>
                                                <option value="Silver">Silver</option>
                                                <option value="Gold">Gold</option>
                                                <option value="VIP">VIP</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Berangkat
                                            </label>
                                            <input
                                                type="date"
                                                name="departure_date"
                                                value={formData.departure_date}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tanggal Pulang
                                            </label>
                                            <input
                                                type="date"
                                                name="return_date"
                                                value={formData.return_date}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kapasitas
                                            </label>
                                            <input
                                                type="number"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleNumberChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Harga
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                                                <input
                                                    type="text"
                                                    name="price"
                                                    value={formData.price.toLocaleString('id-ID')}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, '');
                                                        setFormData(prev => ({ ...prev, price: parseInt(raw) || 0 }));
                                                    }}
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Organizer
                                            </label>
                                            <input
                                                type="text"
                                                name="organizer"
                                                value={formData.organizer}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maskapai
                                            </label>
                                            <input
                                                type="text"
                                                name="airline"
                                                value={formData.airline}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kontak Person
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="contact_person"
                                                value={formData.contact_person}
                                                onChange={handleInputChange}
                                                placeholder="Nama"
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                            <input
                                                type="text"
                                                name="contact_phone"
                                                value={formData.contact_phone}
                                                onChange={handleInputChange}
                                                placeholder="Nomor Telepon"
                                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Catatan
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all resize-none"
                                            placeholder="Catatan penting untuk jamaah..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tab: Fasilitas */}
                            {activeTab === 'facilities' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Fasilitas Termasuk
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {availableFacilities.map(facility => {
                                                const Icon = facility.icon;
                                                const isSelected = formData.inclusions.includes(facility.id);

                                                return (
                                                    <button
                                                        key={facility.id}
                                                        onClick={() => toggleInclusion(facility.id)}
                                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected
                                                            ? 'border-[#0F5132] bg-[#0F5132]/5'
                                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                                            }`}
                                                    >
                                                        <Icon className={`w-6 h-6 ${isSelected ? 'text-[#0F5132]' : 'text-gray-400'}`} />
                                                        <span className={`text-xs font-medium ${isSelected ? 'text-[#0F5132]' : 'text-gray-600'}`}>
                                                            {facility.name}
                                                        </span>
                                                        {isSelected && (
                                                            <CheckCircleIcon className="w-4 h-4 text-[#0F5132] absolute top-2 right-2" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating Hotel
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(rating => (
                                                <button
                                                    key={rating}
                                                    onClick={() => setFormData(prev => ({ ...prev, hotel_rating: rating }))}
                                                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${formData.hotel_rating === rating
                                                        ? 'border-[#0F5132] bg-[#0F5132]/5 text-[#0F5132]'
                                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {rating}★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tidak Termasuk
                                        </label>
                                        <div className="space-y-2">
                                            {formData.exclusions.map((exclusion, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={exclusion}
                                                        onChange={(e) => {
                                                            const newExclusions = [...formData.exclusions];
                                                            newExclusions[index] = e.target.value;
                                                            setFormData(prev => ({ ...prev, exclusions: newExclusions }));
                                                        }}
                                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0F5132]"
                                                        placeholder="Contoh: Pengeluaran pribadi"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newExclusions = formData.exclusions.filter((_, i) => i !== index);
                                                            setFormData(prev => ({ ...prev, exclusions: newExclusions }));
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    exclusions: [...prev.exclusions, '']
                                                }))}
                                                className="flex items-center gap-2 text-[#0F5132] hover:text-[#1B8C5E] transition-colors text-sm font-medium"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                                Tambah pengecualian
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Itinerary */}
                            {activeTab === 'itinerary' && (
                                <div className="space-y-4">
                                    {formData.itinerary.map((item, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-500">Hari {item.day}</span>
                                                <button
                                                    onClick={() => {
                                                        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
                                                        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].title = e.target.value;
                                                    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                }}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-[#0F5132]"
                                                placeholder="Judul kegiatan"
                                            />
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].description = e.target.value;
                                                    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                }}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-[#0F5132] resize-none"
                                                placeholder="Deskripsi kegiatan"
                                            />
                                            <input
                                                type="text"
                                                value={item.location}
                                                onChange={(e) => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].location = e.target.value;
                                                    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                }}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0F5132]"
                                                placeholder="Lokasi"
                                            />
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            const newDay = formData.itinerary.length + 1;
                                            setFormData(prev => ({
                                                ...prev,
                                                itinerary: [
                                                    ...prev.itinerary,
                                                    { day: newDay, title: '', description: '', location: '' }
                                                ]
                                            }));
                                        }}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#0F5132] hover:text-[#0F5132] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Tambah Hari
                                    </button>
                                </div>
                            )}

                            {/* Tab: Media */}
                            {activeTab === 'media' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div
                                                key={i}
                                                className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#0F5132] hover:text-[#0F5132] transition-colors cursor-pointer"
                                            >
                                                <CameraIcon className="w-8 h-8 mb-2" />
                                                <span className="text-xs">Upload Gambar</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">
                                        Format: JPG, PNG. Maksimal 2MB per gambar
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 p-6 bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.back()}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && <DeleteModal />}
            </div>
        </DashboardLayout>
    );
}