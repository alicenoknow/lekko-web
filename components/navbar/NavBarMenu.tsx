'use client';

import React, { useState, memo } from 'react';
import MenuLogo from './MenuLogo';
import { txt } from '@/nls/texts';
import NavButton from './NavButton';
import UserNav from './UserNav';

export function NavBarMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className='z-[4] ml-auto block md:hidden'>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className='z-[4] flex items-center rounded border-2 border-primaryDark px-2 py-2 text-primaryDark hover:border-lightGray hover:text-lightGray'
                >
                    <MenuLogo />
                </button>
            </div>
            <div
                className={`z-[4] ${isOpen ? 'block' : 'hidden'} w-full flex-grow md:flex md:w-auto md:items-center`}
            >
                <div className='ml-auto flex flex-col gap-10 text-lg font-semibold uppercase text-primaryDark md:flex-row md:items-center md:gap-6'>
                    <NavButton title={txt.typer} link='/typer' />
                    <NavButton title={txt.ranking.title} link='/ranking' />
                    <UserNav />
                </div>
            </div>
        </>
    );
}

export default memo(NavBarMenu);
