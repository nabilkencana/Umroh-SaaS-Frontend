export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function calculateDaysLeft(endDate: string): number {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const distance = end - now;
    return Math.floor(distance / (1000 * 60 * 60 * 24));
}

export function isPromoActive(promo: { start_date?: string; end_date?: string }): boolean {
    const now = new Date();
    const start = promo.start_date ? new Date(promo.start_date) : null;
    const end = promo.end_date ? new Date(promo.end_date) : null;

    if (start && now < start) return false;
    if (end && now > end) return false;

    return true;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
