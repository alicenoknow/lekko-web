'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';

export const HydrateUser = () => {
    const { setHydrated } = useUserStore();

    // Monitor token expiry and handle automatic logout
    useTokenMonitor();

    useEffect(() => {
        // The setHydrated function now handles secure token restoration internally
        setHydrated();
    }, [setHydrated]);

    return null;
};
