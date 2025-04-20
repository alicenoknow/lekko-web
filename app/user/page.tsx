'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import ActionButton from '@/components/buttons/ActionButton';
import { txt } from '@/nls/texts';
import { PrivateContent } from '@/components/auth/PrivateContent';
import Spinner from '@/components/Spinner';

export default function UserPage() {
    const { logout, user } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/user/login');
    };

    return (
        <PrivateContent redirect fallback={<Spinner />}>
            <main className='items-center p-24'>
                <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                    Hej {user?.username ?? ''}!
                </p>
                <ActionButton label={txt.user.logOut} onClick={handleLogout} />
            </main>
        </PrivateContent>
    );
}
