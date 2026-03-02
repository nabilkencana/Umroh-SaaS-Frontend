'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    endDate: string;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div className="flex justify-center gap-4">
            {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds },
            ].map((item) => (
                <div key={item.label} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#D4AF37]">{item.value}</div>
                    <div className="text-sm">{item.label}</div>
                </div>
            ))}
        </div>
    );
}
