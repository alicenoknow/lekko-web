'use client';

import { txt } from '@/nls/texts';
import { memo } from 'react';
import Avatar from '../ranking/Avatar';
import { useRouter } from 'next/navigation';
import { usePrivateUserContext } from '@/context/PrivateUserContext';
import { PrivateContent } from '../auth/PrivateContent';
import NavButton from './NavButton';

const UserNav = memo(() => {
    const { user, logout } = usePrivateUserContext();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/user/login');
    };
    return (
        <div className='flex items-center gap-4'>
            <Avatar username={user.username} size={36} />
            <button
                onClick={handleLogout}
                className='mt-4 block uppercase hover:text-lightGray md:mt-0 md:inline-block'
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
