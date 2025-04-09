'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user';

export const HydrateUser = () => {
    const { setUserFromToken, setHydrated } = useUserStore();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUserFromToken(token);
        setHydrated();
    }, []);

    return null;
};
