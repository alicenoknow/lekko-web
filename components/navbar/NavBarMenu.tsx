'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import MenuLogo from './MenuLogo';
import { txt as txtData } from '@/nls/texts';

export function NavBarMenu() {
    const txt = useMemo(() => txtData, []);
    const [isOpen, setIsOpen] = useState(false);

    const NavButton = useCallback(
        ({ title, link }: { title: string; link: string }) => {
            return (
                <Link
                    href={link}
                    className='ml-3 mt-4 block hover:text-primaryLight md:mt-0 md:inline-block lg:ml-10'
                >
                    {title}
                </Link>
            );
        },
        []
    );

    return (
        <>
            <div className='z-[4] block md:hidden'>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className='z-[4] flex items-center rounded border-2 border-primaryDark px-2 py-2 text-primaryDark hover:border-primaryLight hover:text-primaryLight'
                >
                    <MenuLogo />
                </button>
            </div>
            <div
                className={`z-[4] ${isOpen ? 'block' : 'hidden'} block w-full flex-grow md:flex md:w-auto md:items-center`}
            >
                <div className='text-lg font-semibold uppercase text-primaryDark md:flex-grow'>
                    <NavButton title={txt.mainPage} link='/' />
                    <NavButton title={txt.rules} link='/rules' />
                    <NavButton title={txt.typer} link='/typer' />
                    <NavButton title={txt.results} link='/results' />
                    <NavButton title={txt.account} link='/user' />
                </div>
            </div>
        </>
    );
}

export default memo(NavBarMenu);
