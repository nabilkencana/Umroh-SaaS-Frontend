'use client';

import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelpTooltipProps {
    content: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}

export default function HelpTooltip({
    content,
    position = 'top',
    className = ''
}: HelpTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2'
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                className="text-gray-400 hover:text-[#0F5132] transition-colors focus:outline-none"
                aria-label="Bantuan"
            >
                <QuestionMarkCircleIcon className="w-4 h-4" />
            </button>

            {isVisible && (
                <div
                    className={`absolute z-50 ${positionClasses[position]} w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg`}
                    role="tooltip"
                >
                    <div className="relative">
                        <p className="leading-relaxed">{content}</p>
                        {/* Arrow */}
                        <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                                position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -ml-1' :
                                    position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                                        'right-0 top-1/2 -translate-y-1/2 -mr-1'
                            }`} />
                    </div>
                </div>
            )}
        </div>
    );
}