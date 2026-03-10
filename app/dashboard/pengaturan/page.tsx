'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PengaturanPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/pengaturan/profile');
    }, [router]);

    return null;
}
