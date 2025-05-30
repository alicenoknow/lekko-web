import React, { memo } from 'react';
import NavBarMenu from './NavBarMenu';
import { txt } from '@/nls/texts';
import Link from 'next/link';

const Logo = memo(() => (
    <div className='mr-6 flex flex-shrink-0 items-center text-primaryDark'>
        <Link
            href='/'
            className='hidden text-2xl font-bold uppercase tracking-tight sm:inline'
        >
            {txt.title}
        </Link>
    </div>
));
Logo.displayName = 'Logo';

const NavBar = () => (
    <nav className='z-[4] flex flex-wrap items-center justify-evenly border-b bg-accentLight px-6 py-6 md:px-12'>
        <Logo />
        <NavBarMenu />
    </nav>
);

export default memo(NavBar);
