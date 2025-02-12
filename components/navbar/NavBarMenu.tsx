'use client';

import React, { useState, useCallback, useContext, memo } from 'react';
import Link from 'next/link';
import { TextContext } from '@/contexts/TextContext';
import MenuLogo from './MenuLogo';

export function NavBarMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { rulesText, accountText, mainPageText, typerText, resultsText } =
        useContext(TextContext);

    const NavButton = useCallback(
        ({ title, link }: { title: string; link: string }) => {
            return (
                <Link
                    href={link}
                    className='ml-10 mt-4 block hover:text-primaryLight md:mt-0 md:inline-block'
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
                    className='z-[4] flex items-center rounded border-2 border-primaryDark px-3 py-2 text-primaryDark hover:border-primaryLight hover:text-primaryLight'
                >
                    <MenuLogo />
                </button>
            </div>
            <div
                className={`z-[4] ${isOpen ? 'block' : 'hidden'} block w-full flex-grow md:flex md:w-auto md:items-center`}
            >
                <div className='text-lg font-semibold uppercase text-primaryDark md:flex-grow'>
                    <NavButton title={mainPageText} link='/' />
                    <NavButton title={rulesText} link='/rules' />
                    <NavButton title={typerText} link='/typer' />
                    <NavButton title={resultsText} link='/results' />
                    <NavButton title={accountText} link='/user' />
                </div>
            </div>
        </>
    );
}

export default memo(NavBarMenu);
