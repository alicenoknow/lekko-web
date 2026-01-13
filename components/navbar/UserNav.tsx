'use client';

import { txt } from '@/nls/texts';
import { memo } from 'react';
import Avatar from '../ranking/Avatar';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { PrivateContent } from '../auth/PrivateContent';
import NavButton from './NavButton';

const UserNav = memo(function UserNav() {
    const { user, logout } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/user/login');
    };

    if (!user) return null;

    return (
        <div className='flex items-center gap-4'>
            <Avatar username={user.username} size={36} />
            <button
                onClick={handleLogout}
                className='hover:text-light-gray mt-4 block uppercase md:mt-0 md:inline-block'
            >
                {txt.user.logout}
            </button>
        </div>
    );
});

export default function WrappedUserNav() {
    return (
        <PrivateContent
            fallback={<NavButton title={txt.user.login} link='/user/login' />}
        >
            <UserNav />
        </PrivateContent>
    );
}
