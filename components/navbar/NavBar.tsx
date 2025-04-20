import React, { memo } from 'react';
import NavBarMenu from './NavBarMenu';
import { txt } from '@/nls/texts';
import Link from 'next/link';

const NavBar = () => {
    const Logo = memo(() => (
        <div className='mr-6 flex flex-shrink-0 items-center text-primaryDark'>
            <Link
                href={'/'}
                className='text-2xl font-bold uppercase tracking-tight'
            >
                {txt.title}
            </Link>
        </div>
    ));

    return (
        <nav className='z-[4] flex flex-wrap items-center justify-between border-b bg-accentLight p-6'>
            <Logo />
            <NavBarMenu />
        </nav>
    );
};

export default memo(NavBar);
