import React, { memo } from 'react';
import NavBarMenu from './NavBarMenu';
import { txt } from '@/nls/texts';
import Link from 'next/link';
import Image from 'next/image';

const Logo = memo(() => (
    <div className='text-primary-dark flex flex-shrink-0 items-center'>
        <Link href='/' className='flex items-center gap-3'>
            <Image
                src='/circles.svg'
                alt='Lekkoatletawka icon'
                width={12}
                height={12}
                className='block size-14 pl-4 sm:hidden'
                unoptimized
            />
            <span className='hidden text-2xl font-bold tracking-tight uppercase sm:inline'>
                {txt.title}
            </span>
        </Link>
    </div>
));
Logo.displayName = 'Logo';

const NavBar = () => (
    <nav className='bg-accent-light relative z-[4] flex flex-wrap items-center justify-evenly border-b px-0 py-2 sm:px-4 md:px-12 sm:py-4'>
        <Logo />
        <NavBarMenu />
    </nav>
);

export default memo(NavBar);
