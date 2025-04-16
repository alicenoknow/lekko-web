'use client';

import { PrivateUserContext } from '@/context/PrivateUserContext';
import { useUserStore } from '@/store/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PrivateContent({
    children,
    fallback = null,
    redirect = false,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirect?: boolean;
}) {
    const router = useRouter();
    const { user, token, hydrated } = useUserStore();

    useEffect(() => {
        if (hydrated && (!user || !token) && redirect) {
            router.replace('/user/login');
        }
    }, [hydrated, user, token, redirect, router]);

    if (!hydrated || !user || !token) return fallback;

    return (
        <PrivateUserContext.Provider value={{ user, token }}>
            {children}
        </PrivateUserContext.Provider>
    );
}
