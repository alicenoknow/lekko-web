'use client';

import { useUserStore } from '@/store/user';

interface AdminOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const AdminOnly = ({ children, fallback = null }: AdminOnlyProps) => {
    const { user, hydrated } = useUserStore();
    console.log('user', user);
    if (!hydrated) return null;

    const isAdmin = user?.roles?.includes('admin');
    return isAdmin ? <>{children}</> : <>{fallback}</>;
};
