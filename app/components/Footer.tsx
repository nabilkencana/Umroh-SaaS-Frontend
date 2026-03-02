export default function Footer() {
    return (
        <footer className="bg-[#0F5132] text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Umroh SaaS</h3>
                        <p className="text-sm text-gray-300">
                            Platform manajemen umroh multi-tenant terpercaya untuk travel umroh di Indonesia.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-[#D4AF37]">Manajemen Jamaah</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37]">Tracking Realtime</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37]">Laporan & Analitik</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Perusahaan</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-[#D4AF37]">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37]">Kontak</a></li>
                            <li><a href="#" className="hover:text-[#D4AF37]">Karir</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>📧 info@umrohsaas.com</li>
                            <li>📱 +62 812-3456-7890</li>
                            <li>📍 Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#1B5E20] mt-8 pt-8 text-center text-sm text-gray-300">
                    <p>&copy; 2026 Umroh SaaS. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
