'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

interface PrivateContentProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirect?: boolean;
}

export const PrivateContent = ({
    children,
    fallback = null,
    redirect = true,
}: PrivateContentProps) => {
    const { user, hydrated } = useUserStore();
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (hydrated) {
            if (!user && redirect) {
                router.replace('/user/login');
            } else {
                setIsReady(true);
            }
        }
    }, [hydrated, user, redirect, router]);

    if (!hydrated || (!user && redirect)) {
        return fallback;
    }

    if (!user && !redirect) {
        return fallback;
    }

    return <>{children}</>;
};
