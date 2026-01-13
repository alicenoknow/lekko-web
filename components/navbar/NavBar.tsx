import React, { memo } from 'react';
import NavBarMenu from './NavBarMenu';
import { txt } from '@/nls/texts';
import Link from 'next/link';

const Logo = memo(() => (
    <div className='text-primary-dark mr-6 flex flex-shrink-0 items-center'>
        <Link
            href='/'
            className='hidden text-2xl font-bold tracking-tight uppercase sm:inline'
        >
            {txt.title}
        </Link>
    </div>
));
Logo.displayName = 'Logo';

const NavBar = () => (
    <nav className='bg-accent-light z-[4] flex flex-wrap items-center justify-evenly border-b px-6 py-6 md:px-12'>
        <Logo />
        <NavBarMenu />
    </nav>
);

export default memo(NavBar);
