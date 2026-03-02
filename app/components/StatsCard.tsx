interface StatsCardProps {
    label: string;
    value: number | string;
    icon: string;
    color: string;
}

export default function StatsCard({ label, value, icon, color }: StatsCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37] hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
                <span className="text-3xl font-bold text-[#0F5132]">{value}</span>
            </div>
            <p className="text-gray-600 font-medium">{label}</p>
        </div>
    );
}
