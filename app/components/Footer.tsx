export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-[#0F5132] text-white mt-20">
            <div className="container mx-auto px-4 py-16">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                    {/* Company Info - Lebih besar kolomnya */}
                    <div className="md:col-span-4">
                        <h3 className="text-2xl font-bold mb-4 text-[#D4AF37] tracking-wide">
                            Umroh SaaS
                        </h3>
                        <p className="text-white/80 leading-relaxed max-w-md">
                            Platform manajemen umroh multi-tenant terpercaya untuk travel umroh di Indonesia. 
                            Solusi lengkap untuk kemudahan operasional travel umroh Anda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h4 className="font-semibold mb-4 text-white text-lg">Layanan</h4>
                        <ul className="space-y-3">
                            {['Manajemen Jamaah', 'Tracking Realtime', 'Laporan & Analitik'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href="#" 
                                        className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 text-sm"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="md:col-span-2">
                        <h4 className="font-semibold mb-4 text-white text-lg">Perusahaan</h4>
                        <ul className="space-y-3">
                            {['Tentang Kami', 'Kontak', 'Karir'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href="#" 
                                        className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 text-sm"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info - Tanpa icon */}
                    <div className="md:col-span-4">
                        <h4 className="font-semibold mb-4 text-white text-lg">Kontak</h4>
                        <div className="space-y-3 text-white/70 text-sm">
                            <div>info@umrohsaas.com</div>
                            <div>+62 812-3456-7890</div>
                            <div>Jakarta, Indonesia</div>
                            <div className="mt-4 pt-2">
                                <p className="text-white/60 text-xs">
                                    Senin - Jumat, 09:00 - 17:00 WIB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/60 text-sm">
                            © {currentYear} Umroh SaaS. Seluruh hak cipta dilindungi.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-white/60 hover:text-[#D4AF37] text-sm transition-colors duration-200">
                                Kebijakan Privasi
                            </a>
                            <a href="#" className="text-white/60 hover:text-[#D4AF37] text-sm transition-colors duration-200">
                                Syarat & Ketentuan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}