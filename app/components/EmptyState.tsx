interface EmptyStateProps {
    icon: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-20">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-[#0F5132] mb-2">{title}</h3>
            {description && (
                <p className="text-gray-600 mb-6">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-[#0F5132] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
