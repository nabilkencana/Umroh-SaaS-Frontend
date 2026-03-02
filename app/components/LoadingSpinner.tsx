export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-[#0F5132] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                    🕌
                </div>
            </div>
        </div>
    );
}
