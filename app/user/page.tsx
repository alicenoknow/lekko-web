'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import ActionButton from '@/components/buttons/ActionButton';
import { txt } from '@/nls/texts';
import { PrivateContent } from '@/components/auth/PrivateContent';
import Spinner from '@/components/Spinner';
import Avatar from '@/components/ranking/Avatar';

export default function UserPage() {
    const { logout, user } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/user/login');
    };

    return (
        <PrivateContent redirect fallback={<Spinner />}>
            <main className='flex flex-col items-center justify-center gap-y-8 p-24'>
                <Avatar username={user?.username} size={60} />
                <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                    Hej {user?.username ?? ''}!
                </p>
                <ActionButton label={txt.user.logout} onClick={handleLogout} />
            </main>
        </PrivateContent>
    );
}
