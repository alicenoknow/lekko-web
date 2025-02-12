'use client';

import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function User() {
    const { token, loading, username } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            console.log('No token, redirected to login');
            router.push('/user/login');
        }
    }, [token, router]);

    if (loading || !token) {
        return null;
    }

    return (
        <main className='items-center p-24'>
            <div>Hello {username}</div>
        </main>
    );
}
